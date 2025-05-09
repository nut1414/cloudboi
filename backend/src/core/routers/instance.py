from typing import List
from fastapi import APIRouter, Depends, WebSocket
from dependency_injector.wiring import Provide, inject
from fastapi.websockets import WebSocketState


from ..service.helpers.instance_helper import InstanceHelper
from ..utils.logging import logger
from ..utils.dependencies import get_current_user, get_current_user_ws
from ..service.instance import InstanceService
from ..models.instance import BaseInstanceState, InstanceDetails, InstanceCreateRequest, InstanceCreateResponse, InstanceResetPasswordRequest, UserInstanceResponse, InstanceControlResponse
from ..container import AppContainer


router = APIRouter(
    prefix="/instance",
    tags=["instance"],
)

@router.get(
    "/details",
    response_model=InstanceDetails,
    dependencies=[Depends(get_current_user)]
)
@inject
async def instance_details(
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service])
):
    return await instance_service.get_all_instance_details()

@router.get(
    "/list/{username}",
    response_model=List[UserInstanceResponse],
    dependencies=[Depends(get_current_user)]
)
@inject
async def list_instances(
    username: str,
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service])
):
    return await instance_service.get_all_user_instances(username=username)

@router.get(
    "/{instance_name}",
    response_model=UserInstanceResponse,
    dependencies=[Depends(get_current_user)]
)
@inject
async def get_instance(
    instance_name: str,
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service])
):
    result = await instance_service.get_instance(instance_name=instance_name)
    return InstanceHelper.to_instance_response_model(result)

@router.post(
    "/create",
    response_model=InstanceCreateResponse,
    dependencies=[Depends(get_current_user)]
)
@inject
async def create_instance(
    instance_create: InstanceCreateRequest,
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service])
):
    return await instance_service.create_instance(instance_create)

@router.post(
    "/{instance_name}/start",
    response_model=InstanceControlResponse,
    dependencies=[Depends(get_current_user)]
)
@inject
async def start_instance(
    instance_name: str,
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service])
):
    return await instance_service.start_instance(instance_name=instance_name)

@router.post(
    "/{instance_name}/stop",
    response_model=InstanceControlResponse,
    dependencies=[Depends(get_current_user)]
)
@inject
async def stop_instance(
    instance_name: str,
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service])
):
    return await instance_service.stop_instance(instance_name=instance_name)

@router.post(
    "/{instance_name}/delete",
    response_model=InstanceControlResponse,
    dependencies=[Depends(get_current_user)]
)
@inject
async def delete_instance(
    instance_name: str,
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service])
):
    return await instance_service.delete_instance(instance_name=instance_name)

@router.post(
    "/{instance_name}/restart",
    response_model=InstanceControlResponse,
    dependencies=[Depends(get_current_user)]
)
@inject
async def restart_instance(
    instance_name: str,
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service])
):
    await instance_service.stop_instance(instance_name=instance_name)
    return await instance_service.start_instance(instance_name=instance_name)

@router.websocket(
    "/ws/terminal/{instance_name}",
    dependencies=[Depends(get_current_user_ws)]
)
@inject
async def terminal_websocket_instance(
    websocket: WebSocket,
    instance_name: str,
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service]),
):
    try:
        await instance_service.terminal_websocket_session(instance_name=instance_name, client_ws=websocket)
    except Exception as e:
        logger.error(f"Failed to create websocket session: {str(e)}")
        if websocket.client_state != WebSocketState.DISCONNECTED:
            await websocket.close(code=1011, reason=str(e))

@router.websocket(
    "/ws/console/{instance_name}",
    dependencies=[Depends(get_current_user_ws)]
)
@inject
async def console_websocket_instance(
    websocket: WebSocket,
    instance_name: str,
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service]),
):
    try:
        await instance_service.console_websocket_session(instance_name=instance_name, client_ws=websocket)
    except Exception as e:
        logger.error(f"Failed to create console websocket session: {str(e)}")
        if websocket.client_state != WebSocketState.DISCONNECTED:
            await websocket.close(code=1011, reason=str(e))

@router.get(
    "/{instance_name}/console-buffer",
    response_model=str,
    dependencies=[Depends(get_current_user)]
)
@inject
async def get_instance_console_buffer(
    instance_name: str,
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service])
):
    return await instance_service.get_instance_console_buffer(instance_name=instance_name)

@router.get(
    "/{instance_name}/state",
    response_model=BaseInstanceState,
    dependencies=[Depends(get_current_user)]
)
@inject
async def get_instance_state(
    instance_name: str,
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service])
):
    return await instance_service.get_instance_state(instance_name=instance_name)

@router.post(
    "/{instance_name}/reset-password",
    response_model=InstanceControlResponse,
    dependencies=[Depends(get_current_user)]
)
@inject
async def reset_instance_password(
    instance_name: str,
    reset_password_request: InstanceResetPasswordRequest,
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service])
):
    return await instance_service.reset_instance_password(instance_name=instance_name, reset_password_request=reset_password_request)

