from datetime import datetime
from typing import TYPE_CHECKING, List
from sqlalchemy import UUID, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid

from .base import Base
from ...utils.datetime import UTCDateTime

if TYPE_CHECKING:
    from .user_wallet import UserWallet
    from .user_instance import UserInstance
    from .transaction import Transaction
    from .user_role import UserRole

class User(Base):
    __tablename__ = 'users'

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(nullable=False, unique=True)
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    role_id: Mapped[int] = mapped_column(ForeignKey('user_roles.role_id'), nullable=False, default=1)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    last_updated_at: Mapped[datetime] = mapped_column(UTCDateTime, nullable=False)

    role: Mapped['UserRole'] = relationship('UserRole', back_populates='users')
    wallet: Mapped['UserWallet'] = relationship('UserWallet', back_populates='user')
    user_instances: Mapped[List['UserInstance']] = relationship('UserInstance', back_populates='user')
    transactions: Mapped[List['Transaction']] = relationship('Transaction', back_populates='user')