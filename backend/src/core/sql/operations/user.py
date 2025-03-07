from .base import BaseOperation
from ..tables.user import User
from ..tables.user_role import UserRole
from ...models.user import UserInDB as UserModel, UserRole as UserRoleModel
from ...utils.datetime import DateTimeUtils
from sqlalchemy import select, insert


class UserOperation(BaseOperation):
    async def get_user_by_username(self, username: str) -> UserModel:
        stmt = select(User).where(User.username == username)
        result = (await self.db.execute(stmt)).scalar()
        return self.to_pydantic(UserModel, result)

    async def get_user_by_email(self, email: str) -> UserModel:
        stmt = select(User).where(User.email == email)
        result = (await self.db.execute(stmt)).scalar()
        return self.to_pydantic(UserModel, result)

    async def create_user(self, user: UserModel) -> UserModel:
        stmt = insert(User).values(
            username=user.username,
            email=user.email,
            password_hash=user.password_hash,
            registeration_date=DateTimeUtils.now()
        ).returning(User)
        result = (await self.db.execute(stmt)).scalar()
        return self.to_pydantic(UserModel, result)

    async def get_user_role(self, username: str) -> UserRoleModel:
        stmt = select(User).where(User.username == username)
        user = (await self.db.execute(stmt)).scalar()
        stmt = select(UserRole).where(UserRole.role_id == user.role_id)
        role = (await self.db.execute(stmt)).scalar()
        return self.to_pydantic(UserRoleModel, role)