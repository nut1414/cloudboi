from typing import List
import uuid

from ..sql.operations import TransactionOperation, SubscriptionOperation, UserOperation
from ..models.subscription import UserSubscription
from ..models.transaction import Transaction
from ..models.instance import InstancePlan
from ..models.user import UserWallet
from ..utils.datetime import DateTimeUtils
from ..constants.subscription_const import PAYMENT_INTERVAL, EXPIRE_INTERVAL
from ..constants.transaction_const import TransactionType, TransactionStatus


class SubscriptionService:
    def __init__(
        self,
        user_opr: UserOperation,
        subscription_opr: SubscriptionOperation,
        transaction_opr: TransactionOperation
    ):
        self.user_opr = user_opr
        self.subscription_opr = subscription_opr
        self.transaction_opr = transaction_opr

    async def create_subscription(self, user_id: uuid.UUID, instance_id: uuid.UUID, instance_plan: InstancePlan) -> None:
        """Create a new subscription and schedule the first payment transaction."""
        next_payment_date = DateTimeUtils.now_dt() + PAYMENT_INTERVAL
        next_expire_date = next_payment_date + EXPIRE_INTERVAL

        created_subscription = await self.subscription_opr.upsert_subscription(
            instance_id=instance_id,
            next_payment_date=next_payment_date,
            next_expire_date=next_expire_date
        )

        # Calculate monthly cost based on hourly rate
        monthly_cost = self._calculate_payment_amount(instance_plan.cost_hour)
        
        # Create initial transaction
        transaction = self._create_subscription_transaction(
            user_id=user_id,
            subscription_id=created_subscription.subscription_id,
            amount=monthly_cost
        )

        await self.transaction_opr.upsert_transaction(transaction)
    
    async def next_subscription(self, transaction_old: Transaction) -> None:
        """Schedule the next subscription payment after a successful payment."""
        subscription_id = self._get_reference_id(transaction_old)
        subscription = await self.subscription_opr.get_subscription_by_id(subscription_id)
        
        if not subscription:
            return
        
        # Update subscription dates
        subscription.next_payment_date += PAYMENT_INTERVAL
        subscription.next_expire_date += PAYMENT_INTERVAL

        updated_subscription = await self.subscription_opr.upsert_subscription(
            instance_id=subscription.instance_id,
            next_payment_date=subscription.next_payment_date,
            next_expire_date=subscription.next_expire_date
        )

        # Create next transaction
        transaction_new = self._create_subscription_transaction(
            user_id=transaction_old.user_id,
            subscription_id=updated_subscription.subscription_id,
            amount=transaction_old.amount
        )

        await self.transaction_opr.upsert_transaction(transaction_new)
    
    async def get_overdue_subscriptions(self) -> List[Transaction]:
        """Get all subscriptions that are past their payment date but not yet expired."""
        datetime_now = DateTimeUtils.now_dt()
        overdue_subscriptions = await self.subscription_opr.get_overdue_subscriptions(datetime_now)

        return await self._get_subscription_transactions(
            subscriptions=overdue_subscriptions,
            transaction_statuses=[TransactionStatus.SCHEDULED, TransactionStatus.OVERDUE]
        )
    
    async def get_expired_subscriptions(self) -> List[Transaction]:
        """Get all subscriptions that have passed their expiration date."""
        datetime_now = DateTimeUtils.now_dt()
        expired_subscriptions = await self.subscription_opr.get_expired_subscriptions(datetime_now)

        return await self._get_subscription_transactions(
            subscriptions=expired_subscriptions,
            transaction_statuses=[TransactionStatus.OVERDUE]
        )
    
    async def process_transaction(self, transaction: Transaction) -> None:
        """Process a transaction based on its type and the user's wallet balance."""
        user_wallet = await self.user_opr.get_user_wallet(user_id=transaction.user_id)

        if not user_wallet:
            raise ValueError("User wallet not found.")

        if transaction.transaction_type == TransactionType.TOP_UP:
            updated_wallet, updated_transaction  = await self.transaction_opr.update_transaction_and_user_wallet(
                transaction,
                self._process_topup_transaction
            )
        elif transaction.transaction_type == TransactionType.SUBSCRIPTION_PAYMENT:
            updated_wallet, updated_transaction = await self.transaction_opr.update_transaction_and_user_wallet(
                transaction,
                self._process_subscription_payment
            )
            
            # If payment was successful, schedule next payment
            if updated_transaction.transaction_status == TransactionStatus.PAID:
                await self.next_subscription(updated_transaction)
    
    async def apply_penalty(self, transaction: Transaction) -> None:
        """Apply penalty for expired subscriptions by removing the instance and subscription."""
        from .instance import InstanceService
        from ..container import AppContainer
        instance_service: InstanceService = AppContainer.instance_service()

        subscription_id = self._get_reference_id(transaction)
        subscription = await self.subscription_opr.get_subscription_by_id(subscription_id)
        
        if not subscription:
            return
        
        # Delete user instance and subscription
        await instance_service.delete_instance(instance_id=subscription.instance_id)
    
    async def process_overdue_subscriptions(self, overdue_subscriptions: List[Transaction]) -> None:
        """Attempt to process all overdue subscription payments."""
        for transaction in overdue_subscriptions:
            try:
                await self.process_transaction(transaction)
            except Exception as e:
                raise ValueError(f"Failed to process transaction({transaction.transaction_id}): {str(e)}")
        
    async def process_expired_subscriptions(self, expired_subscriptions: List[Transaction]) -> None:
        """Mark expired subscriptions and apply penalties."""
        for transaction in expired_subscriptions:
            try:
                transaction.transaction_status = TransactionStatus.EXPIRED
                transaction.last_updated_at = DateTimeUtils.now_dt()
                await self.transaction_opr.upsert_transaction(transaction)
                await self.apply_penalty(transaction)
            except Exception as e:
                raise ValueError(f"Failed to process transaction({transaction.transaction_id}): {str(e)}")

    def _get_reference_id(self, transaction: Transaction) -> int:
        """Get the subscription ID from a transaction reference ID."""
        return int(transaction.reference_id.split("_")[1])

    # Private helper methods
    def _calculate_payment_amount(self, hourly_cost: float) -> float:
        """Calculate the payment amount for a subscription period."""
        hours_in_payment_interval = PAYMENT_INTERVAL.total_seconds() / 3600  
        return hourly_cost * hours_in_payment_interval

    def _create_subscription_transaction(self, user_id: uuid.UUID, subscription_id: uuid.UUID, amount: float) -> Transaction:
        """Create a subscription payment transaction."""
        current_time = DateTimeUtils.now_dt()
        return Transaction(
            user_id=user_id,
            transaction_type=TransactionType.SUBSCRIPTION_PAYMENT,
            transaction_status=TransactionStatus.SCHEDULED,
            reference_id=f"subscription_{subscription_id}",
            amount=amount,
            created_at=current_time,
            last_updated_at=current_time
        )

    async def _get_subscription_transactions(
        self, 
        subscriptions: List[UserSubscription], 
        transaction_statuses: List[TransactionStatus]
    ) -> List[Transaction]:
        """Get transactions for a list of subscriptions with specific statuses."""
        if not subscriptions:
            return []
            
        reference_ids = [f"subscription_{subscription.subscription_id}" for subscription in subscriptions]
        
        return await self.transaction_opr.get_transactions_by_reference_ids(
            reference_ids=reference_ids,
            transaction_type=[TransactionType.SUBSCRIPTION_PAYMENT],
            transaction_status=transaction_statuses
        )

    def _process_topup_transaction(self, user_wallet: UserWallet, transaction: Transaction) -> tuple[UserWallet, Transaction]:
        """Process a top-up transaction by adding funds to user wallet."""
        user_wallet.balance += transaction.amount
        user_wallet.last_updated_at = DateTimeUtils.now_dt()
        
        transaction.transaction_status = TransactionStatus.SUCCESS
        transaction.last_updated_at = DateTimeUtils.now_dt()

        return user_wallet, transaction

    def _process_subscription_payment(self, user_wallet: UserWallet, transaction: Transaction) -> tuple[UserWallet, Transaction]:
        """Process a subscription payment transaction."""
        # If user has insufficient funds, mark transaction as overdue
        if user_wallet.balance < transaction.amount:
            if transaction.transaction_status == TransactionStatus.SCHEDULED:
                transaction.transaction_status = TransactionStatus.OVERDUE
                transaction.last_updated_at = DateTimeUtils.now_dt()
            return user_wallet, transaction
        
        # Process payment
        user_wallet.balance -= transaction.amount
        user_wallet.last_updated_at = DateTimeUtils.now_dt()
        
        # Mark transaction as paid
        transaction.transaction_status = TransactionStatus.PAID
        transaction.last_updated_at = DateTimeUtils.now_dt()

        return user_wallet, transaction
        