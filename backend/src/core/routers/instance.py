from fastapi import APIRouter, Depends, HTTPException, WebSocket

from ..utils.logging import logger
from ..service.clients.base_instance_client import BaseInstanceClient
from ..service.clients.lxd import LXDClient
from ..service.instance import InstanceService
from ..models.Instance import InstanceDetails, InstanceCreateRequest, InstanceCreateResponse


router = APIRouter(
    prefix="/instances",
    tags=["instances"],
)

@router.get(
    "/",
    response_model=InstanceDetails,
)
async def instance_details(
    instance_service: InstanceService = Depends()
):
    try:
        return await instance_service.get_all_instance_details()
    except Exception as e:
        logger.error(f"Failed to get instance details: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get instance details")

@router.post(
    "/create",
    response_model=InstanceCreateResponse,
)
async def create_instance(
    instance_create: InstanceCreateRequest,
    instance_service: InstanceService = Depends()
):
    try:
        return await instance_service.create_instance(instance_create)
    except Exception as e:
        logger.error(f"Failed to create instance: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create instance")

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
