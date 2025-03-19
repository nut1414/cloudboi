from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
import uuid

from .base import Base
from ...utils.datetime import UTCDateTime

if TYPE_CHECKING:
    from .user import User

class UserWallet(Base):
    __tablename__ = 'user_wallets'

    wallet_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users.user_id'), unique=True, nullable=False)
    balance: Mapped[float] = mapped_column(nullable=False, default=0.0)
    last_updated_at: Mapped[datetime] = mapped_column(UTCDateTime, nullable=False)

    user: Mapped['User'] = relationship('User', back_populates='wallet')