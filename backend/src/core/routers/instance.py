from fastapi import APIRouter, Depends, HTTPException, WebSocket
from dependency_injector.wiring import Provide, inject

from ..utils.logging import logger
from ..utils.dependencies import get_current_user
from ..service.instance import InstanceService
from ..models.instance import InstanceDetails, InstanceCreateRequest, InstanceCreateResponse
from ..container import AppContainer


router = APIRouter(
    prefix="/instance",
    tags=["instance"],
    dependencies=[Depends(get_current_user)],
)

@router.get(
    "/details",
    response_model=InstanceDetails,
)
@inject
async def instance_details(
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service])
):
    return await instance_service.get_all_instance_details()

@router.post(
    "/create",
    response_model=InstanceCreateResponse,
)
@inject
async def create_instance(
    instance_create: InstanceCreateRequest,
    instance_service: InstanceService = Depends(Provide[AppContainer.instance_service])
):
    return await instance_service.create_instance(instance_create)

@router.websocket("/ws/{instance_name}")
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
        await websocket.close(code=1011, reason=str(e))
        raise HTTPException(status_code=500, detail="Failed to create websocket session")
