from fastapi import APIRouter, Depends, Request, Response

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
    return await user_service.create_user(user_create)

@router.post(
    "/login",
    response_model=UserLoginResponse,
)
async def login_user(
    user_login: UserLoginRequest,
    response: Response,
    user_service: UserService = Depends()
):
    return await user_service.login_user(user_login, response)

@router.get(
    "/session",
    response_model=UserSessionResponse,
)
async def get_user_session(
    request: Request,
    user_service: UserService = Depends()
):
    return await user_service.get_user_session(request)

@router.post(
    "/logout",
    response_model=UserLoginResponse,
)
async def logout_user(
    response: Response,
    user_service: UserService = Depends()
):
    return await user_service.logout_user(response)