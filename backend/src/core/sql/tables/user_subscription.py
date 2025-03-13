from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
import uuid

from .base import Base
from ...utils.datetime import BkkDateTime

if TYPE_CHECKING:
    from .user_instance import UserInstance

class UserSubscription(Base):
    __tablename__ = 'user_subscriptions'

    subscription_id: Mapped[int] = mapped_column(primary_key=True)
    instance_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('user_instances.instance_id'), unique=True, nullable=False)
    next_payment_date: Mapped[datetime] = mapped_column(BkkDateTime, nullable=False)
    next_expire_date: Mapped[datetime] = mapped_column(BkkDateTime, nullable=False)

    user_instance: Mapped['UserInstance'] = relationship('UserInstance', back_populates='user_subscription')