from .database import DataInitializer 
from .tables.user_role import UserRole 
from .tables.os_type import OsType 
from .tables.instance_plan import InstancePlan 
 
async def initialize_data(): 
    initializer = DataInitializer() 
 
    initializer.register(UserRole, [ 
        {"role_name": "user"}, 
        {"role_name": "admin"} 
    ], ["role_name"]) 
 
    ubuntu_versions = [ 
        "20.04", "20.10", "21.04", "21.10", 
        "22.04", "22.10", "23.04", "23.10", 
        "24.04", "24.10" 
    ] 
 
    debian_versions = [ 
        "bookworm", "bullseye", "sid", "trixie" 
    ] 
 
    fedora_versions = [ 
        "40", "41" 
    ] 
 
    initializer.register(OsType, [ 
        {"os_image_name": "ubuntu", "os_image_version": version} 
        for version in ubuntu_versions 
    ] + [ 
        {"os_image_name": "Debian", "os_image_version": version} 
        for version in debian_versions 
    ] + [ 
        {"os_image_name": "Fedora", "os_image_version": version} 
        for version in fedora_versions 
    ], ["os_image_name", "os_image_version"])
 
    # Instance Plans based on common cloud offerings
    # Format: name, vcpus, ram (GB), storage (GB), cost per hour ($)
    instance_plans = [
        # Micro/Nano tier
        {"instance_package_name": "nano-1", "vcpu_amount": 1, "ram_amount": 1, "storage_amount": 10, "cost_hour": 0.005},
        {"instance_package_name": "micro-1", "vcpu_amount": 1, "ram_amount": 2, "storage_amount": 20, "cost_hour": 0.01},
        
        # Standard tier
        {"instance_package_name": "standard-2", "vcpu_amount": 2, "ram_amount": 4, "storage_amount": 40, "cost_hour": 0.02},
        {"instance_package_name": "standard-4", "vcpu_amount": 4, "ram_amount": 8, "storage_amount": 60, "cost_hour": 0.04},
        {"instance_package_name": "standard-8", "vcpu_amount": 8, "ram_amount": 16, "storage_amount": 80, "cost_hour": 0.08},
        
        # Memory-optimized tier
        {"instance_package_name": "memory-2", "vcpu_amount": 2, "ram_amount": 8, "storage_amount": 40, "cost_hour": 0.03},
        {"instance_package_name": "memory-4", "vcpu_amount": 4, "ram_amount": 16, "storage_amount": 60, "cost_hour": 0.06},
        {"instance_package_name": "memory-8", "vcpu_amount": 8, "ram_amount": 32, "storage_amount": 80, "cost_hour": 0.12},
        
        # Compute-optimized tier
        {"instance_package_name": "compute-2", "vcpu_amount": 2, "ram_amount": 2, "storage_amount": 40, "cost_hour": 0.025},
        {"instance_package_name": "compute-4", "vcpu_amount": 4, "ram_amount": 4, "storage_amount": 60, "cost_hour": 0.05},
        {"instance_package_name": "compute-8", "vcpu_amount": 8, "ram_amount": 8, "storage_amount": 80, "cost_hour": 0.10},
        
        # Storage-optimized tier
        {"instance_package_name": "storage-2", "vcpu_amount": 2, "ram_amount": 4, "storage_amount": 100, "cost_hour": 0.03},
        {"instance_package_name": "storage-4", "vcpu_amount": 4, "ram_amount": 8, "storage_amount": 200, "cost_hour": 0.06},
        {"instance_package_name": "storage-8", "vcpu_amount": 8, "ram_amount": 16, "storage_amount": 400, "cost_hour": 0.12},
        
        # High-performance tier
        {"instance_package_name": "performance-16", "vcpu_amount": 16, "ram_amount": 64, "storage_amount": 200, "cost_hour": 0.25},
        {"instance_package_name": "performance-32", "vcpu_amount": 32, "ram_amount": 128, "storage_amount": 400, "cost_hour": 0.50}
    ]
    
    initializer.register(InstancePlan, instance_plans, ["instance_package_name"]) 
 
    await initializer.execute()