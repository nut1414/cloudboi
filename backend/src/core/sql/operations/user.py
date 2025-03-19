from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert as pg_insert
import uuid

from .base import BaseOperation
from ..tables.user import User
from ..tables.user_wallet import UserWallet
from ...models.user import UserInDB as UserModel, UserRole as UserRoleModel, UserWallet as UserWalletModel


class UserOperation(BaseOperation):
    async def get_user_by_username(self, username: str) -> UserModel:
        async with self.session() as db:
            stmt = select(User).where(User.username == username)
            result = (await db.execute(stmt)).scalar()
            return self.to_pydantic(UserModel, result)

    async def get_user_by_email(self, email: str) -> UserModel:
        async with self.session() as db:
            stmt = select(User).where(User.email == email)
            result = (await db.execute(stmt)).scalar()
            return self.to_pydantic(UserModel, result)
    
    async def upsert_user(self, user: UserModel) -> UserModel:
        async with self.session() as db:
            if user.user_id is None:
                user.user_id = uuid.uuid4()

            stmt = pg_insert(User).values(
                user_id=user.user_id,
                username=user.username,
                email=user.email,
                password_hash=user.password_hash,
                last_updated_at=user.last_updated_at
            ).on_conflict_do_update(
                index_elements=['user_id'],
                set_={
                    'username': user.username,
                    'email': user.email,
                    'password_hash': user.password_hash,
                    'last_updated_at': user.last_updated_at
                }
            ).returning(User)
            result = (await db.execute(stmt)).scalar()
            return self.to_pydantic(UserModel, result)
    
    async def get_user_role(self, username: str) -> UserRoleModel:
        async with self.session() as db:
            stmt = select(User).where(User.username == username).options(selectinload(User.role))
            user = (await db.execute(stmt)).scalar_one_or_none()
            return self.to_pydantic(UserRoleModel, user.role)
    
    async def get_user_wallet(
            self,
            user_id: Optional[uuid.UUID] = None,
            username: Optional[str] = None
        ) -> UserWalletModel:
        async with self.session() as db:
            stmt = select(User)
            if user_id is not None:
                stmt = stmt.where(User.user_id == user_id)
            elif username is not None:
                stmt = stmt.where(User.username == username)
            stmt = stmt.options(selectinload(User.wallet))
            user = (await db.execute(stmt)).scalar_one_or_none()
            return self.to_pydantic(UserWalletModel, user.wallet)
    
    async def upsert_user_wallet(self, user_wallet: UserWalletModel) -> UserWalletModel:
        async with self.session() as db:
            stmt = pg_insert(UserWallet).values(
                user_id=user_wallet.user_id,
                balance=user_wallet.balance if user_wallet.balance is not None else 0.0,
                last_updated_at=user_wallet.last_updated_at
            ).on_conflict_do_update(
                index_elements=['user_id'],
                set_={
                    'balance': user_wallet.balance,
                    'last_updated_at': user_wallet.last_updated_at
                }
            ).returning(UserWallet)
            result = (await db.execute(stmt)).scalar()
            return self.to_pydantic(UserWalletModel, result)