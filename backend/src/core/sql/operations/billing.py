from datetime import datetime
from typing import List, Optional
from sqlalchemy import func, select, insert, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert as pg_insert
import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from ...constants.transaction_const import TransactionStatus, TransactionType, TRANSACTION_TYPE_TO_STATUS
from ...utils.datetime import DateTimeUtils
from .base import BaseOperation
from ..tables.user_instance import UserInstance
from ..tables.user import User
from ..tables.user_wallet import UserWallet
from ..tables.user_subscription import UserSubscription
from ..tables.transaction import Transaction
from ...models.billing import AllTimePayment, UpcomingPayment, UserBillingOverview
from ...models.admin import AdminBillingStatsByStatus, AdminBillingStatsByType
from ...utils.logging import logger


class BillingOperation(BaseOperation):
    async def get_user_billing_overview(
        self,
        username: str,
    ) -> UserBillingOverview:
        """
        Get the billing overview for a specific user.
        
        This method fetches:
        1. Upcoming payment information (sum of pending payments, total subscriptions, earliest due date)
        2. All-time payment information (sum of payments, total payment cycles, last payment date)
        
        Returns a UserBillingOverview model.
        """
        async with self.session() as db:
            # Get user_id from username
            user_stmt = select(User.user_id).where(User.username == username)
            user_id = (await db.execute(user_stmt)).scalar_one_or_none()
            
            if not user_id:
                return None
            
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
        
        # Get sum of scheduled/pending payments
        upcoming_payment_stmt = select(
            # Sum of all pending amounts
            func.sum(Transaction.amount).label("sum_amount"),
        ).where(
            Transaction.user_id == user_id,
            Transaction.transaction_type == TransactionType.SUBSCRIPTION_PAYMENT,
            Transaction.transaction_status.in_([TransactionStatus.SCHEDULED, TransactionStatus.OVERDUE])
        )
        
        sum_amount = (await db.execute(upcoming_payment_stmt)).scalar_one_or_none() or 0.0
        
        # Get earliest payment date from user subscriptions
        earliest_payment_date_stmt = select(
            func.min(UserSubscription.next_payment_date).label("earliest_due_date")
        ).join(
            UserInstance, UserSubscription.instance_id == UserInstance.instance_id
        ).where(
            UserInstance.user_id == user_id
        )
        
        earliest_payment_date = (await db.execute(earliest_payment_date_stmt)).scalar_one_or_none()
        
        # Format the date if it exists
        earliest_due_date_str = DateTimeUtils.to_bkk_string(earliest_payment_date) if earliest_payment_date else ""
        
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
    
    async def get_billing_stats_by_date_range(
        self,
        start_date: datetime = None,
        end_date: datetime = None,
        is_alltime: bool = False
    ) -> List[AdminBillingStatsByType]:
        """
        Get billing statistics aggregated by transaction type and status within a date range.
        
        Args:
            start_date: Start date for filtering transactions
            end_date: End date for filtering transactions
            is_alltime: If True, ignore date range and get all-time statistics
            
        Returns:
            List of AdminBillingStatsByType containing statistics for each transaction type
        """
        async with self.session() as db:
            # Get all transaction types to ensure we return all types even if no transactions exist
            all_types = list(TransactionType)
            
            # Build the base query
            stats_stmt = select(
                Transaction.transaction_type,
                Transaction.transaction_status,
                func.sum(Transaction.amount).label("total_amount")
            )
            
            # Apply date filtering only if is_alltime is False
            if not is_alltime and start_date and end_date:
                stats_stmt = stats_stmt.where(
                    Transaction.created_at >= start_date,
                    Transaction.created_at <= end_date
                )
            
            # Group by type and status
            stats_stmt = stats_stmt.group_by(
                Transaction.transaction_type,
                Transaction.transaction_status
            )
            
            result = await db.execute(stats_stmt)
            stats_data = result.all()

            
            # Organize results by transaction type
            stats_by_type = {}
            for transaction_type in all_types:
                stats_by_type[transaction_type] = []
                
                # Get appropriate statuses for this transaction type
                applicable_statuses = TRANSACTION_TYPE_TO_STATUS.get(transaction_type, [])
                
                # Process each status that applies to this type
                for status in applicable_statuses:
                    # Find matching record in query results
                    matching = next(
                        (item for item in stats_data if item[0] == transaction_type and item[1] == status),
                        None
                    )
                    
                    # Use found amount or default to 0
                    amount = matching[2] if matching else 0.0
                    
                    # Add status stats to this type
                    stats_by_type[transaction_type].append(
                        AdminBillingStatsByStatus(
                            status=status,
                            amount=amount
                        )
                    )
            
            # Convert dictionary to list of AdminBillingStatsByType
            result = [
                AdminBillingStatsByType(
                    type=transaction_type,
                    stats=stats_by_type[transaction_type]
                )
                for transaction_type in all_types
            ]
            
            return result