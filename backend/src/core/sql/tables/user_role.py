from typing import TYPE_CHECKING, List
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .user import User

class UserRole(Base):
    __tablename__ = 'user_roles'

    role_id: Mapped[int] = mapped_column(primary_key=True)
    role_name: Mapped[str] = mapped_column(nullable=False, unique=True)

    users: Mapped[List['User']] = relationship('User', back_populates='role')