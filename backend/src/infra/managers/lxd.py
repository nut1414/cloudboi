from pylxd import Client, exceptions, models
from typing import Dict, List, Optional, Tuple

from ...core.commons.exception import create_exception_class
from ..config import LXDConfig
from ...core.utils.decorator import create_decorator

LXDManagerException = create_exception_class("LXDManager")

def _ensure_connected_func(self, args, kwargs, *_, **__):
    if not self._is_connected or not self.client:
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
    
    @classmethod
    def get_manager(cls) -> "LXDManager":
        if not cls._instance:
            raise LXDManagerException("LXDManager not initialized")
        return cls._instance
    
    def connect(self) -> bool:
        try:
            self.client = Client(
                endpoint=f"https://{LXDConfig.LXD_HOST}",
                cert=LXDConfig.LXD_CERT,
                verify=LXDConfig.LXD_VERIFY,
            )
            self.check_connection()
            self._is_connected = True
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
    
    @_ensure_connected()
    def get_all_containers(self) -> List[models.Instance]:
        try:
            return self.client.instances.all()
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to get containers: {str(e)}")
    
    @_ensure_connected()
    def get_container_by_name(self, name: str):
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
    def get_interactive_websocket(
        self,
        container: models.Instance
    ) -> Dict[str, str]:
        try:
            if container.status != "Running":
                self.start_container(container)
            
            shell_options = ["bash", "/bin/bash"]
            for command in shell_options:
                res = container.raw_interactive_execute(
                    commands=[command],
                    environment={"TERM": "xterm-256color"}
                )
                
                if "ws" in res and "control" in res:
                    ws_url = f"wss://{LXDConfig.LXD_HOST}{res['ws']}"
                    control_url = f"wss://{LXDConfig.LXD_HOST}{res['control']}"

                    return {"ws": ws_url, "control": control_url}
            
            raise LXDManagerException("Failed to obtain interactive WebSocket URL")
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to setup websocket execution: {str(e)}")
    
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
    def get_all_cluster_members(self) -> List[models.ClusterMember]:
        try:
            return self.client.cluster.members.all()
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to get cluster members: {str(e)}")
    
    @_ensure_connected()
    def get_cluster_group_name(self) -> str:
        try:
            for member in self.get_all_cluster_members():
                if "main" not in member.server_name and member.status == "Online":
                    return next((group for group in member.groups if "resource" in group), None)
        except exceptions.LXDAPIException as e:
            raise LXDManagerException(f"Failed to get cluster group name: {str(e)}")