from datetime import datetime
from typing import List, Optional
from sqlalchemy import func, select, insert, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert as pg_insert
import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from ...constants.transaction_const import TransactionStatus, TransactionType
from ...utils.datetime import DateTimeUtils
from .base import BaseOperation
from ..tables.user_instance import UserInstance
from ..tables.user import User
from ..tables.user_wallet import UserWallet
from ..tables.user_subscription import UserSubscription
from ..tables.transaction import Transaction
from ...models.billing import AllTimePayment, UpcomingPayment, UserBillingOverview


class BillingOperation(BaseOperation):
    async def get_user_billing_overview(
        self,
        user_id: uuid.UUID,
    ) -> UserBillingOverview:
        """
        Get the billing overview for a specific user.
        
        This method fetches:
        1. Upcoming payment information (sum of pending payments, total subscriptions, earliest due date)
        2. All-time payment information (sum of payments, total payment cycles, last payment date)
        
        Returns a UserBillingOverview model.
        """
        async with self.session() as db:
            # Create upcoming payment information
            upcoming_payment = await self._get_upcoming_payment_info(db, user_id)
            
            # Create all-time payment information
            all_time_payment = await self._get_all_time_payment_info(db, user_id)
            
            # Construct and return the UserBillingOverview
            return UserBillingOverview(
                upcoming_payment=upcoming_payment,
                all_time_payment=all_time_payment
            )

    async def _get_upcoming_payment_info(self, db: AsyncSession, user_id: uuid.UUID) -> UpcomingPayment:
        """
        Get upcoming payment information for a user.
        Uses efficient SQL aggregation to avoid loading all transactions into memory.
        """
        # Count total active subscriptions
        subscription_count_stmt = select(
            func.count(UserSubscription.subscription_id)
        ).join(
            UserInstance, UserSubscription.instance_id == UserInstance.instance_id
        ).where(
            UserInstance.user_id == user_id
        )
        total_subscription = (await db.execute(subscription_count_stmt)).scalar() or 0
        
        # Get sum of scheduled/pending payments and earliest due date
        upcoming_payment_stmt = select(
            # Sum of all pending amounts
            func.sum(Transaction.amount).label("sum_amount"),
            # Earliest payment date
            func.min(Transaction.created_at).label("earliest_due_date")
        ).where(
            Transaction.user_id == user_id,
            Transaction.transaction_type == TransactionType.SUBSCRIPTION_PAYMENT,
            Transaction.transaction_status.in_([TransactionStatus.SCHEDULED])
        )
        
        upcoming_result = (await db.execute(upcoming_payment_stmt)).one_or_none()
        
        # Handle case where there are no upcoming payments
        sum_amount = upcoming_result[0] or 0.0
        earliest_due_date = upcoming_result[1] or None
        
        # Format the date if it exists
        earliest_due_date_str = DateTimeUtils.to_bkk_string(earliest_due_date) if earliest_due_date else ""
        
        return UpcomingPayment(
            sum_amount=sum_amount,
            total_subscription=total_subscription,
            earliest_due_date=earliest_due_date_str
        )

    async def _get_all_time_payment_info(self, db: AsyncSession, user_id: uuid.UUID) -> AllTimePayment:
        """
        Get all-time payment information for a user.
        Uses SQL aggregation for better performance.
        """
        # Get all-time payment stats using aggregation
        all_time_stmt = select(
            # Sum of all successful payments
            func.sum(Transaction.amount).label("sum_amount"),
            # Count of payment cycles (each successful payment counts as one cycle)
            func.count(Transaction.transaction_id).label("total_cycle"),
            # Latest payment date
            func.max(Transaction.created_at).label("last_payment_date")
        ).where(
            Transaction.user_id == user_id,
            Transaction.transaction_type == TransactionType.SUBSCRIPTION_PAYMENT,
            Transaction.transaction_status == TransactionStatus.PAID
        )
        
        all_time_result = (await db.execute(all_time_stmt)).one_or_none()
        
        # Handle case where there are no historical payments
        sum_amount = all_time_result[0] or 0.0
        total_cycle = all_time_result[1] or 0
        last_payment_date = all_time_result[2] or None
        
        # Format the date if it exists
        last_payment_date_str = DateTimeUtils.to_bkk_string(last_payment_date) if last_payment_date else ""
        
        return AllTimePayment(
            sum_amount=sum_amount,
            total_cycle=total_cycle,
            last_payment_date=last_payment_date_str
        )