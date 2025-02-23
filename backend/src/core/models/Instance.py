from typing import List
from .BaseModel import BaseModel

class InstanceType(BaseModel):
    instance_type_id: int
    instance_package_name: str
    vcpu_amount: int
    ram_amount: int
    storage_amount: int
    cost_hour: float

class OsType(BaseModel):
    os_type_id: int
    os_image_name: str
    os_image_version: str

class InstanceDetails(BaseModel):
    instance_package: List[InstanceType]
    os_image: List[OsType]

class InstanceCreateRequest(BaseModel):
    os_type: OsType
    instance_type: InstanceType
    instance_name: str
    root_password: str

class InstanceCreateResponse(BaseModel):
    instance_name: str
    instance_status: str
    created_at: str