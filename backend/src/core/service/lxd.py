from datetime import datetime

from ..models.Instance import InstanceCreateRequest, InstanceCreateResponse
from ...infra.managers.lxd import LXDManager


class LXDService:
    def __init__(self):
        self.lxd_manager = LXDManager.get_manager()
    
    @classmethod
    def get_service(cls) -> "LXDService":
        return cls()
    
    def create_instance(self, instance_create: InstanceCreateRequest) -> InstanceCreateResponse:
        container = self.lxd_manager.create_container(
            self.to_instance_create_config(instance_create)
        )
        if container and instance_create.root_password:
            is_set_password_success = self.lxd_manager.set_root_password(
                container,
                instance_create.root_password
            )
        
        if not is_set_password_success:
            self.lxd_manager.delete_container(container)
            raise RuntimeError("Failed to set root password")
        
        return InstanceCreateResponse(
            instance_name=container.name,
            instance_status=container.status,
            created_at=self.format_iso_date(container.created_at)
        )
    
    def to_instance_create_config(self, instance_create: InstanceCreateRequest) -> dict:
        return {
            "device": {
                "root": {
                    "path": "/",
                    "pool": "default",
                    "size": f"{instance_create.instance_type.storage_amount}GB",
                    "type": "disk"
                }
            },
            "name": instance_create.instance_name,
            "source": {
                "alias": self.to_image_alias(
                    instance_create.os_type.os_image_name,
                    instance_create.os_type.os_image_version
                ),
                "protocol": "simplestreams",
                "server": self.get_image_server_url(instance_create.os_type.os_image_name),
                "mode": "pull",
                "cache": True,
                "type": "image"
            },
            "type": "container",
            "config": {
                "limits.cpu": f"{instance_create.instance_type.vcpu_amount}",
                "limits.memory": f"{instance_create.instance_type.ram_amount}GB",
                "limits.memory.enforce": "hard"
            }
        }
    
    def to_image_alias(self, os_image_name: str, os_image_version: str) -> str:
        if os_image_name == "ubuntu":
            return os_image_version
        return f"{os_image_name}/{os_image_version}"
    
    def get_image_server_url(self, os_image_name: str) -> str:
        if os_image_name == "ubuntu":
            return "https://cloud-images.ubuntu.com/releases"
        return "https://images.lxd.canonical.com/"
    
    def format_iso_date(self, iso_date_string: datetime) -> str:
        try:
            dt = datetime.fromisoformat(iso_date_string.replace('Z', '+00:00'))
            return dt.strftime("%d %B %Y, %H:%M:%S")  # Example: "21 February 2025, 09:47:59"
        except (ValueError, TypeError):
            return iso_date_string
        