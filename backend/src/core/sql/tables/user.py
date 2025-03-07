from sqlalchemy import UUID, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
import uuid


from .base import Base

class User(Base):
    __tablename__ = 'users'

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(nullable=False, unique=True)
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    role_id: Mapped[int] = mapped_column(ForeignKey('user_roles.role_id'), nullable=False, default=1)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    registeration_date: Mapped[str] = mapped_column(nullable=False)