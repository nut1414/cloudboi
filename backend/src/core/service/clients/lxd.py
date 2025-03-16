from datetime import datetime
from fastapi import WebSocket
from pylxd import models

from ...commons.exception import create_exception_class
from .websocket import LXDWebSocketManager, LXDWebSocketSession
from .base_instance_client import BaseInstanceClient
from ...models.instance import InstanceCreateRequest, InstanceCreateResponse, UserInstance
from ....infra.managers.lxd import LXDManager
from ...utils.decorator import create_decorator
from ...utils.datetime import DateTimeUtils

LXDClientException = create_exception_class("LXDClient")

def _resolve_instance_func(self: "LXDClient", args, kwargs, *fa, **fk):
    if isinstance(args[0], str):
        return ((self.get_instance(args[0]), *args[1:]), kwargs)
    return args, kwargs

_resolve_instance = create_decorator(_resolve_instance_func)

class LXDClient(BaseInstanceClient[models.Instance]):
    def __init__(
            self,
            lxd_manager: LXDManager,
            lxd_ws_manager: LXDWebSocketManager
        ):
        self.lxd_manager = lxd_manager
        self.lxd_ws_manager = lxd_ws_manager
    
    def get_instance(self, instance_identifier: str) -> models.Instance:
        return self.lxd_manager.get_container_by_name(instance_identifier)
    
    def create_instance(self, instance_config: InstanceCreateRequest) -> UserInstance:
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
        
        return UserInstance(
            instance_plan_id=instance_config.instance_plan.instance_plan_id,
            os_type_id=instance_config.os_type.os_type_id,
            hostname=container.name,
            lxd_node_name=container.location,
            status=container.status,
            created_at=DateTimeUtils.now_dt(),
            last_updated_at=DateTimeUtils.now_dt()
        )
    
    @_resolve_instance()
    def delete_instance(self, instance_identifier: models.Instance) -> bool:
        return self.lxd_manager.delete_container(instance_identifier)
    
    @_resolve_instance()
    def start_instance(self, instance_identifier: models.Instance) -> bool:
        return self.lxd_manager.start_container(instance_identifier)

    @_resolve_instance()  
    def stop_instance(self, instance_identifier: models.Instance) -> bool:
        return self.lxd_manager.stop_container(instance_identifier)
    
    @_resolve_instance()
    def set_instance_password(self, instance_identifier: models.Instance, password: str) -> bool:
        return self.lxd_manager.set_root_password(instance_identifier, password)
    
    @_resolve_instance()
    async def websocket_session(self, instance_identifier: models.Instance, client_ws: WebSocket):
        try:
            await client_ws.accept()
            
            ws_response = self.lxd_manager.get_interactive_websocket(instance_identifier)

            session: LXDWebSocketSession = await self.lxd_ws_manager.create_session(
                client_ws=client_ws,
                instance_name=instance_identifier.name,
                lxd_ws_url=ws_response.get("ws"),
                lxd_control_url=ws_response.get("control")
            )

            async with session:
                await session.run()
        except Exception as e:
            await client_ws.close(code=1011, reason=str(e))
            raise LXDClientException(f"Error in websocket_session: {str(e)}")
        finally:
            await self.lxd_ws_manager.remove_session(instance_identifier.name)

    def __to_instance_create_config(self, instance_create: InstanceCreateRequest) -> dict:
        return {
            "device": {
                "root": {
                    "path": "/",
                    "pool": "default",
                    "size": f"{instance_create.instance_plan.storage_amount}GB",
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
                "limits.cpu": f"{instance_create.instance_plan.vcpu_amount}",
                "limits.memory": f"{instance_create.instance_plan.ram_amount}GB",
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