from fastapi import APIRouter, Depends, HTTPException, WebSocket

from ..utils.logging import logger
from ..service.clients.base_instance_client import BaseInstanceClient
from ..service.clients.lxd import LXDClient
from ..service.instance import InstanceService
from ..models.instance import InstanceDetails, InstanceCreateRequest, InstanceCreateResponse
from ..utils.dependencies import get_current_user


router = APIRouter(
    prefix="/instance",
    tags=["instance"],
    dependencies=[Depends(get_current_user)]
)

@router.get(
    "/details",
    response_model=InstanceDetails,
)
async def instance_details(
    instance_service: InstanceService = Depends()
):
    return await instance_service.get_all_instance_details()

@router.post(
    "/create",
    response_model=InstanceCreateResponse,
)
async def create_instance(
    instance_create: InstanceCreateRequest,
    instance_service: InstanceService = Depends()
):
    return await instance_service.create_instance(instance_create)

@router.websocket("/ws/{instance_name}")
async def websocket_instance(
    websocket: WebSocket,
    instance_name: str,
    lxd_client: BaseInstanceClient = Depends(LXDClient.get_client)
):
    try:
        await lxd_client.websocket_session(instance_name, websocket)
    except Exception as e:
        logger.error(f"Failed to create websocket session: {str(e)}")
        await websocket.close(code=1011, reason=str(e))
        raise HTTPException(status_code=500, detail="Failed to create websocket session")
