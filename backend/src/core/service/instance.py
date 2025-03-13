from typing import Optional
import uuid
from fastapi import Depends, WebSocket
import asyncio

from . import SubscriptionService, UserService
from .clients.base_instance_client import BaseInstanceClient
from .validators.instance_validator import InstanceValidator
from .clients.lxd import LXDClient
from ..models.instance import InstanceCreateRequest, InstanceCreateResponse, InstanceDetails
from ..sql.operations.instance import InstanceOperation
from ..utils.dependencies import user_session_ctx


class InstanceService:
    def __init__(
        self,
        user_service: UserService = Depends(),
        subscription_service: SubscriptionService = Depends(),
        instance_opr: InstanceOperation = Depends(),
        lxd_client: BaseInstanceClient = Depends(LXDClient.get_client)
    ):
        self.user_service = user_service
        self.subscription_service = subscription_service
        self.instance_opr = instance_opr
        self.lxd_client = lxd_client
    
    async def get_all_instance_details(self) -> InstanceDetails:
        async with asyncio.TaskGroup() as tg:
            instance_plans_task = tg.create_task(
                self.instance_opr.get_all_instance_plans()
            )
            os_types_task = tg.create_task(
                self.instance_opr.get_all_os_types()
            )
        
        return InstanceDetails(
            instance_package=instance_plans_task.result(),
            os_image=os_types_task.result()
        )
    
    async def create_instance(self, instance_create: InstanceCreateRequest) -> InstanceCreateResponse:
        # Validate instance_create
        async with asyncio.TaskGroup() as tg:
            instance_plan_task = tg.create_task(
                self.instance_opr.get_instance_plan_by_id(instance_create.instance_plan.instance_plan_id)
            )
            os_type_task = tg.create_task(
                self.instance_opr.get_os_type_by_id(instance_create.os_type.os_type_id)
            )
        if not instance_plan_task.result() or not os_type_task.result():
            raise ValueError("Invalid instance plan or os type")
        InstanceValidator.validate_password(instance_create.root_password)
        
        # Create instance in LXD
        instance = self.lxd_client.create_instance(instance_create)
        if not instance:
            raise RuntimeError("Failed to create instance")
        
        # Create instance in DB
        created_instance = await self.instance_opr.upsert_user_instance(instance)

        # Create subscription
        await self.subscription_service.create_subscription(
            user_id=user_session_ctx.get().user_id,
            instance_id=created_instance.instance_id,
            instance_plan=instance_plan_task.result()
        )

        return InstanceCreateResponse(
            instance_name=created_instance.hostname,
            instance_status=created_instance.status,
            created_at=created_instance.created_at
        )
    
    async def delete_instance(
        self,
        instance_id: Optional[uuid.UUID] = None,
        instance_name: Optional[str] = None
    ) -> None:
        if not instance_id and not instance_name:
            raise ValueError("Instance ID or name is required")
        
        if instance_id:
            instance = await self.instance_opr.get_user_instance(instance_id=instance_id)
        else:
            instance = await self.instance_opr.get_user_instance(
                username=user_session_ctx.get().username,
                instance_name=instance_name
            )
        if not instance:
            raise ValueError("Instance not found")
        
        # Delete instance in LXD
        self.lxd_client.delete_instance(instance.hostname)

        # Delete instance in DB
        await self.instance_opr.delete_user_instance(instance.instance_id)
    
    async def websocket_session(self, instance_name: str, client_ws: WebSocket):
        # Validate if user has access to instance
        user = await self.user_service.get_user_session_websocket(client_ws)
        instance = await self.instance_opr.get_user_instance_by_name(user.username, instance_name)

        if not instance:
            raise ValueError("Instance not found")
        
        await self.lxd_client.websocket_session(instance, client_ws)