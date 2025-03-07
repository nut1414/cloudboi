from fastapi import APIRouter, Depends, HTTPException, Request, Response

from ..utils.logging import logger
from ..service.user import UserService
from ..models.user import UserCreateRequest, UserCreateResponse, UserLoginRequest, UserLoginResponse, UserSessionResponse

router = APIRouter(
    prefix="/user",
    tags=["user"],
)

@router.post(
    "/register",
    response_model=UserCreateResponse,
)
async def create_user(
    user_create: UserCreateRequest,
    user_service: UserService = Depends()
):
    try:
        user = await user_service.create_user(user_create)
        return user
    except HTTPException as e:
        logger.error(f"Error creating user: {e}")
        raise e
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user")

@router.post(
    "/login",
    response_model=UserLoginResponse,
)
async def login_user(
    user_login: UserLoginRequest,
    response: Response,
    user_service: UserService = Depends()
):
    try:
        return await user_service.login_user(user_login, response)
    except HTTPException as e:
        logger.error(f"Error logging in user: {e}")
        raise e
    except Exception as e:
        logger.error(f"Error logging in user: {e}")
        raise HTTPException(status_code=500, detail="Failed to login user")

@router.get(
    "/session",
    response_model=UserSessionResponse,
)
async def get_user_session(
    request: Request,
    user_service: UserService = Depends()
):
    try:
        return await user_service.get_user_session(request)
    except HTTPException as e:
        logger.error(f"Error getting user session: {e}")
        raise e
    except Exception as e:
        logger.error(f"Error getting user session: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user session")

@router.post(
    "/logout",
    response_model=UserLoginResponse,
)
async def logout_user(
    response: Response,
    user_service: UserService = Depends()
):
    try:
        return await user_service.logout_user(response)
    except HTTPException as e:
        logger.error(f"Error logging out user: {e}")
        raise e
    except Exception as e:
        logger.error(f"Error logging out user: {e}")
        raise HTTPException(status_code=500, detail="Failed to logout user")