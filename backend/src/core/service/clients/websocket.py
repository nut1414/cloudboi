import asyncio
import json
import ssl
from typing import List, Optional, Any, Union
from fastapi import WebSocket, WebSocketDisconnect
import websockets

from ...utils.logging import logger
from ...commons.exception import create_exception_class
from ...constants.websocket_const import MessageType


WebSocketException = create_exception_class("WebSocket")

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
        self.lxd_control: Optional[Any] = None
        self._running = False
        self._tasks: List[asyncio.Task] = []
    
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
                try:
                    message_data = json.loads(message)
                    if isinstance(message_data, dict) and 'type' in message_data:
                        message_type = message_data['type']
                        payload = message_data.get('payload', {})
                        if message_type == MessageType.TERMINAL_RESIZE:
                            await self._handle_resize(payload)
                            continue
                        elif message_type == MessageType.TERMINAL_INPUT:
                            data_to_send = payload
                        else:
                            raise WebSocketException(f"Invalid message type: {message_type}")
                except json.JSONDecodeError:
                    # Normal string input
                    data_to_send = message
                bytearray_data = self._to_uint8_array(data_to_send)
                await self.lxd_ws.send(bytearray_data)
        except (asyncio.CancelledError, WebSocketDisconnect) as e:
            raise WebSocketException(f"Client connection ended: {str(e)}")
        except Exception as e:
            raise WebSocketException(f"Error in client_to_lxd: {str(e)}")

    async def _lxd_to_client(self):
        """Handle messages from LXD to the client"""
        try:
            while self._running:
                message = await self.lxd_ws.recv()
                await self.client_ws.send_bytes(
                    message if isinstance(message, bytes) 
                    else message.encode('utf-8')
                )
        except (asyncio.CancelledError, websockets.exceptions.ConnectionClosed) as e:
            raise WebSocketException(f"LXD connection ended: {str(e)}")
        except Exception as e:
            raise WebSocketException(f"Error in lxd_to_client: {str(e)}")

    async def _start_tasks(self):
        """Create and start the forwarding tasks"""
        try:
            self._tasks.extend([
                asyncio.create_task(self._client_to_lxd()),
                asyncio.create_task(self._lxd_to_client())
            ])
        except Exception as e:
            raise WebSocketException(f"Failed to start tasks: {str(e)}")
    
    def _to_uint8_array(self, data: Union[str, dict]) -> bytearray:
        """Convert a string or dictionary to a Uint8Array"""
        if isinstance(data, dict):
            data = json.dumps(data)
        elif not isinstance(data, str):
            data = str(data)
        return bytearray(data.encode('utf-8'))

    async def _handle_resize(self, resize_args: dict):
        """Handle terminal resize events"""
        try:
            resize_data = {
                'command': 'window-resize',
                'args': {
                    'width': resize_args.get('width', '80'),
                    'height': resize_args.get('height', '24')
                }
            }
            await self.lxd_control.send(json.dumps(resize_data))
        except Exception as e:
            raise WebSocketException(f"Failed to handle resize event: {str(e)}")

    async def run(self):
        """Start the WebSocket forwarding"""
        try:
            done, _ = await asyncio.wait(
                self._tasks,
                return_when=asyncio.FIRST_COMPLETED
            )
            
            # Check for exceptions in completed tasks
            for task in done:
                if task.exception():
                    raise task.exception()
        except asyncio.CancelledError:
            raise WebSocketException(f"WebSocket session cancelled: {str(self.instance_name)}")
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