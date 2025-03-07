from fastapi import Depends
import asyncio


from .clients.base_instance_client import BaseInstanceClient
from .validators.instance_validator import InstanceValidator
from .clients.lxd import LXDClient
from ..models.instance import InstanceCreateRequest, InstanceCreateResponse, InstanceDetails
from ..sql.operations.instance import InstanceOperation


class InstanceService:
    def __init__(
        self,
        instance_opr: InstanceOperation = Depends(),
        lxd_client: BaseInstanceClient = Depends(LXDClient.get_client)
    ):
        self.instance_opr = instance_opr
        self.lxd_client = lxd_client
    
    async def get_all_instance_details(self) -> InstanceDetails:
        async with asyncio.TaskGroup() as tg:
            instance_types_task = tg.create_task(
                self.instance_opr.get_all_instance_types()
            )
            os_types_task = tg.create_task(
                self.instance_opr.get_all_os_types()
            )
        
        return InstanceDetails(
            instance_package=instance_types_task.result(),
            os_image=os_types_task.result()
        )
    
    async def create_instance(self, instance_create: InstanceCreateRequest) -> InstanceCreateResponse:
        # Validate instance_create
        async with asyncio.TaskGroup() as tg:
            instance_type_task = tg.create_task(
                self.instance_opr.get_instance_type_by_id(instance_create.instance_type.instance_type_id)
            )
            os_type_task = tg.create_task(
                self.instance_opr.get_os_type_by_id(instance_create.os_type.os_type_id)
            )
        if not instance_type_task.result() or not os_type_task.result():
            raise ValueError("Invalid instance type or os type")
        if not InstanceValidator.validate_password(instance_create.root_password):
            raise ValueError("Invalid password format")
        
        # Create instance
        instance = self.lxd_client.create_instance(instance_create)
        if not instance:
            raise RuntimeError("Failed to create instance")

        return instance
        # TODO: Add subscription logic here