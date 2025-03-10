from .base import Base
from sqlalchemy.orm import Mapped, mapped_column

class UserRole(Base):
    __tablename__ = 'user_roles'

    role_id: Mapped[int] = mapped_column(primary_key=True)
    role_name: Mapped[str] = mapped_column(nullable=False, unique=True)