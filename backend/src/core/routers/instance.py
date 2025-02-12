from fastapi import APIRouter, Depends
from ..service.instance import InstanceService
from ..models.Instance import InstanceDetails


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