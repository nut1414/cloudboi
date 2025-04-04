
from typing import List
from fastapi import HTTPException

from ..sql.operations.transaction import TransactionOperation
from ..sql.operations.billing import BillingOperation
from .subscription import SubscriptionService
from ..utils.dependencies import user_session_ctx
from ..utils.datetime import DateTimeUtils
from ..models.billing import UserBillingOverviewResponse, UserTopUpRequest, UserTopUpResponse
from ..models.transaction import UserTransactionResponse, Transaction
from ..models.user import UserWalletResponse

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

    async def get_user_billing_overview(self) -> UserBillingOverviewResponse:
        result = await self.billing_opr.get_user_billing_overview(user_id=user_session_ctx.get().user_id)
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to retrieve billing overview",
            )
        return UserBillingOverviewResponse(
            username=user_session_ctx.get().username,
            upcoming_payment=result.upcoming_payment,
            all_time_payment=result.all_time_payment,
        )
    
    async def get_all_user_transactions(self) -> List[UserTransactionResponse]:
        result = await self.transaction_opr.get_all_user_transactions(username=user_session_ctx.get().username)
        return [UserTransactionResponse(
            transaction_id=transaction.transaction_id,
            transaction_type=transaction.transaction_type,
            transaction_status=transaction.transaction_status,
            amount=transaction.amount,
            created_at=DateTimeUtils.to_bkk_string(transaction.created_at),
            last_updated_at=DateTimeUtils.to_bkk_string(transaction.last_updated_at),
        ) for transaction in result]
    
    async def top_up(self, top_up_request: UserTopUpRequest) -> UserTopUpResponse:
        transaction = self.subscription_service._create_topup_transaction(
            user_id=user_session_ctx.get().user_id,
            username=user_session_ctx.get().username,
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
    
    async def get_user_wallet(self) -> UserWalletResponse:
        result = await self.subscription_service.get_user_wallet(user_id=user_session_ctx.get().user_id)
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to retrieve wallet",
            )
        return UserWalletResponse(
            username=user_session_ctx.get().username,
            balance=result.balance,
            last_updated_at=DateTimeUtils.to_bkk_string(result.last_updated_at),
        )