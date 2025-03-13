from datetime import datetime
from typing import List
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
        result = (await self.db.execute(stmt)).scalar()
        return self.to_pydantic(UserSubscriptionModel, result)
    
    async def delete_subscription(self, subscription_id: int) -> None:
        stmt = delete(UserSubscription).where(UserSubscription.subscription_id == subscription_id)
        await self.db.execute(stmt)
    
    async def get_subscription_by_id(self, subscription_id: int) -> UserSubscriptionModel:
        stmt = select(UserSubscription).where(UserSubscription.subscription_id == subscription_id)
        result = (await self.db.execute(stmt)).scalar()
        return self.to_pydantic(UserSubscriptionModel, result)
    
    async def get_overdue_subscriptions(self, given_date: datetime) -> List[UserSubscriptionModel]:
        stmt = select(UserSubscription).where(UserSubscription.next_payment_date < given_date)
        result = (await self.db.execute(stmt)).scalars().all()
        return self.to_pydantic(UserSubscriptionModel, result)
    
    async def get_expired_subscriptions(self, given_date: datetime) -> List[UserSubscriptionModel]:
        stmt = select(UserSubscription).where(UserSubscription.next_expire_date < given_date)
        result = (await self.db.execute(stmt)).scalars().all()
        return self.to_pydantic(UserSubscriptionModel, result)