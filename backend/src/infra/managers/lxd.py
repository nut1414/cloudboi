import logging
from pylxd import Client, exceptions, models
from typing import List, Optional, Tuple

from ..config import LXDConfig

logger = logging.getLogger(__name__)

class LXDContainerException(Exception):
    pass

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
            raise LXDContainerException("LXDManager not initialized")
        return cls._instance
    
    def connect(self) -> bool:
        try:
            self.client = Client(
                endpoint=LXDConfig.LXD_HOST,
                cert=LXDConfig.LXD_CERT,
                verify=LXDConfig.LXD_VERIFY,
            )
            self.check_connection()
            self._is_connected = True
            logger.info("Successfully connected to LXD server")
            return True
        except exceptions.ClientConnectionFailed as e:
            self._is_connected = False
            logger.error(f"Failed to connect to LXD server: {str(e)}")
            raise LXDContainerException(f"LXD connection failed: {str(e)}")
    
    def check_connection(self) -> bool:
        try:
            if not self.client:
                raise LXDContainerException("LXDManager not connected")
            self.client.api.get()
            return True
        except exceptions.LXDAPIException as e:
            raise LXDContainerException(f"Failed to check LXD connection: {str(e)}")
    
    def _ensure_connected(self):
        if not self._is_connected or not self.client:
            raise LXDContainerException("LXDManager not connected")
    
    def get_all_containers(self) -> List[models.Instance]:
        self._ensure_connected()
        try:
            return self.client.instances.all()
        except exceptions.LXDAPIException as e:
            raise LXDContainerException(f"Failed to get containers: {str(e)}")
    
    def get_container_by_name(self, name: str):
        self._ensure_connected()
        try:
            container = self.client.instances.get(name)
            if not container:
                raise LXDContainerException(f"Container '{name}' not found")
            return container
        except exceptions.LXDAPIException as e:
            raise LXDContainerException(f"Failed to get container {name}: {str(e)}")
    
    def create_container(self, instance_create_config: dict) -> models.Instance:
        self._ensure_connected()
        try:
            container = self.client.instances.create(
                config=instance_create_config,
                wait=True,
                target=f"@{self.get_cluster_group_name()}"
            )
            if not (container and isinstance(container, models.Instance)):
                raise LXDContainerException("Failed to create container")
            self.start_container(container)
            logger.info(f"Successfully created container '{container.name}'")
            return container
        except exceptions.LXDAPIException as e:
            raise LXDContainerException(f"Failed to create container: {str(e)}")
    
    def start_container(self, container: models.Instance) -> bool:
        self._ensure_connected()
        try:
            if container.status == "Running":
                logger.info(f"Container '{container.name}' is already running")
                return True
                
            container.start(wait=True)
            logger.info(f"Successfully started container '{container.name}'")
            return True
        except exceptions.LXDAPIException as e:
            raise LXDContainerException(f"Failed to start container '{container.name}': {str(e)}")
    
    def stop_container(self, container: models.Instance, force: bool = False) -> bool:
        self._ensure_connected()
        try:
            if container.status == "Stopped":
                logger.info(f"Container '{container.name}' is already stopped")
                return True
            container.stop(wait=True, force=force)
            logger.info(f"Successfully stopped container '{container.name}'")
            return True
        except exceptions.LXDAPIException as e:
            raise LXDContainerException(f"Failed to stop container '{container.name}': {str(e)}")
    
    def delete_container(self, container: models.Instance) -> bool:
        self._ensure_connected()
        try:
            if container.status == "Running":
                self.stop_container(container, force=True)
            container.delete(wait=True)
            logger.info(f"Successfully deleted container '{container.name}'")
            return True
        except exceptions.LXDAPIException as e:
            raise LXDContainerException(f"Failed to delete container '{container.name}': {str(e)}")

    def execute_command(
        self, 
        container: models.Instance, 
        command: List[str], 
        stdin_data: List[str] = None,
        check_success: bool = True
    ) -> Tuple[int, str, str]:
        self._ensure_connected()
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
            raise LXDContainerException(f"Failed to execute command: {str(e)}")
    
    def set_root_password(self, container: models.Instance, password: str) -> bool:
        self._ensure_connected()
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
            raise LXDContainerException(f"Failed to set root password: {str(e)}")
        
    def get_all_cluster_members(self) -> List[models.ClusterMember]:
        self._ensure_connected()
        try:
            return self.client.cluster.members.all()
        except exceptions.LXDAPIException as e:
            raise LXDContainerException(f"Failed to get cluster members: {str(e)}")
    
    def get_cluster_group_name(self) -> str:
        self._ensure_connected()
        try:
            for member in self.get_all_cluster_members():
                if "main" not in member.server_name and member.status == "Online":
                    return next((group for group in member.groups if "resource" in group), None)
        except exceptions.LXDAPIException as e:
            raise LXDContainerException(f"Failed to get cluster group name: {str(e)}")