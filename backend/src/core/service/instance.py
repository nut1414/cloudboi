from fastapi import Depends
import asyncio

from ..models.Instance import InstanceDetails
from ..sql.operations.instance import InstanceOperation


class InstanceService:
    def __init__(self, instance_opr: InstanceOperation = Depends()):
        self.instance_opr = instance_opr
    
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