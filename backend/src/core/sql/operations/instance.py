from typing import List, Optional
import uuid
from sqlalchemy import delete, insert, select
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert as pg_insert

from .base import BaseOperation
from ..tables.instance_plan import InstancePlan
from ..tables.os_type import OsType
from ...models.instance import InstancePlan as InstancePlanModel, OsType as OsTypeModel, UserInstance as UserInstanceModel
from ..tables.user_instance import UserInstance
from ..tables.user import User


class InstanceOperation(BaseOperation):
    async def get_all_instance_plans(self) -> List[InstancePlanModel]:
        async with self.session() as db:
            stmt = select(InstancePlan)
            result = (await db.execute(stmt)).scalars().all()
            return self.to_pydantic(InstancePlanModel, result)
    
    async def get_instance_plan_by_id(self, instance_plan_id: int) -> InstancePlanModel:
        async with self.session() as db:
            stmt = select(InstancePlan).where(InstancePlan.instance_plan_id == instance_plan_id)
            result = (await db.execute(stmt)).scalar_one_or_none()
            return self.to_pydantic(InstancePlanModel, result)
    
    async def get_all_os_types(self) -> List[OsTypeModel]:
        async with self.session() as db:
            stmt = select(OsType)
            result = (await db.execute(stmt)).scalars().all()
            return self.to_pydantic(OsTypeModel, result)
    
    async def get_os_type_by_id(self, os_type_id: int) -> OsTypeModel:
        async with self.session() as db:
            stmt = select(OsType).where(OsType.os_type_id == os_type_id)
            result = (await db.execute(stmt)).scalar_one_or_none()
            return self.to_pydantic(OsTypeModel, result)
    
    async def get_instance_by_name(self, instance_name: str) -> UserInstanceModel:
        async with self.session() as db:
            stmt = select(UserInstance).where(UserInstance.hostname == instance_name)
            result = (await db.execute(stmt)).scalar_one_or_none()
            return self.to_pydantic(UserInstanceModel, result)
    
    async def upsert_user_instance(self, user_instance: UserInstanceModel) -> UserInstanceModel:
        async with self.session() as db:
            if user_instance.instance_id is None:
                user_instance.instance_id = uuid.uuid4()
            
            stmt = pg_insert(UserInstance).values(
                instance_id=user_instance.instance_id,
                user_id=user_instance.user_id,
                instance_plan_id=user_instance.instance_plan_id,
                os_type_id=user_instance.os_type_id,
                hostname=user_instance.hostname,
                lxd_node_name=user_instance.lxd_node_name,
                status=user_instance.status,
                created_at=user_instance.created_at,
                last_updated_at=user_instance.last_updated_at
            ).on_conflict_do_update(
                index_elements=['instance_id'],
                set_={
                    'instance_plan_id': user_instance.instance_plan_id,
                    'os_type_id': user_instance.os_type_id,
                    'hostname': user_instance.hostname,
                    'lxd_node_name': user_instance.lxd_node_name,
                    'status': user_instance.status,
                    'created_at': user_instance.created_at,
                    'last_updated_at': user_instance.last_updated_at
                }
            ).returning(UserInstance)
            result = (await db.execute(stmt)).scalar()
            return self.to_pydantic(UserInstanceModel, result)
    
    async def delete_user_instance(self, instance_id: uuid.UUID) -> None:
        async with self.session() as db:
            stmt = delete(UserInstance).where(UserInstance.instance_id == instance_id)
            await db.execute(stmt)

    async def get_user_instance(
        self, 
        instance_id: Optional[uuid.UUID] = None, 
        instance_name: Optional[str] = None, 
        user_id: Optional[uuid.UUID] = None, 
        username: Optional[str] = None
    ) -> UserInstanceModel:
        async with self.session() as db:
            stmt = select(UserInstance)
            if instance_id is not None:
                stmt = stmt.where(UserInstance.instance_id == instance_id)
            elif instance_name is not None:
                if user_id is not None:
                    stmt = stmt.where(UserInstance.user_id == user_id)
                elif username is not None:
                    stmt = stmt.join(User).where(User.username == username)
                stmt = stmt.where(UserInstance.hostname == instance_name)
            result = (await db.execute(stmt)).scalar_one_or_none()
            return self.to_pydantic(UserInstanceModel, result)
    
    async def get_all_user_instances(self, username: str) -> List[UserInstanceModel]:
        async with self.session() as db:
            stmt = select(UserInstance).join(User).where(User.username == username)
            result = (await db.execute(stmt)).scalars().all()
            return self.to_pydantic(UserInstanceModel, result)
