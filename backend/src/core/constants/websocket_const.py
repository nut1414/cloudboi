from enum import Enum

class MessageType(str, Enum):
    """Enum for WebSocket message types that match the front-end constants."""
    TERMINAL_RESIZE = "TERMINAL_RESIZE"
    TERMINAL_INPUT = "TERMINAL_INPUT"