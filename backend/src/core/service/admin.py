from typing import List

from ..sql.operations import AdminOperation, BillingOperation, TransactionOperation
from ..models.admin import AdminUser, AdminUsersResponse, AdminBillingStatsRequest, AdminBillingStatsResponse, AdminTransactionResponse
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
    async def get_billing_stats(self, request: AdminBillingStatsRequest) -> AdminBillingStatsResponse:
        # Check if all-time flag is enabled
        if request.is_alltime:
            # For all-time queries, we don't need date ranges
            stats = await self.billing_opr.get_billing_stats_by_date_range(
                is_alltime=True
            )
        else:
            # Validate required parameters
            if not request.start_date or not request.end_date:
                raise ValueError("Both start_date and end_date are required when is_alltime is False")
                
            # Ensure dates are properly formatted with timezone information
            start_date = request.start_date
            end_date = request.end_date
            
            # If dates don't have timezone info, assume they're in UTC
            if start_date.tzinfo is None:
                start_date = DateTimeUtils.UTC_TZ.localize(start_date)
            if end_date.tzinfo is None:
                end_date = DateTimeUtils.UTC_TZ.localize(end_date)
                
            stats = await self.billing_opr.get_billing_stats_by_date_range(
                start_date=start_date,
                end_date=end_date,
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
