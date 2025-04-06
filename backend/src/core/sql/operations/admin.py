from typing import List
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert as pg_insert
import uuid

from .base import BaseOperation
from ..tables.user import User
from ...models.admin import AdminUsersWithDetails


class AdminOperation(BaseOperation):
    async def get_all_users_with_details(self) -> List[AdminUsersWithDetails]:
        async with self.session() as db:
            stmt = select(User).options(
                selectinload(User.user_instances),
                selectinload(User.role)
            )
            result = (await db.execute(stmt)).scalars().all()
            return self.to_pydantic(AdminUsersWithDetails, result)
