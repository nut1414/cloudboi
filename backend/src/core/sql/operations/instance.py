from .base import BaseOperation
from ..tables.instance_type import InstanceType
from ..tables.os_type import OsType
from ...models.Instance import InstanceType as InstanceTypeModel, OsType as OsTypeModel
from sqlalchemy import select


class InstanceOperation(BaseOperation):
    async def get_all_instance_types(self):
        stmt = select(InstanceType)
        result = (await self.db.execute(stmt)).scalars().all()
        return self.to_pydantic(InstanceTypeModel, result)
    async def get_all_os_types(self):
        stmt = select(OsType)
        result = (await self.db.execute(stmt)).scalars().all()
        return self.to_pydantic(OsTypeModel, result)