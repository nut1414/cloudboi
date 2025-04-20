from fastapi import APIRouter, Depends, Request, Response
from dependency_injector.wiring import Provide, inject

from ..service.user import UserService
from ..models.user import UserCreateRequest, UserCreateResponse, UserLoginRequest, UserLoginResponse, UserSessionResponse
from ..container import AppContainer

router = APIRouter(
    prefix="/user",
    tags=["user"],
)

@router.post(
    "/register",
    response_model=UserCreateResponse,
)
@inject
async def create_user(
    user_create: UserCreateRequest,
    user_service: UserService = Depends(Provide[AppContainer.user_service])
):
    return await user_service.create_user(user_create)

@router.post(
    "/admin/create",
    response_model=UserCreateResponse,
    include_in_schema=False
)
@inject
async def create_admin_user(
    user_create: UserCreateRequest, 
    user_service: UserService = Depends(Provide[AppContainer.user_service])
):
    return await user_service.create_admin_user(user_create)

@router.post(
    "/login",
    response_model=UserLoginResponse,
)
@inject
async def login_user(
    user_login: UserLoginRequest,
    response: Response,
    user_service: UserService = Depends(Provide[AppContainer.user_service])
):
    return await user_service.login_user(user_login, response)

@router.get(
    "/session",
    response_model=UserSessionResponse,
)
@inject
async def get_user_session(
    request: Request,
    user_service: UserService = Depends(Provide[AppContainer.user_service])
):
    return await user_service.get_user_session(request)

@router.post(
    "/logout",
    response_model=UserLoginResponse,
)
@inject
async def logout_user(
    response: Response,
    user_service: UserService = Depends(Provide[AppContainer.user_service])
):
    return await user_service.logout_user(response)