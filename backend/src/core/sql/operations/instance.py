from typing import List
from .base import BaseOperation
from ..tables.instance_type import InstanceType
from ..tables.os_type import OsType
from ...models.instance import InstanceType as InstanceTypeModel, OsType as OsTypeModel
from sqlalchemy import select


class InstanceOperation(BaseOperation):
    async def get_all_instance_types(self) -> List[InstanceTypeModel]:
        stmt = select(InstanceType)
        result = (await self.db.execute(stmt)).scalars().all()
        return self.to_pydantic(InstanceTypeModel, result)
    
    async def get_instance_type_by_id(self, instance_type_id: int) -> InstanceTypeModel:
        stmt = select(InstanceType).where(InstanceType.instance_type_id == instance_type_id)
        result = (await self.db.execute(stmt)).scalar()
        return self.to_pydantic(InstanceTypeModel, result)
    
    async def get_all_os_types(self) -> List[OsTypeModel]:
        stmt = select(OsType)
        result = (await self.db.execute(stmt)).scalars().all()
        return self.to_pydantic(OsTypeModel, result)
    
    async def get_os_type_by_id(self, os_type_id: int) -> OsTypeModel:
        stmt = select(OsType).where(OsType.os_type_id == os_type_id)
        result = (await self.db.execute(stmt)).scalar()
        return self.to_pydantic(OsTypeModel, result)