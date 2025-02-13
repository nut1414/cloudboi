from .base import Base
from sqlalchemy.orm import Mapped, mapped_column

class OsType(Base):
    __tablename__ = 'os_types'

    os_type_id: Mapped[int] = mapped_column(primary_key=True)
    os_image_name: Mapped[str] = mapped_column(nullable=False)
    os_image_version: Mapped[str] = mapped_column(nullable=False)