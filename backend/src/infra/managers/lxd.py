from pylxd import Client, exceptions, models
from typing import Dict, List, Optional, Tuple
import base64, json

from ...core.commons.exception import create_exception_class
from ..config import LXDConfig
from ...core.utils.decorator import create_decorator
from ...core.utils.logging import logger
from ...core.models.instance import LxdInstanceState, WebsocketUrls
from ...core.models.lxd_cluster import ClusterMemberState, SysInfo, StoragePoolState, StoragePoolUsage

LXDManagerException = create_exception_class("LXDManager")

def _ensure_connected_func(self: "LXDManager", args, kwargs, *_, **__):
    if not self._is_connected or not self.client:
        # Auto-connect if not connected
        self.connect()
        if not self._is_connected:
            raise LXDManagerException("LXDManager not connected")
    
    return args, kwargs

_ensure_connected = create_decorator(_ensure_connected_func)

class LXDManager:
    _instance: Optional["LXDManager"] = None

    def __init__(self):
        self.client: Optional[Client] = None
        self._is_connected = False
    
    @classmethod
    def initialize(cls) -> "LXDManager":
        if not cls._instance:
            cls._instance = cls()
            cls._instance.connect()
        return cls._instance
    
    def connect(self) -> bool:
        try:
            self.client = Client(
                endpoint=f"https://{LXDConfig.LXD_HOST}",
                cert=LXDConfig.LXD_CERT,
                verify=LXDConfig.LXD_VERIFY,
            )
            if not self.client.trusted:
                self.authenticate(LXDConfig.LXD_TRUST_PASSWORD)
            self._is_connected = self.check_connection()
            return True
        except exceptions.ClientConnectionFailed as e:
            self._is_connected = False
            raise LXDManagerException(f"LXD connection failed: {str(e)}")
    
    def check_connection(self) -> bool:
        try:
            if not self.client:
                raise LXDManagerException("LXDManager not connected")
            self.client.api.get()
            return True
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to check LXD connection: {str(e)}")
    
    def authenticate(self, password: str) -> bool:
        try:
            self.client.authenticate(password)
            return self.client.trusted
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to authenticate: {str(e)}")
    
    @_ensure_connected()
    def get_all_containers(self) -> List[models.Instance]:
        try:
            return self.client.instances.all()
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to get containers: {str(e)}")
    
    @_ensure_connected()
    def get_container_by_name(self, name: str) -> models.Instance:
        try:
            container = self.client.instances.get(name)
            if not container:
                raise LXDManagerException(f"Container '{name}' not found")
            return container
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to get container {name}: {str(e)}")
    
    @_ensure_connected()
    def create_container(self, instance_create_config: dict) -> models.Instance:
        try:
            container = self.client.instances.create(
                config=instance_create_config,
                wait=True,
                target=f"@{self.get_cluster_group_name()}"
            )
            if not (container and isinstance(container, models.Instance)):
                raise LXDManagerException("Failed to create container")
            self.start_container(container)
            return container
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to create container: {str(e)}")
    
    @_ensure_connected()
    def start_container(self, container: models.Instance) -> bool:
        try:
            if container.status == "Running":
                return True
                
            container.start(wait=True)
            return True
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to start container '{container.name}': {str(e)}")
    
    @_ensure_connected()
    def stop_container(self, container: models.Instance, force: bool = False) -> bool:
        try:
            if container.status == "Stopped":
                return True
            container.stop(wait=True, force=force)
            return True
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to stop container '{container.name}': {str(e)}")
    
    @_ensure_connected()
    def delete_container(self, container: models.Instance) -> bool:
        try:
            if container.status == "Running":
                self.stop_container(container, force=True)
            container.delete(wait=True)
            return True
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to delete container '{container.name}': {str(e)}")

    @_ensure_connected()
    def execute_command(
        self, 
        container: models.Instance, 
        command: List[str], 
        stdin_data: List[str] = None,
        check_success: bool = True
    ) -> Tuple[int, str, str]:
        try:
            # If container is not running, start it
            if container.status != "Running":
                self.start_container(container)

            # If we have stdin data, join with newlines and encode
            stdin_payload = None
            if stdin_data:
                stdin_payload = bytearray("\n".join(stdin_data) + "\n", 'utf-8')

            # Execute command
            exit_code, stdout, stderr = container.execute(
                command,
                stdin_payload=stdin_payload,
                encoding='utf-8'
            )
            
            # Check if command succeeded
            if check_success and exit_code != 0:
                raise RuntimeError(
                    f"Command failed with exit code {exit_code}.\n"
                    f"stdout: {stdout}\n"
                    f"stderr: {stderr}"
                )
                
            return exit_code, stdout, stderr
            
        except (exceptions.LXDAPIException, RuntimeError) as e:
            raise LXDManagerException(f"Failed to execute command: {str(e)}")
    
    @_ensure_connected()
    def get_interactive_terminal_websocket(
        self,
        container: models.Instance
    ) -> WebsocketUrls:
        try:
            if container.status != "Running":
                self.start_container(container)
            
            shell_options = ["bash", "/bin/bash"]
            for command in shell_options:
                res = container.raw_interactive_execute(
                    commands=[command],
                    environment={
                        "TERM": "xterm-256color",
                        "HOME": "/root"
                    }
                )
                
                if "ws" in res and "control" in res:
                    ws_url = f"wss://{LXDConfig.LXD_HOST}{res['ws']}"
                    control_url = f"wss://{LXDConfig.LXD_HOST}{res['control']}"

                    return WebsocketUrls(ws=ws_url, control=control_url)
            
            raise LXDManagerException("Failed to obtain interactive WebSocket URL")
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to setup websocket execution: {str(e)}")
    
    @_ensure_connected()
    def get_interactive_console_websocket(
        self,
        container: models.Instance
    ) -> WebsocketUrls:
        # Reference: https://github.com/canonical/lxd-ui/blob/main/src/pages/instances/InstanceTextConsole.tsx#L88
        try:
            if container.status != "Running":
                self.start_container(container)
            
            # Request a console from the LXD API
            response = self.client.api.instances[container.name].console.post(
                json={
                    "wait-for-websocket": True,
                    "type": "console"
                }
            )
            
            response_data = response.json()
            operation_url = response_data["operation"].split("?")[0]
            secret_0 = response_data["metadata"]["metadata"]["fds"]["0"]
            secret_control = response_data["metadata"]["metadata"]["fds"]["control"]
            
            # Construct WebSocket URLs
            base_url = f"wss://{LXDConfig.LXD_HOST}{operation_url}"
            ws_url = f"{base_url}/websocket?secret={secret_0}"
            control_url = f"{base_url}/websocket?secret={secret_control}"
            
            return WebsocketUrls(ws=ws_url, control=control_url)
            
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to setup console websocket: {str(e)}")
    
    @_ensure_connected()
    def get_console_buffer(self, container: models.Instance) -> str:
        try:
            response = self.client.api.instances[container.name].console.get()
            # The response is a requests.Response object
            # Use .text property (not method) to get the decoded content
            return response.text
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to get console buffer: {str(e)}")
    
    @_ensure_connected()
    def set_root_password(self, container: models.Instance, password: str) -> bool:
        try:
            # Execute passwd command with password inputs
            exit_code, stdout, stderr = self.execute_command(
                container,
                ["passwd", "root"],
                stdin_data=[password, password],  # Enter password twice
                check_success=True
            )
            
            # Check output for success indicators
            success_indicators = [
                "updated",
                "successfully",
                "changed",
            ]
            
            output = (stdout + stderr).lower()
            success = any(indicator in output for indicator in success_indicators)
            
            if not success or exit_code != 0:
                raise RuntimeError(
                    "Command did not succeed.\n"
                    f"stdout: {stdout}\n"
                    f"stderr: {stderr}"
                )
                
            return True
            
        except (exceptions.LXDAPIException, RuntimeError) as e:
            raise LXDManagerException(f"Failed to set root password: {str(e)}")
        
    @_ensure_connected()
    def get_container_state(self, instance: models.Instance) -> LxdInstanceState:
        try:
            # .state() will call the API to get the state of the container  
            return LxdInstanceState.model_validate(instance.state())
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to get container state for '{instance}': {str(e)}")
        except Exception as e: # Catch potential Pydantic validation errors
             raise LXDManagerException(f"Failed to parse container state for '{instance}': {str(e)}")
        
    @_ensure_connected()
    def get_all_cluster_members(self) -> List[models.ClusterMember]:
        try:
            return self.client.cluster.members.all()
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to get cluster members: {str(e)}")
    
    @_ensure_connected()
    def get_cluster_member_state(self, member_name: str) -> ClusterMemberState:
        try:
            # The API for cluster member state is not directly exposed in pylxd models
            # We need to access it through the raw API
            response = self.client.api.cluster.members[member_name].state.get()
            if not response.json():
                raise LXDManagerException(f"Failed to get state for member '{member_name}'")
            
            state_data = response.json()["metadata"]
            
            # Create SysInfo model
            sysinfo = SysInfo(
                buffered_ram=state_data["sysinfo"]["buffered_ram"],
                free_ram=state_data["sysinfo"]["free_ram"],
                free_swap=state_data["sysinfo"]["free_swap"],
                load_averages=state_data["sysinfo"]["load_averages"],
                logical_cpus=state_data["sysinfo"]["logical_cpus"],
                processes=state_data["sysinfo"]["processes"],
                shared_ram=state_data["sysinfo"]["shared_ram"],
                total_ram=state_data["sysinfo"]["total_ram"],
                total_swap=state_data["sysinfo"]["total_swap"],
                uptime=state_data["sysinfo"]["uptime"]
            )
            
            # Create StoragePoolState models
            storage_pools: Dict[str, StoragePoolState] = {}
            for pool_name, pool_data in state_data["storage_pools"].items():
                storage_pools[pool_name] = StoragePoolState(
                    inodes=StoragePoolUsage(
                        total=pool_data["inodes"]["total"],
                        used=pool_data["inodes"]["used"]
                    ),
                    space=StoragePoolUsage(
                        total=pool_data["space"]["total"],
                        used=pool_data["space"]["used"]
                    )
                )
            
            # Return the complete model
            return ClusterMemberState(
                server_name=member_name,
                storage_pools=storage_pools,
                sysinfo=sysinfo
            )
            
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to get state for member '{member_name}': {str(e)}")
    
    @_ensure_connected()
    def get_cluster_group_name(self) -> str:
        try:
            for member in self.get_all_cluster_members():
                if "main" not in member.server_name and member.status == "Online":
                    return next((group for group in member.groups if "resource" in group), None)
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to get cluster group name: {str(e)}")
    
    @_ensure_connected()
    def create_cluster_join_token(self, server_name: str) -> str:
        try:
            server = {
                "server_name": server_name
            }
            token_request = self.client.api.cluster.members.post(
                json=server
            ).json()
            

            # Response from calling the API consist of raw data that needed to be turn into base64
            # Response structure: https://documentation.ubuntu.com/lxd/en/latest/api/#/cluster/cluster_members_post
            # Join token structure: https://github.com/canonical/lxd/blob/main/shared/api/cluster.go#L108
            response = token_request['metadata']['metadata']
            

            join_token_object = {
                "server_name": response["serverName"],
                "fingerprint": response["fingerprint"],
                "addresses": response["addresses"],
                "secret": response["secret"],
                "expires_at": response["expiresAt"],
            }
            
            join_token_json = json.dumps(join_token_object, separators=(',', ':'))
            join_token_base64 = base64.b64encode(join_token_json.encode()) 
            
            return join_token_base64.decode()
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to create cluster join token: {str(e)}")
    
    @_ensure_connected()
    def add_member_to_cluster_group(self, server_name: str, group: str = "cloudboi-resource") -> bool:
        try:
            # Check if server exists
            all_members = self.get_all_cluster_members()
            
            if not any(member.server_name == server_name for member in all_members):
                raise LXDManagerException(f"Server '{server_name}' not found in cluster members")
          
            # Get current group configuration
            current_group_request = self.client.api.cluster.groups[group].get()
            current_group = current_group_request.json()['metadata']
            
            updated_group = {
              "description": current_group["description"],
              "servers": list(set(current_group["members"] + [server_name]))
            }
            
            # Can only update the entire config of the group
            # https://documentation.ubuntu.com/lxd/en/latest/api/#/cluster-groups/cluster_group_patch
            
            updated_group_request = self.client.api.cluster.groups[group].put(
                json=updated_group
            )
            
            return updated_group_request.json()['status_code'] == 200
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to add member '{server_name}' to cluster group: {str(e)}")