from typing import TYPE_CHECKING, List
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .user_instance import UserInstance

class OsType(Base):
    __tablename__ = 'os_types'

    os_type_id: Mapped[int] = mapped_column(primary_key=True)
    os_image_name: Mapped[str] = mapped_column(nullable=False)
    os_image_version: Mapped[str] = mapped_column(nullable=False)

    user_instances: Mapped[List['UserInstance']] = relationship('UserInstance', back_populates='os_type')