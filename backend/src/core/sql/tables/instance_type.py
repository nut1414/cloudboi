from .base import Base
from sqlalchemy.orm import Mapped, mapped_column

class InstanceType(Base):
    __tablename__ = 'instance_types'
    
    instance_type_id: Mapped[int] = mapped_column(primary_key=True)
    instance_package_name: Mapped[str] = mapped_column(nullable=False)
    vcpu_amount: Mapped[int] = mapped_column(nullable=False)
    ram_amount: Mapped[int] = mapped_column(nullable=False)
    storage_amount: Mapped[int] = mapped_column(nullable=False)
    cost_hour: Mapped[float] = mapped_column(nullable=False)