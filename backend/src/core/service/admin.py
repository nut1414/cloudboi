from typing import List, Optional
from datetime import datetime
from fastapi import HTTPException

from ..sql.operations import AdminOperation, BillingOperation, TransactionOperation, InstanceOperation
from ..models.admin import (
    AdminInstancePlan,
    AdminUser,
    AdminUsersResponse, AdminBillingStatsResponse, AdminTransactionResponse,
    AdminInstancePlanCreateRequest,
    AdminInstancePlanCreateResponse,
    AdminInstancePlanUpdateRequest,
    AdminInstancePlanUpdateResponse,
    AdminInstancePlanDeleteRequest,
    AdminInstancePlanDeleteResponse
)
from ..utils.permission import require_roles
from ..constants.user_const import UserRole
from ..utils.datetime import DateTimeUtils
from ..service.validators.instance_validator import InstanceValidator

class AdminService:
    def __init__(
        self,
        admin_opr: AdminOperation,
        billing_opr: BillingOperation,
        transaction_opr: TransactionOperation,
        instance_opr: InstanceOperation,
    ):
        self.admin_opr = admin_opr
        self.billing_opr = billing_opr
        self.transaction_opr = transaction_opr
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
    async def get_billing_stats(
        self,
        is_alltime: bool,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> AdminBillingStatsResponse:
        # Check if all-time flag is enabled
        if is_alltime:
            # For all-time queries, we don't need date ranges
            stats = await self.billing_opr.get_billing_stats_by_date_range(
                is_alltime=True
            )
        else:
            # Validate required parameters
            if not start_date or not end_date:
                raise ValueError("Both start_date and end_date are required when is_alltime is False")
            
            # Parse string dates to datetime objects
            # DateTimeUtils.from_string already localizes the datetime to UTC
            start_dt = DateTimeUtils.from_string(start_date)
            end_dt = DateTimeUtils.from_string(end_date)
            
            # Validate that end date is after start date
            if end_dt <= start_dt:
                raise ValueError("End date must be after start date")
                
            stats = await self.billing_opr.get_billing_stats_by_date_range(
                start_date=start_dt,
                end_date=end_dt,
                is_alltime=False
            )
        return AdminBillingStatsResponse(stats=stats)
    
    @require_roles([UserRole.ADMIN])
    async def get_all_transactions(self) -> List[AdminTransactionResponse]:
        transactions_with_details = await self.transaction_opr.get_all_transactions_with_details()
        
        response = []
        for transaction, user, instance in transactions_with_details:
            # Get instance name if instance exists
            instance_name = None
            if instance:
                instance_name = instance.hostname
                
            response.append(AdminTransactionResponse(
                transaction_id=transaction.transaction_id,
                username=user.username,
                instance_name=instance_name,
                transaction_type=transaction.transaction_type,
                transaction_status=transaction.transaction_status,
                amount=transaction.amount,
                created_at=transaction.created_at,
                last_updated_at=transaction.last_updated_at
            ))
        
        return response
    @require_roles([UserRole.ADMIN])
    async def get_instance_plans(self) -> List[AdminInstancePlan]:
        result_db = await self.instance_opr.get_instance_plans_with_user_instances()
        return [
            AdminInstancePlan(
                instance_plan_id=result.instance_plan_id,
                instance_package_name=result.instance_package_name,
                vcpu_amount=result.vcpu_amount,
                ram_amount=result.ram_amount,
                storage_amount=result.storage_amount,
                cost_hour=result.cost_hour,
                is_editable=len(result.user_instances) == 0
            ) for result in result_db
        ]
    
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
        
        user_instances = await self.instance_opr.get_user_instances_by_instance_plan_id(instance_plan.instance_plan_id)
        if user_instances:
            raise HTTPException(status_code=400, detail="Instance plan is associated with user instances")

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

        user_instances = await self.instance_opr.get_user_instances_by_instance_plan_id(instance_plan.instance_plan_id)
        if user_instances:
            raise HTTPException(status_code=400, detail="Instance plan is associated with user instances")

        await self.instance_opr.delete_instance_plan(instance_plan.instance_plan_id)
        return AdminInstancePlanDeleteResponse(
            instance_plan_id=instance_plan.instance_plan_id,
            instance_package_name=instance_plan.instance_package_name,
            is_success=True
        )
