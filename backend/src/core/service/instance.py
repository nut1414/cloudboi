from typing import List, Optional
import uuid
from fastapi import HTTPException, WebSocket
import asyncio

from ..utils.datetime import DateTimeUtils
from .subscription import SubscriptionService
from .clients.base_instance_client import BaseInstanceClient
from .validators.instance_validator import InstanceValidator
from ..models.instance import (
    InstanceCreateRequest,
    InstanceCreateResponse,
    InstanceDetails,
    UserInstanceFromDB,
    UserInstanceResponse,
    InstanceControlResponse,
    BaseInstanceState,
    InstanceResetPasswordRequest
)
from ..sql.operations import InstanceOperation
from ..utils.dependencies import user_session_ctx
from .helpers.instance_helper import InstanceHelper
from ..utils.permission import require_roles, require_instance_ownership, require_account_ownership
from ..constants.user_const import UserRole


class InstanceService:
    def __init__(
        self,
        subscription_service: SubscriptionService,
        instance_opr: InstanceOperation,
        lxd_client: BaseInstanceClient
    ):
        self.subscription_service = subscription_service
        self.instance_opr = instance_opr
        self.lxd_client = lxd_client
    
    @require_roles([UserRole.ADMIN, UserRole.USER])
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
    
    @require_roles([UserRole.ADMIN, UserRole.USER])
    @require_account_ownership()
    async def get_all_user_instances(self, username: str) -> List[UserInstanceResponse]:
        result_db = await self.instance_opr.get_user_instances(username=username)
        return [InstanceHelper.to_instance_response_model(instance) for instance in result_db]
    
    @require_roles([UserRole.ADMIN, UserRole.USER])
    async def create_instance(self, instance_create: InstanceCreateRequest) -> InstanceCreateResponse:
        # Validate instance_create
        async with asyncio.TaskGroup() as tg:
            instance_plan_task = tg.create_task(
                self.instance_opr.get_instance_plan(instance_plan_id=instance_create.instance_plan.instance_plan_id)
            )
            os_type_task = tg.create_task(
                self.instance_opr.get_os_type_by_id(instance_create.os_type.os_type_id)
            )
            instance = tg.create_task(
                self.instance_opr.get_instance_by_name(instance_create.instance_name)
            )
        instance_plan_create = instance_plan_task.result()
        os_type_create = os_type_task.result()
        instance = instance.result()
        if not instance_plan_create or not os_type_create:
            raise HTTPException(status_code=404, detail="Instance plan or OS type not found")
        if instance:
            raise HTTPException(status_code=400, detail="Instance name already exists")
        InstanceValidator.validate_instance_create_request(
            instance_create=instance_create,
            instance_plan_db=instance_plan_create,
            os_type_db=os_type_create
        )

        user_wallet = await self.subscription_service.get_user_wallet(user_id=user_session_ctx.get().user_id)
        if user_wallet.balance < self.subscription_service._calculate_payment_amount(instance_plan_create.cost_hour):
            raise HTTPException(status_code=400, detail="Insufficient balance")
        
        # Create instance in LXD
        instance = await self.lxd_client.create_instance(instance_create)
        if not instance:
            raise RuntimeError("Failed to create instance")
        
        # Create instance in DB
        created_instance = await self.instance_opr.upsert_user_instance(instance)

        # Create subscription
        first_payment_transaction = await self.subscription_service.create_subscription(
            user_id=user_session_ctx.get().user_id,
            instance_id=created_instance.instance_id,
            instance_plan=instance_plan_create
        )

        await self.subscription_service.process_transaction(first_payment_transaction)

        return InstanceCreateResponse(
            instance_name=created_instance.hostname,
            instance_status=created_instance.status,
            created_at=created_instance.created_at
        )
    
    @require_roles([UserRole.ADMIN, UserRole.USER])
    @require_instance_ownership()
    async def get_instance(
        self,
        instance_id: Optional[uuid.UUID] = None,
        instance_name: Optional[str] = None
    ) -> UserInstanceFromDB:
        if not instance_id and not instance_name:
            raise ValueError("Instance ID or name is required")
        
        if not instance_id:
            instance_id = (await self.instance_opr.get_instance_by_name(instance_name)).instance_id
        
        instances = await self.instance_opr.get_user_instances(instance_ids=[instance_id])
        if not instances:
            raise HTTPException(status_code=404, detail="Instance not found")
        return instances[0]
        
    
    @require_roles([UserRole.ADMIN, UserRole.USER])
    @require_instance_ownership()
    async def start_instance(
        self,
        instance_id: Optional[uuid.UUID] = None,
        instance_name: Optional[str] = None
    ) -> InstanceControlResponse:
        instance = InstanceHelper.to_instance_upsert_model(
            await self.get_instance(instance_id=instance_id, instance_name=instance_name)
        )
        
        # Start instance in LXD
        await self.lxd_client.start_instance(instance.hostname)

        # Update instance status in DB
        instance.status = "Running"
        instance.last_updated_at = DateTimeUtils.now_dt()
        await self.instance_opr.upsert_user_instance(instance)

        return InstanceControlResponse(
            instance_id=instance.instance_id,
            instance_name=instance.hostname,
            is_success=True
        )
    
    @require_roles([UserRole.ADMIN, UserRole.USER])
    @require_instance_ownership()
    async def stop_instance(
        self,
        instance_id: Optional[uuid.UUID] = None,
        instance_name: Optional[str] = None
    ) -> InstanceControlResponse:
        instance = InstanceHelper.to_instance_upsert_model(
            await self.get_instance(instance_id=instance_id, instance_name=instance_name)
        )
        
        # Stop instance in LXD
        await self.lxd_client.stop_instance(instance.hostname)

        # Update instance status in DB
        instance.status = "Stopped"
        instance.last_updated_at = DateTimeUtils.now_dt()
        await self.instance_opr.upsert_user_instance(instance)

        return InstanceControlResponse(
            instance_id=instance.instance_id,
            instance_name=instance.hostname,
            is_success=True
        )
    
    @require_roles([UserRole.ADMIN, UserRole.USER, UserRole.WORKER])
    @require_instance_ownership()
    async def delete_instance(
        self,
        instance_id: Optional[uuid.UUID] = None,
        instance_name: Optional[str] = None
    ) -> InstanceControlResponse:
        from ..sql.operations.subscription import SubscriptionOperation
        from ..sql.operations.transaction import TransactionOperation
        from ..container import AppContainer
        subscription_opr: SubscriptionOperation = AppContainer.subscription_opr()
        transaction_opr: TransactionOperation = AppContainer.transaction_opr()

        instance = InstanceHelper.to_instance_upsert_model(
            await self.get_instance(instance_id=instance_id, instance_name=instance_name)
        )

        # Delete subscription
        result = await subscription_opr.delete_subscription(instance_id=instance.instance_id)
        if result:
            await transaction_opr.delete_subscription_transaction(subscription_id=result.subscription_id)
        
        # Delete instance in LXD
        await self.lxd_client.delete_instance(instance.hostname)

        # Delete instance in DB
        await self.instance_opr.delete_user_instance(instance.instance_id)

        return InstanceControlResponse(
            instance_id=instance.instance_id,
            instance_name=instance.hostname,
            is_success=True
        )
    
    @require_roles([UserRole.ADMIN, UserRole.USER])
    @require_instance_ownership()
    async def terminal_websocket_session(self, instance_name: str, client_ws: WebSocket):
        instance = await self.instance_opr.get_instance_by_name(instance_name)

        if instance.status != "Running":
            raise HTTPException(status_code=400, detail="Instance is not running")
        
        await self.lxd_client.terminal_websocket_session(instance_name, client_ws)
    
    @require_roles([UserRole.ADMIN, UserRole.USER])
    @require_instance_ownership()
    async def console_websocket_session(self, instance_name: str, client_ws: WebSocket):
        instance = await self.instance_opr.get_instance_by_name(instance_name)

        if instance.status != "Running":
            raise HTTPException(status_code=400, detail="Instance is not running")
        
        await self.lxd_client.console_websocket_session(instance_name, client_ws)
    
    @require_roles([UserRole.ADMIN, UserRole.USER])
    @require_instance_ownership()
    async def get_instance_console_buffer(self, instance_name: str) -> str:
        instance = await self.instance_opr.get_instance_by_name(instance_name)
        
        if instance.status != "Running":
            raise HTTPException(status_code=400, detail="Instance is not running")
        
        try:
            return await self.lxd_client.get_instance_console_buffer(instance_name)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get instance console buffer: {str(e)}"
            )
    
    @require_roles([UserRole.ADMIN, UserRole.USER])
    @require_instance_ownership()
    async def reset_instance_password(self, instance_name: str, reset_password_request: InstanceResetPasswordRequest) -> InstanceControlResponse:
        instance = await self.instance_opr.get_instance_by_name(instance_name)

        if instance.status != "Running":
            raise HTTPException(status_code=400, detail="Instance is not running")
        
        await self.lxd_client.set_instance_password(instance_name, reset_password_request.password)

        return InstanceControlResponse(
            instance_id=instance.instance_id,
            instance_name=instance.hostname,
            is_success=True
        )

    @require_roles([UserRole.ADMIN, UserRole.USER])
    @require_instance_ownership()
    async def get_instance_state(
        self,
        instance_name: Optional[str] = None
    ) -> BaseInstanceState:
        instance = InstanceHelper.to_instance_upsert_model(
            await self.get_instance(instance_name=instance_name)
        )
        
        if not instance:
            raise HTTPException(status_code=404, detail="Instance not found")
        if instance.status != "Running":
            raise HTTPException(status_code=400, detail="Instance is not running")
        
        # Get instance state from LXD
        try:
            return await self.lxd_client.get_instance_state(instance_name)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get instance state: {str(e)}"
            )