from typing import List
from fastapi import Depends
import uuid
from datetime import datetime

from ..sql.operations.transaction import TransactionOperation
from ..sql.operations.subscription import SubscriptionOperation
from ..sql.operations.user import UserOperation
from ..models.subscription import UserSubscription
from ..models.transaction import Transaction
from ..models.instance import InstancePlan
from ..utils.datetime import DateTimeUtils
from ..constants.subscription_const import PAYMENT_INTERVAL, EXPIRE_INTERVAL
from ..constants.transaction_const import TransactionType, TransactionStatus


class SubscriptionService:
    def __init__(
        self,
        user_opr: UserOperation = Depends(),
        subscription_opr: SubscriptionOperation = Depends(),
        transaction_opr: TransactionOperation = Depends()
    ):
        self.user_opr = user_opr
        self.subscription_opr = subscription_opr
        self.transaction_opr = transaction_opr

    async def create_subscription(self,user_id: uuid.UUID , instance_id: uuid.UUID, instance_plan: InstancePlan) -> None:
        next_payment_date = DateTimeUtils.now_dt() + PAYMENT_INTERVAL
        next_expire_date = next_payment_date + EXPIRE_INTERVAL

        created_subscription = await self.subscription_opr.upsert_subscription(
            instance_id=instance_id,
            next_payment_date=next_payment_date,
            next_expire_date=next_expire_date
        )

        # Calculate the number of hours in the payment interval
        hours_in_payment_interval = PAYMENT_INTERVAL.total_seconds() / 3600  
        monthly_cost = instance_plan.cost_hour * hours_in_payment_interval

        transaction = Transaction(
            user_id=user_id,
            transaction_type=TransactionType.SUBSCRIPTION_PAYMENT,
            transaction_status=TransactionStatus.SCHEDULED,
            reference_id=f"subscription_{created_subscription.subscription_id}",
            amount=monthly_cost,
            created_at=DateTimeUtils.now_dt(),
            last_updated_at=DateTimeUtils.now_dt()
        )

        await self.transaction_opr.upsert_transaction(transaction)
    
    async def next_subscription(self, transaction_old: Transaction) -> None:
        subscription_id = transaction_old.reference_id.split("_")[1]
        subscription = await self.subscription_opr.get_subscription_by_id(subscription_id)
        if not subscription:
            return
        
        subscription.next_payment_date += PAYMENT_INTERVAL
        subscription.next_expire_date += PAYMENT_INTERVAL

        updated_subscription = await self.subscription_opr.upsert_subscription(
            instance_id=subscription.instance_id,
            next_payment_date=subscription.next_payment_date,
            next_expire_date=subscription.next_expire_date
        )

        transaction_new = Transaction(
            user_id=transaction_old.user_id,
            transaction_type=TransactionType.SUBSCRIPTION_PAYMENT,
            transaction_status=TransactionStatus.SCHEDULED,
            reference_id=f"subscription_{updated_subscription.subscription_id}",
            amount=transaction_old.amount,
            created_at=DateTimeUtils.now_dt(),
            last_updated_at=DateTimeUtils.now_dt()
        )

        await self.transaction_opr.upsert_transaction(transaction_new)
    
    async def get_overdue_subscriptions(self) -> List[Transaction]:
        datetime_now = DateTimeUtils.now_dt()
        overdue_subscriptions = await self.subscription_opr.get_overdue_subscriptions(datetime_now)

        reference_ids = [f"subscription_{subscription.subscription_id}" for subscription in overdue_subscriptions]
        if not reference_ids:
            return []

        transactions = await self.transaction_opr.get_transactions_by_reference_ids(
            reference_ids=reference_ids,
            transaction_type=[TransactionType.SUBSCRIPTION_PAYMENT],
            transaction_status=[TransactionStatus.SCHEDULED, TransactionStatus.OVERDUE]
        )

        return transactions
    
    async def get_expired_subscriptions(self) -> List[Transaction]:
        datetime_now = DateTimeUtils.now_dt()
        expired_subscriptions = await self.subscription_opr.get_expired_subscriptions(datetime_now)

        reference_ids = [f"subscription_{subscription.subscription_id}" for subscription in expired_subscriptions]
        if not reference_ids:
            return []
        
        transactions = await self.transaction_opr.get_transactions_by_reference_ids(
            reference_ids=reference_ids,
            transaction_type=[TransactionType.SUBSCRIPTION_PAYMENT],
            transaction_status=[TransactionStatus.OVERDUE]
        )

        return transactions
    
    async def process_transaction(self, transaction: Transaction) -> None:
        user_wallet = await self.user_opr.get_user_wallet(
            user_id=transaction.user_id
        )

        if transaction.transaction_type == TransactionType.TOP_UP:
            user_wallet.balance += transaction.amount
            user_wallet.last_updated_at = DateTimeUtils.now_dt()
            await self.user_opr.upsert_user_wallet(user_wallet)
        elif transaction.transaction_type == TransactionType.SUBSCRIPTION_PAYMENT:
            # If user does not have enough balance, mark transaction as overdue
            if user_wallet.balance < transaction.amount:
                if transaction.transaction_status == TransactionStatus.SCHEDULED:
                    transaction.transaction_status = TransactionStatus.OVERDUE
                    transaction.last_updated_at = DateTimeUtils.now_dt()
                    await self.transaction_opr.upsert_transaction(transaction)
                return
            
            # If user has enough balance, deduct the amount from the wallet
            user_wallet.balance -= transaction.amount
            user_wallet.last_updated_at = DateTimeUtils.now_dt()
            await self.user_opr.upsert_user_wallet(user_wallet)
            transaction.transaction_status = TransactionStatus.PAID
            transaction.last_updated_at = DateTimeUtils.now_dt()
            await self.transaction_opr.upsert_transaction(transaction)

            # Update next payment and expire dates
            await self.next_subscription(transaction)
    
    async def apply_penalty(self, transaction: Transaction) -> None:
        from . import InstanceService
        instance_service = InstanceService()
        
        subscription_id = transaction.reference_id.split("_")[1]
        subscription = await self.subscription_opr.get_subscription_by_id(subscription_id)
        if not subscription:
            return
        
        # Delete user instance and subscription
        await self.subscription_opr.delete_subscription(subscription.subscription_id)
        await instance_service.delete_instance(instance_id=subscription.instance_id)
    
    async def process_overdue_subscriptions(self, overdue_subscriptions: List[Transaction]) -> None:
        for transaction in overdue_subscriptions:
            await self.process_transaction(transaction)
        
    async def process_expired_subscriptions(self,expired_subscriptions: List[Transaction]) -> None:
        for transaction in expired_subscriptions:
            transaction.transaction_status = TransactionStatus.EXPIRED
            transaction.last_updated_at = DateTimeUtils.now_dt()
            await self.transaction_opr.upsert_transaction(transaction)
            await self.apply_penalty(transaction, instance_service)
    