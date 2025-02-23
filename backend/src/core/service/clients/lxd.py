from datetime import datetime
from functools import wraps
from typing import Any, Callable, TypeVar
from pylxd import models

from .base_instance_client import BaseInstanceClient
from ...models.Instance import InstanceCreateRequest, InstanceCreateResponse
from ....infra.managers.lxd import LXDManager

InstanceIdentifier = str | models.Instance
F = TypeVar("F", bound=Callable[..., Any])

def _resolve_instance(func: F) -> F:
    """Private decorator to resolve instance_identifier into a models.Instance if it's a string."""
    @wraps(func)
    def wrapper(self: "LXDClient", instance_identifier: InstanceIdentifier, *args, **kwargs):
        if isinstance(instance_identifier, str):
            instance_identifier = self.get_instance(instance_identifier)
        return func(self, instance_identifier, *args, **kwargs)
    return wrapper  # type: ignore

class LXDClient(BaseInstanceClient[models.Instance]):
    def __init__(self):
        self.lxd_manager = LXDManager.get_manager()
    
    def get_instance(self, instance_identifier: str) -> models.Instance:
        return self.lxd_manager.get_container_by_name(instance_identifier)
    
    def create_instance(self, instance_config: InstanceCreateRequest) -> InstanceCreateResponse:
        container = self.lxd_manager.create_container(
            self.__to_instance_create_config(instance_config)
        )
        if container and instance_config.root_password:
            is_set_password_success = self.set_instance_password(
                container,
                instance_config.root_password
            )
        
        if not is_set_password_success:
            self.delete_instance(container)
            raise RuntimeError("Failed to set root password")
        
        return InstanceCreateResponse(
            instance_name=container.name,
            instance_status=container.status,
            created_at=self.__format_iso_date(container.created_at)
        )
    
    @_resolve_instance
    def delete_instance(self, instance_identifier: models.Instance) -> bool:
        return self.lxd_manager.delete_container(instance_identifier)
    
    @_resolve_instance
    def start_instance(self, instance_identifier: models.Instance) -> bool:
        return self.lxd_manager.start_container(instance_identifier)

    @_resolve_instance  
    def stop_instance(self, instance_identifier: models.Instance) -> bool:
        return self.lxd_manager.stop_container(instance_identifier)
    
    @_resolve_instance
    def set_instance_password(self, instance_identifier: models.Instance, password: str) -> bool:
        return self.lxd_manager.set_root_password(instance_identifier, password)
    
    def __to_instance_create_config(self, instance_create: InstanceCreateRequest) -> dict:
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
                "alias": self.__to_image_alias(
                    instance_create.os_type.os_image_name,
                    instance_create.os_type.os_image_version
                ),
                "protocol": "simplestreams",
                "server": self.__get_image_server_url(instance_create.os_type.os_image_name),
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
    
    def __to_image_alias(self, os_image_name: str, os_image_version: str) -> str:
        if os_image_name == "ubuntu":
            return os_image_version
        return f"{os_image_name}/{os_image_version}"
    
    def __get_image_server_url(self, os_image_name: str) -> str:
        if os_image_name == "ubuntu":
            return "https://cloud-images.ubuntu.com/releases"
        return "https://images.lxd.canonical.com/"
    
    def __format_iso_date(self, iso_date_string: datetime) -> str:
        try:
            dt = datetime.fromisoformat(iso_date_string.replace('Z', '+00:00'))
            return dt.strftime("%d %B %Y, %H:%M:%S")  # Example: "21 February 2025, 09:47:59"
        except (ValueError, TypeError):
            return iso_date_string
        