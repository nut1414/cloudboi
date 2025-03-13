from typing import TYPE_CHECKING, List
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .user_instance import UserInstance

class InstancePlan(Base):
    __tablename__ = 'instance_plans'
    
    instance_plan_id: Mapped[int] = mapped_column(primary_key=True)
    instance_package_name: Mapped[str] = mapped_column(nullable=False)
    vcpu_amount: Mapped[int] = mapped_column(nullable=False)
    ram_amount: Mapped[int] = mapped_column(nullable=False)
    storage_amount: Mapped[int] = mapped_column(nullable=False)
    cost_hour: Mapped[float] = mapped_column(nullable=False)

    user_instances: Mapped[List['UserInstance']] = relationship('UserInstance', back_populates='instance_plan')