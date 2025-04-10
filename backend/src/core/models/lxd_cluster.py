from typing import Dict, List, Optional
from .base_model import BaseModel

class CreateJoinTokenRequest(BaseModel):
    server_name: str
    
class CreateJoinTokenResponse(BaseModel):
    join_token: str
    
class AddMemberRequest(BaseModel):
    server_name: str

class AddMemberResponse(BaseModel):
    success: bool

class StoragePoolUsage(BaseModel):
    total: int
    used: int

class StoragePoolState(BaseModel):
    inodes: StoragePoolUsage
    space: StoragePoolUsage

class SysInfo(BaseModel):
    buffered_ram: int
    free_ram: int
    free_swap: int
    load_averages: List[float]
    logical_cpus: int
    processes: int
    shared_ram: int
    total_ram: int
    total_swap: int
    uptime: int

class ClusterMemberState(BaseModel):
    server_name: str
    storage_pools: Dict[str, StoragePoolState]
    sysinfo: SysInfo

class ClusterMemberInfo(BaseModel):
    server_name: str
    status: str
    message: str
    url: str
    roles: List[str]
    groups: List[str]

class GetClusterMembersStateInfoResponse(BaseModel):
    members_states: List[ClusterMemberState]
    members_infos: List[ClusterMemberInfo]
    members_leader: str
    members_groups: List[str]
    members_roles: List[str]