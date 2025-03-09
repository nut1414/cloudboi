from typing import Annotated
from fastapi import Depends, HTTPException, Request, status

from ..models.user import UserSessionResponse
from ..service.user import UserService

# Define a dependency that gets the current user
async def get_current_user(
    request: Request,
    user_service: UserService = Depends()
) -> UserSessionResponse:
    user_session = await user_service.get_user_session(request)
    if not user_session.is_authenticated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
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