from datetime import datetime
from typing import List, Optional, Dict
import uuid
from .base_model import BaseModel

class CPUUsage(BaseModel):
    usage: int

class DiskUsage(BaseModel):
    usage: int

class MemoryUsage(BaseModel):
    usage: int
    usage_peak: int
    swap_usage: int
    swap_usage_peak: int

class NetworkAddress(BaseModel):
    family: str
    address: str
    netmask: str
    scope: str

class NetworkCounters(BaseModel):
    bytes_received: int
    bytes_sent: int
    packets_received: int
    packets_sent: int

class NetworkInterface(BaseModel):
    addresses: List[NetworkAddress]
    counters: NetworkCounters
    hwaddr: str
    host_name: str
    mtu: int
    state: str
    type: str

class LxdInstanceState(BaseModel):
    status: str
    status_code: int
    disk: Dict[str, DiskUsage]
    memory: MemoryUsage
    network: Optional[Dict[str, NetworkInterface]] = None # Network might be null if stopped/not configured
    pid: int
    processes: int
    cpu: CPUUsage 

class BaseInstanceState(BaseModel):
    network: Optional[Dict[str, NetworkInterface]] = None 
    memory: MemoryUsage
    disk: Dict[str, DiskUsage]  
    cpu: CPUUsage  

    @classmethod
    def from_lxd_state(cls, state: LxdInstanceState) -> "BaseInstanceState":
        return cls(
            network=state.network,
            memory=state.memory,
            disk=state.disk,
            cpu=state.cpu
        )

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

class InstanceControlResponse(BaseModel):
    instance_id: uuid.UUID
    instance_name: str
    is_success: bool