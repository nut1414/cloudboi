import asyncio
from typing import List, Dict
from fastapi import WebSocket
from pylxd import models

from ....core.config import LXDClientConfig

from ...commons.exception import create_exception_class
from .websocket import LXDWebSocketManager, LXDWebSocketSession
from .base_instance_client import BaseInstanceClient
from ...models.instance import BaseInstanceState, CPUUsage, InstanceCreateRequest, MemoryUsage, UserInstance, LxdInstanceState
from ....infra.managers.lxd import LXDManager
from ...utils.decorator import create_decorator
from ...utils.datetime import DateTimeUtils
from ...utils.dependencies import user_session_ctx
from ...models.lxd_cluster import ClusterMemberState, SysInfo, StoragePoolState, StoragePoolUsage

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
    
    async def create_instance(self, instance_config: InstanceCreateRequest) -> UserInstance:
        container = await asyncio.to_thread(
            self.lxd_manager.create_container,
            self.__to_instance_create_config(instance_config)
        )
        if container and instance_config.root_password:
            is_set_password_success = await self.set_instance_password(
                container,
                instance_config.root_password
            )
        
        if not is_set_password_success:
            await self.delete_instance(container)
        
        return UserInstance(
            user_id=user_session_ctx.get().user_id,
            instance_plan_id=instance_config.instance_plan.instance_plan_id,
            os_type_id=instance_config.os_type.os_type_id,
            hostname=container.name,
            lxd_node_name=container.location,
            status=container.status,
            created_at=DateTimeUtils.now_dt(),
            last_updated_at=DateTimeUtils.now_dt()
        )

    
    @_resolve_instance()
    async def delete_instance(self, instance_identifier: models.Instance) -> bool:
        return await asyncio.to_thread(
            self.lxd_manager.delete_container,
            instance_identifier
        )
    
    @_resolve_instance()
    async def start_instance(self, instance_identifier: models.Instance) -> bool:
        return await asyncio.to_thread(
            self.lxd_manager.start_container,
            instance_identifier
        )

    @_resolve_instance()  
    async def stop_instance(self, instance_identifier: models.Instance) -> bool:
        return await asyncio.to_thread(
            self.lxd_manager.stop_container,
            instance_identifier
        )
    
    @_resolve_instance()
    async def get_instance_state(self, instance_identifier: models.Instance) -> BaseInstanceState:
        cpu_cores = int(instance_identifier.config['limits.cpu'])
        memory_config = instance_identifier.config['limits.memory']
        
        # convert memory_total from GB to bytes by sanitizing the string (if MB or GB is in the string)
        memory_unit = memory_config[-2:]
        memory_amount = int(memory_config[:-2])
        memory_total = memory_amount * 1024 * 1024 if memory_unit == 'MB' else memory_amount * 1024 * 1024 * 1024
        
        time_delta_s = LXDClientConfig.CPU_USAGE_MEASUREMENT_INTERVAL
        
        state1 = await asyncio.to_thread(
            self.lxd_manager.get_container_state,
            instance_identifier
        )
        await asyncio.sleep(time_delta_s)
        state2 = await asyncio.to_thread(
            self.lxd_manager.get_container_state,
            instance_identifier
        )
        
        # since cpu usage is nanoseconds, 

        delta_cpu_usage_ns = state2.cpu.usage - state1.cpu.usage
        
        total_available_cpu_time_ns = time_delta_s * cpu_cores * 1000000000
        
        cpu_ratio = delta_cpu_usage_ns / total_available_cpu_time_ns
        
        # clip the cpu usage to 100%
        cpu_usage_percent = min(cpu_ratio * 100, 100)

        return BaseInstanceState(
            cpu=CPUUsage(
                usage=cpu_usage_percent,
                cores=cpu_cores
            ),
            memory=MemoryUsage(
                usage=state1.memory.usage,
                total=memory_total
            ),
            disk=state2.disk,
            network=state2.network
        )
    
    @_resolve_instance()
    async def set_instance_password(self, instance_identifier: models.Instance, password: str) -> bool:
        return await asyncio.to_thread(
            self.lxd_manager.set_root_password,
            instance_identifier,
            password
        )
    
    @_resolve_instance()
    async def terminal_websocket_session(self, instance_identifier: models.Instance, client_ws: WebSocket):
        try:
            await client_ws.accept()
            
            ws_response = self.lxd_manager.get_interactive_terminal_websocket(instance_identifier)

            session: LXDWebSocketSession = await self.lxd_ws_manager.create_session(
                client_ws=client_ws,
                instance_name=instance_identifier.name,
                lxd_ws_url=ws_response.ws,
                lxd_control_url=ws_response.control
            )

            async with session:
                await session.run()
        except Exception as e:
            raise LXDClientException(f"Error in websocket_session: {str(e)}")
        finally:
            await self.lxd_ws_manager.remove_session(instance_identifier.name)
    
    @_resolve_instance()
    async def console_websocket_session(self, instance_identifier: models.Instance, client_ws: WebSocket):
        try:
            await client_ws.accept()
            
            ws_response = self.lxd_manager.get_interactive_console_websocket(instance_identifier)

            session: LXDWebSocketSession = await self.lxd_ws_manager.create_session(
                client_ws=client_ws,
                instance_name=instance_identifier.name,
                lxd_ws_url=ws_response.ws,
                lxd_control_url=ws_response.control
            )

            async with session:
                await session.run()
        except Exception as e:
            raise LXDClientException(f"Error in console_websocket_session: {str(e)}")
        finally:
            await self.lxd_ws_manager.remove_session(instance_identifier.name)
    
    @_resolve_instance()
    async def get_instance_console_buffer(self, instance_identifier: models.Instance) -> str:
        return await asyncio.to_thread(
            self.lxd_manager.get_console_buffer,
            instance_identifier
        )

    def create_lxd_cluster_join_token(self, server_name: str) -> str:
        return self.lxd_manager.create_cluster_join_token(server_name)
      
    def add_member_to_lxd_cluster_group(self, server_name: str) -> bool:
        return self.lxd_manager.add_member_to_cluster_group(server_name)
      
    def get_lxd_cluster_member_state(self, server_name: str) -> ClusterMemberState:
        return self.lxd_manager.get_cluster_member_state(server_name)
      
    def get_lxd_cluster_members(self) -> List[models.ClusterMember]:
        return self.lxd_manager.get_all_cluster_members()

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
        return (f"{os_image_name}/{os_image_version}").lower()
    
    def __get_image_server_url(self, os_image_name: str) -> str:
        if os_image_name == "ubuntu":
            return "https://cloud-images.ubuntu.com/releases"
        return "https://images.lxd.canonical.com/"