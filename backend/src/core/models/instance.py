from datetime import datetime
from typing import List, Optional
import uuid
from .base_model import BaseModel

class UserInstance(BaseModel):
    instance_id: Optional[uuid.UUID] = None
    user_id: Optional[uuid.UUID] = None
    instance_plan_id: int
    os_type_id: int
    hostname: str
    lxd_node_name: str
    status: str
    created_at: Optional[datetime] = None
    last_updated_at: datetime

class InstancePlan(BaseModel):
    instance_plan_id: int
    instance_package_name: str
    vcpu_amount: int
    ram_amount: int
    storage_amount: int
    cost_hour: float

class OsType(BaseModel):
    os_type_id: int
    os_image_name: str
    os_image_version: str

class UserInstanceFromDB(UserInstance):
    instance_plan: InstancePlan
    os_type: OsType

class InstanceDetails(BaseModel):
    instance_package: List[InstancePlan]
    os_image: List[OsType]

class InstanceCreateRequest(BaseModel):
    os_type: OsType
    instance_plan: InstancePlan
    instance_name: str
    root_password: str

class InstanceCreateResponse(BaseModel):
    instance_name: str
    instance_status: str
    created_at: datetime

class UserInstanceResponse(BaseModel):
    instance_id: uuid.UUID
    instance_name: str
    instance_status: str
    instance_plan: InstancePlan
    os_type: OsType
    last_updated_at: datetime