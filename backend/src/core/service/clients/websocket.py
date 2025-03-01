import asyncio
import json
import re
import ssl
import time
from typing import List, Optional, Any
from fastapi import WebSocket, WebSocketDisconnect
import websockets

from ...utils.logging import logger
from ...commons.exception import create_exception_class


WebSocketException = create_exception_class("WebSocket")

# Message types that match the front-end constants
MESSAGE_TYPES = {
    "TERMINAL_RESIZE": "TERMINAL_RESIZE",
    "TERMINAL_INPUT": "TERMINAL_INPUT"
}

class LXDWebSocketSession:
    def __init__(
        self, 
        client_ws: WebSocket,
        instance_name: str,
        lxd_ws_url: str,
        lxd_control_url: str
    ):
        self.client_ws = client_ws
        self.instance_name = instance_name
        self.lxd_ws_url = lxd_ws_url
        self.lxd_control_url = lxd_control_url
        self.lxd_ws: Optional[Any] = None
        self.lxd_control: Optional[Any] = None # For sending control messages, Ex. terminal resize
        self._running = False
        self._tasks: List[asyncio.Task] = []

        # Simplified command tracking (just the last command)
        self._last_command = ""
        self._last_command_time = 0
        
        # Command expiration timeout
        self._command_timeout = 0.5
    
    async def __aenter__(self):
        await self.connect()
        return self
    
    async def __aexit__(self, exc_type, exc_value, traceback):
        await self.disconnect()

    async def connect(self):
        """Establish connections to both LXD WebSockets"""
        try:
            ssl_context = ssl.create_default_context()
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl.CERT_NONE

            self.lxd_ws = await websockets.connect(self.lxd_ws_url, ssl=ssl_context)
            self.lxd_control = await websockets.connect(self.lxd_control_url, ssl=ssl_context)
            self._running = True

            await self._start_tasks()
        except Exception as e:
            await self.disconnect()
            raise WebSocketException(f"Failed to connect to LXD WebSockets: {str(e)}")

    async def disconnect(self):
        """Clean up all connections and tasks"""
        self._running = False
        
        # Cancel all tasks in the list
        for task in self._tasks:
            if not task.done():
                task.cancel()
        
        # Wait for all tasks to be cancelled
        if self._tasks:
            try:
                await asyncio.gather(*self._tasks, return_exceptions=True)
            except asyncio.CancelledError:
                pass
            self._tasks = []

        if self.lxd_ws:
            await self.lxd_ws.close()
            self.lxd_ws = None

        if self.lxd_control:
            await self.lxd_control.close()
            self.lxd_control = None
    
    async def _client_to_lxd(self):
        """Handle messages from the client to LXD"""
        try:
            while self._running:
                message = await self.client_ws.receive_text()
                
                # Try to parse as JSON to check if it's a control message
                try:
                    data = json.loads(message)
                    
                    # Check if it's a structured message with type
                    if isinstance(data, dict) and 'type' in data:
                        message_type = data.get('type')
                        payload = data.get('payload')
                        
                        # Handle different message types
                        if message_type == MESSAGE_TYPES["TERMINAL_RESIZE"]:
                            await self._handle_resize(payload)
                            continue
                        elif message_type == MESSAGE_TYPES["TERMINAL_INPUT"]:
                            # Extract terminal input from the payload
                            message = payload
                        else:
                            # Unknown message type, log it
                            logger.warning(f"Unknown message type: {message_type}")
                            continue
                except json.JSONDecodeError:
                    # Not JSON, treat as regular terminal input
                    pass
                
                # Ensure the message ends with carriage return for terminal input
                if not message.endswith("\r"):
                    message += "\r"

                # Update the last command info
                self._last_command = message.strip()
                self._last_command_time = time.time()
                
                # Send to LXD
                binary_message = message.encode('utf-8')
                await self.lxd_ws.send(binary_message)
        except WebSocketDisconnect:
            logger.info(f"Client disconnected from instance {self.instance_name}")
        except Exception as e:
            raise WebSocketException(f"Error in client_to_lxd: {str(e)}")
    
    async def _lxd_to_client(self):
        """Handle messages from LXD to the client"""
        try:
            # Use a small fixed buffer size to limit memory usage
            buffer = ""
            
            while self._running:
                message = await self.lxd_ws.recv()

                if isinstance(message, bytes):
                    message = message.decode('utf-8', 'replace')
                
                # Add to buffer
                buffer += message
                
                # Process the buffer to remove echoes and duplicate prompts
                if buffer and self._process_buffer(buffer):
                    await self.client_ws.send_text(buffer)
                buffer = ""
        except websockets.exceptions.ConnectionClosed:
            logger.info(f"LXD connection closed for instance {self.instance_name}")
        except Exception as e:
            raise WebSocketException(f"Error in lxd_to_client: {str(e)}")

    async def _start_tasks(self):
        """Create and start the forwarding tasks"""
        try:
            client_to_lxd_task = asyncio.create_task(self._client_to_lxd())
            self._tasks.append(client_to_lxd_task)

            lxd_to_client_task = asyncio.create_task(self._lxd_to_client())
            self._tasks.append(lxd_to_client_task)

        except Exception as e:
            raise WebSocketException(f"Failed to start tasks: {str(e)}")
    
    def _process_buffer(self, buffer: str) -> bool:
        """Process the buffer to remove echoes"""
        should_send = True

        # Check if the last command is still valid (not expired)
        current_time = time.time()
        if (self._last_command and (current_time - self._last_command_time <= self._command_timeout) 
            and buffer.startswith(self._last_command)):
            # Found echo of the last command
            should_send = False
        
        return should_send

    async def _handle_resize(self, message: dict):
        """Handle terminal resize events"""
        try:
            resize_data = {
                'command': 'window-resize',
                'args': {
                    'width': message.get('cols', 80),
                    'height': message.get('rows', 24)
                }
            }
            await self.lxd_control.send(json.dumps(resize_data))
        except Exception as e:
            raise WebSocketException(f"Failed to handle resize event: {str(e)}")

    async def run(self):
        """Start the WebSocket forwarding"""
        try:
            done, pending = await asyncio.wait(
                self._tasks,
                return_when=asyncio.FIRST_COMPLETED
            )

            for task in done:
                if task.exception():
                    raise task.exception()

        except Exception as e:
            raise WebSocketException(f"Error in WebSocket session: {str(e)}")
        finally:
            await self.disconnect()

class LXDWebSocketManager:
    def __init__(self):
        self.active_sessions: dict[str, LXDWebSocketSession] = {}

    async def create_session(
        self, 
        client_ws: WebSocket,
        instance_name: str,
        lxd_ws_url: str,
        lxd_control_url: str
    ) -> LXDWebSocketSession:
        """Create and store a new WebSocket session"""
        session = LXDWebSocketSession(
            client_ws=client_ws,
            instance_name=instance_name,
            lxd_ws_url=lxd_ws_url,
            lxd_control_url=lxd_control_url
        )
        self.active_sessions[instance_name] = session
        return session

    async def remove_session(self, instance_name: str):
        """Remove and cleanup a WebSocket session"""
        if instance_name in self.active_sessions:
            session = self.active_sessions[instance_name]
            await session.disconnect()
            del self.active_sessions[instance_name]