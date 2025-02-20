from fastapi import Depends

from ..models.Instance import InstanceCreate
from ...infra.managers.lxd import LXDManager


class LXDService:
    def __init__(self, lxd_manager: LXDManager = Depends()):
        self.lxd_manager = lxd_manager
    
    def create_instance(self, instance_create: InstanceCreate) -> bool:
        is_success = self.lxd_manager.create_container(
            self.to_instance_create_config(instance_create)
        )
        if is_success and instance_create.root_password:
            self.lxd_manager.set_root_password(
                self.lxd_manager.get_container_by_name(instance_create.instance_name),
                instance_create.root_password
            )
        return is_success
    
    def to_instance_create_config(self, instance_create: InstanceCreate) -> dict:
        return {
            "device": {
                "root": {
                    "path": "/",
                    "pool": "default",
                    "size": f"{instance_create.instance_type.storage_amount}GiB",
                    "type": "disk"
                }
            },
            "name": instance_create.instance_name,
            "source": {
                "alias": instance_create.os_type.os_image_name,
                "protocol": "simplesteams",
                "server": "url here",
                "type": "image"
            },
            "type": "container",
            "config": {
                "limits.cpu": f"{instance_create.instance_type.vcpu_amount}",
                "limits.memory": f"{instance_create.instance_type.ram_amount}GiB",
                "limits.memory.enforce": "hard"
            }
        }
        