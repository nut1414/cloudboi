from datetime import datetime
from typing import List, Optional
from sqlalchemy import select, insert, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert as pg_insert
import uuid

from .base import BaseOperation
from ..tables.user import User
from ..tables.user_wallet import UserWallet
from ..tables.user_subscription import UserSubscription
from ...models.user import UserInDB as UserModel, UserWallet as UserWalletModel
from ...models.subscription import UserSubscription as UserSubscriptionModel


class SubscriptionOperation(BaseOperation):
    async def upsert_subscription(self, instance_id: uuid.UUID, next_payment_date: datetime, next_expire_date: datetime) -> UserSubscriptionModel:
        async with self.session() as db:
            stmt = pg_insert(UserSubscription).values(
                instance_id=instance_id,
                next_payment_date=next_payment_date,
                next_expire_date=next_expire_date
            ).on_conflict_do_update(
                index_elements=['instance_id'],
                set_={
                    'next_payment_date': next_payment_date,
                    'next_expire_date': next_expire_date
                }
            ).returning(UserSubscription)
            result = (await db.execute(stmt)).scalar()
            return self.to_pydantic(UserSubscriptionModel, result)
    
    async def delete_subscription(
        self,
        subscription_id: Optional[int] = None,
        instance_id: Optional[uuid.UUID] = None,
    ) -> Optional[UserSubscriptionModel]:
        if subscription_id is None and instance_id is None:
            raise ValueError("Either subscription_id or instance_id must be provided.")
        async with self.session() as db:
            stmt = delete(UserSubscription)
            if subscription_id is not None:
                stmt = stmt.where(UserSubscription.subscription_id == subscription_id)
            if instance_id is not None:
                stmt = stmt.where(UserSubscription.instance_id == instance_id)
            stmt = stmt.returning(UserSubscription)
            result = (await db.execute(stmt)).scalar_one_or_none()
            return self.to_pydantic(UserSubscriptionModel, result)
    
    async def get_subscription_by_id(self, subscription_id: int) -> UserSubscriptionModel:
        async with self.session() as db:
            stmt = select(UserSubscription).where(UserSubscription.subscription_id == subscription_id)
            result = (await db.execute(stmt)).scalar()
            return self.to_pydantic(UserSubscriptionModel, result)
    
    async def get_overdue_subscriptions(self, given_date: datetime) -> List[UserSubscriptionModel]:
        async with self.session() as db:
            stmt = select(UserSubscription).where(UserSubscription.next_payment_date < given_date)
            result = (await db.execute(stmt)).scalars().all()
            return self.to_pydantic(UserSubscriptionModel, result)
    
    async def get_expired_subscriptions(self, given_date: datetime) -> List[UserSubscriptionModel]:
        async with self.session() as db:
            stmt = select(UserSubscription).where(UserSubscription.next_expire_date < given_date)
            result = (await db.execute(stmt)).scalars().all()
            return self.to_pydantic(UserSubscriptionModel, result)