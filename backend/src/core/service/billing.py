from typing import List
from fastapi import HTTPException

from ..sql.operations.transaction import TransactionOperation
from ..sql.operations.billing import BillingOperation
from .subscription import SubscriptionService
from ..utils.datetime import DateTimeUtils
from ..utils.permission import require_roles, require_account_ownership
from ..utils.guard import require_test_environment
from ..models.billing import UserBillingOverviewResponse, UserTopUpRequest, UserTopUpResponse
from ..models.transaction import UserTransactionResponse, Transaction
from ..models.user import UserWalletResponse
from ..constants.user_const import UserRole
from ..constants.transaction_const import TransactionStatus


class BillingService:
    def __init__(
        self,
        billing_opr: BillingOperation,
        transaction_opr: TransactionOperation,
        subscription_service: SubscriptionService
    ):
        self.billing_opr = billing_opr
        self.transaction_opr = transaction_opr
        self.subscription_service = subscription_service

    @require_roles([UserRole.ADMIN, UserRole.USER])
    @require_account_ownership()
    async def get_user_billing_overview(self, username: str) -> UserBillingOverviewResponse:
        result = await self.billing_opr.get_user_billing_overview(username=username)
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to retrieve billing overview",
            )
        return UserBillingOverviewResponse(
            username=username,
            upcoming_payment=result.upcoming_payment,
            all_time_payment=result.all_time_payment,
        )
    
    @require_roles([UserRole.ADMIN, UserRole.USER])
    @require_account_ownership()
    async def get_all_user_transactions(self, username: str) -> List[UserTransactionResponse]:
        result = await self.transaction_opr.get_all_user_transactions(username=username)
        return [UserTransactionResponse(
            transaction_id=transaction.transaction_id,
            transaction_type=transaction.transaction_type,
            transaction_status=transaction.transaction_status,
            amount=transaction.amount,
            created_at=DateTimeUtils.to_bkk_string(transaction.created_at),
            last_updated_at=DateTimeUtils.to_bkk_string(transaction.last_updated_at),
        ) for transaction in result]
    
    @require_roles([UserRole.ADMIN, UserRole.USER])
    @require_account_ownership()
    async def top_up(self, username: str, top_up_request: UserTopUpRequest) -> UserTopUpResponse:
        user_id = (await self.subscription_service.user_opr.get_user_by_username(username)).user_id

        transaction = self.subscription_service._create_topup_transaction(
            user_id=user_id,
            username=username,
            amount=top_up_request.amount,
        )

        created_transaction = await self.transaction_opr.upsert_transaction(transaction)

        result = await self.subscription_service.process_transaction(created_transaction)
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to process top-up",
            )
        return UserTopUpResponse(
            transaction_id=result.transaction_id,
            transaction_type=result.transaction_type,
            transaction_status=result.transaction_status,
            amount=result.amount,
            created_at=DateTimeUtils.to_bkk_string(result.created_at),
            last_updated_at=DateTimeUtils.to_bkk_string(result.last_updated_at),
        )
    
    @require_roles([UserRole.ADMIN, UserRole.USER])
    @require_account_ownership()
    async def get_user_wallet(self, username: str) -> UserWalletResponse:
        result = await self.subscription_service.get_user_wallet(username=username)
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to retrieve wallet",
            )
        return UserWalletResponse(
            username=username,
            balance=result.balance,
            last_updated_at=DateTimeUtils.to_bkk_string(result.last_updated_at),
        )

    @require_test_environment
    async def trigger_overdue_subscription_action(self, instance_name: str):
        subscription_transactions = await self.get_subscription_transactions(instance_name=instance_name)
        await self.subscription_service.process_overdue_subscriptions(subscription_transactions)

    @require_test_environment
    async def trigger_expired_subscription_action(self, instance_name: str):
        subscription_transactions = await self.get_subscription_transactions(instance_name=instance_name)
        await self.subscription_service.process_expired_subscriptions(subscription_transactions)

    async def get_subscription_transactions(self, instance_name: str) -> List[Transaction]:
        subscription = await self.subscription_service.subscription_opr.get_subscription_by_instance(instance_name=instance_name)
        if not subscription:
            raise HTTPException(
                status_code=404,
                detail="Subscription not found",
            )
        subscription_transactions = await self.subscription_service._get_subscription_transactions(
            subscriptions=[subscription],
            transaction_statuses=[TransactionStatus.SCHEDULED, TransactionStatus.OVERDUE]
        )
        if not subscription_transactions:
            raise HTTPException(
                status_code=404,
                detail="No transactions found",
            )
        return subscription_transactions
