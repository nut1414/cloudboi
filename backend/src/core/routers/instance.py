from fastapi import APIRouter, Depends
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