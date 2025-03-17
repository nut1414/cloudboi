from typing import Callable, Optional
from fastapi import Depends, HTTPException, Request, WebSocket, status
from contextvars import ContextVar

from ..models.user import UserSessionResponse, UserInDB
from ..service.user import UserService

# Context variable to store the current user session
user_session_ctx: ContextVar[Optional[UserInDB]] = ContextVar("user_session", default=None)

# Define the dependency functions with placeholders
_user_service_provider = None

# Define a dependency that gets the current user
async def get_current_user(
    request: Request
) -> UserSessionResponse:
    if _user_service_provider is None:
        raise RuntimeError("Auth system not initialized. Call configure_auth() before using authentication.")
    
    user_service: UserService = _user_service_provider()
    user_session = await user_service.get_user_session(request)
    if not user_session.is_authenticated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Store the user session in the context
    user_session_ctx.set(await user_service.user_opr.get_user_by_username(user_session.username))
    return user_session

async def get_current_user_ws(
    websocket: WebSocket
) -> UserSessionResponse:
    if _user_service_provider is None:
        raise RuntimeError("Auth system not initialized. Call configure_auth() before using authentication.")
    
    user_service: UserService = _user_service_provider()
    user_session = await user_service.get_user_session_websocket(websocket)
    if not user_session.is_authenticated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Store the user session in the context
    user_session_ctx.set(await user_service.user_opr.get_user_by_username(user_session.username))
    return user_session

# Use the previous dependency for admin check
async def get_admin_user(
    current_user: UserSessionResponse = Depends(get_current_user)
) -> UserSessionResponse:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    return current_user

def configure_auth(user_service_provider: Callable):
    global _user_service_provider
    _user_service_provider = user_service_provider