from typing import List
from fastapi import HTTPException

from ..sql.operations import AdminOperation, InstanceOperation
from ..models.admin import (
    AdminUser,
    AdminUsersResponse,
    AdminInstancePlanCreateRequest,
    AdminInstancePlanCreateResponse,
    AdminInstancePlanUpdateRequest,
    AdminInstancePlanUpdateResponse,
    AdminInstancePlanDeleteRequest,
    AdminInstancePlanDeleteResponse
)
from ..utils.permission import require_roles
from ..constants.user_const import UserRole
from ..service.validators.instance_validator import InstanceValidator

class AdminService:
    def __init__(
        self,
        admin_opr: AdminOperation,
        instance_opr: InstanceOperation,
    ):
        self.admin_opr = admin_opr
        self.instance_opr = instance_opr
    
    @require_roles([UserRole.ADMIN])
    async def get_all_users_with_details(self) -> List[AdminUsersResponse]:
        users = await self.admin_opr.get_all_users_with_details()
        return AdminUsersResponse(
            users=[
                AdminUser(
                    user_id=user.user_id,
                    username=user.username,
                    email=user.email,
                    role=user.role,
                    instances=user.user_instances,
                )
                for user in users
            ]
        )
    
    @require_roles([UserRole.ADMIN])
    async def create_instance_plan(self, instance_plan: AdminInstancePlanCreateRequest) -> AdminInstancePlanCreateResponse:
        existing_instance_plan = await self.instance_opr.get_instance_plan(instance_package_name=instance_plan.instance_package_name)
        if existing_instance_plan:
            raise HTTPException(status_code=400, detail="Instance plan already exists")
        new_instance_plan = await self.instance_opr.upsert_instance_plan(instance_plan)
        return AdminInstancePlanCreateResponse(
            instance_plan_id=new_instance_plan.instance_plan_id,
            instance_package_name=new_instance_plan.instance_package_name,
            vcpu_amount=new_instance_plan.vcpu_amount,
            ram_amount=new_instance_plan.ram_amount,
            storage_amount=new_instance_plan.storage_amount,
            cost_hour=new_instance_plan.cost_hour
        )
    
    @require_roles([UserRole.ADMIN])
    async def update_instance_plan(self, instance_plan: AdminInstancePlanUpdateRequest) -> AdminInstancePlanUpdateResponse:
        existing_instance_plan = await self.instance_opr.get_instance_plan(instance_plan_id=instance_plan.instance_plan_id)
        if not existing_instance_plan:
            raise HTTPException(status_code=404, detail="Instance plan not found")
        other_instance_plan = await self.instance_opr.get_instance_plan(instance_package_name=instance_plan.instance_package_name)
        if other_instance_plan and other_instance_plan.instance_plan_id != existing_instance_plan.instance_plan_id:
            raise HTTPException(status_code=400, detail="Instance plan name already exists")
        updated_instance_plan = await self.instance_opr.upsert_instance_plan(instance_plan)
        return AdminInstancePlanUpdateResponse(
            instance_plan_id=updated_instance_plan.instance_plan_id,
            instance_package_name=updated_instance_plan.instance_package_name,
            vcpu_amount=updated_instance_plan.vcpu_amount,
            ram_amount=updated_instance_plan.ram_amount,
            storage_amount=updated_instance_plan.storage_amount,
            cost_hour=updated_instance_plan.cost_hour
        )
    
    @require_roles([UserRole.ADMIN])
    async def delete_instance_plan(self, instance_plan: AdminInstancePlanDeleteRequest) -> AdminInstancePlanDeleteResponse:
        existing_instance_plan = await self.instance_opr.get_instance_plan(instance_plan_id=instance_plan.instance_plan_id)
        InstanceValidator.validate_instance_plan_delete_request(instance_plan, existing_instance_plan)
        await self.instance_opr.delete_instance_plan(instance_plan.instance_plan_id)
        return AdminInstancePlanDeleteResponse(
            instance_plan_id=instance_plan.instance_plan_id,
            instance_package_name=instance_plan.instance_package_name,
            is_success=True
        )
