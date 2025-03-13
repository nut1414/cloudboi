from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UUID, Enum, String
import uuid

from .base import Base
from ...constants.transaction_const import TransactionType, TransactionStatus
from ...utils.datetime import BkkDateTime

if TYPE_CHECKING:
    from .user import User

class Transaction(Base):
    __tablename__ = 'transactions'

    transaction_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('users.user_id'), nullable=False)
    reference_id: Mapped[str] = mapped_column(String, nullable=False)
    transaction_type: Mapped[TransactionType] = mapped_column(Enum(TransactionType), nullable=False)
    transaction_status: Mapped[TransactionStatus] = mapped_column(Enum(TransactionStatus), nullable=False)
    amount: Mapped[float] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(BkkDateTime, nullable=False)
    last_updated_at: Mapped[datetime] = mapped_column(BkkDateTime, nullable=False)

    user: Mapped['User'] = relationship('User', back_populates='transactions')
