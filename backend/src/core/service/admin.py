from typing import List, Optional
from datetime import datetime

from ..sql.operations import AdminOperation, BillingOperation, TransactionOperation
from ..models.admin import AdminUser, AdminUsersResponse, AdminBillingStatsResponse, AdminTransactionResponse
from ..utils.permission import require_roles
from ..constants.user_const import UserRole
from ..utils.datetime import DateTimeUtils


class AdminService:
    def __init__(
        self,
        admin_opr: AdminOperation,
        billing_opr: BillingOperation,
        transaction_opr: TransactionOperation
    ):
        self.admin_opr = admin_opr
        self.billing_opr = billing_opr
        self.transaction_opr = transaction_opr
    
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
