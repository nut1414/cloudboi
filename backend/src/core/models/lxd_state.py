from typing import Dict, List, Optional
from pydantic import BaseModel, Field

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

class InstanceState(BaseModel):
    status: str
    status_code: int
    disk: Dict[str, DiskUsage]
    memory: MemoryUsage
    network: Optional[Dict[str, NetworkInterface]] = None # Network might be null if stopped/not configured
    pid: int
    processes: int
    cpu: CPUUsage 