from fastapi import APIRouter, Depends, HTTPException, WebSocket
from dependency_injector.wiring import Provide, inject
from fastapi.websockets import WebSocketState

from ..utils.logging import logger
from ..utils.dependencies import get_current_user, get_current_user_ws
from ..service.instance import InstanceService
from ..models.instance import InstanceDetails, InstanceCreateRequest, InstanceCreateResponse
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

@router.websocket(
    "/ws/{instance_name}",
    dependencies=[Depends(get_current_user_ws)]
)
@inject
async def websocket_instance(
    websocket: WebSocket,
    instance_name: str,
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service]),
):
    try:
        await instance_service.websocket_session(instance_name, websocket)
    except Exception as e:
        logger.error(f"Failed to create websocket session: {str(e)}")
        if websocket.client_state != WebSocketState.DISCONNECTED:
            await websocket.close(code=1011, reason=str(e))