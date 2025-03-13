from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UUID
import uuid

from ...utils.datetime import BkkDateTime
from .base import Base

if TYPE_CHECKING:
    from .user_subscription import UserSubscription
    from .user import User
    from .instance_plan import InstancePlan
    from .os_type import OsType

class UserInstance(Base):
    __tablename__ = 'user_instances'

    instance_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users.user_id'), nullable=False)
    instance_plan_id: Mapped[int] = mapped_column(ForeignKey('instance_plans.instance_plan_id'), nullable=False)
    os_type_id: Mapped[int] = mapped_column(ForeignKey('os_types.os_type_id'), nullable=False)
    hostname: Mapped[str] = mapped_column(nullable=False)
    lxd_node_name: Mapped[str] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(BkkDateTime, nullable=False)
    last_updated_at: Mapped[datetime] = mapped_column(BkkDateTime, nullable=False)
    # TBD: password_hash, ip_address
    # password_hash: Mapped[str] = mapped_column(nullable=False)
    # ip_address: Mapped[str] = mapped_column(nullable=False)

    instance_plan: Mapped['InstancePlan'] = relationship('InstancePlan', back_populates='user_instances')
    os_type: Mapped['OsType'] = relationship('OsType', back_populates='user_instances')
    user: Mapped['User'] = relationship('User', back_populates='user_instances')
    user_subscription: Mapped['UserSubscription'] = relationship('UserSubscription', back_populates='user_instance')