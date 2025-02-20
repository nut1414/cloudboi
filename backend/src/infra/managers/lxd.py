from pylxd import Client, exceptions, models
from typing import List, Tuple

from ..config import LXDConfig


class LXDContainerException(Exception):
    pass

class LXDManager:
    def __init__(self):
        try:
            self.client = Client(
                endpoint=LXDConfig.LXD_HOST,
                cert=LXDConfig.LXD_CERT,
                verify=LXDConfig.LXD_VERIFY,
            )
        except exceptions.ClientConnectionFailed as e:
            raise LXDContainerException(f"LXD connection failed: {str(e)}")
    
    def get_all_containers(self) -> List[models.Instance]:
        try:
            return self.client.instances.all()
        except exceptions.LXDAPIException as e:
            raise LXDContainerException(f"Failed to get containers: {str(e)}")
    
    def get_container_by_name(self, name: str):
        try:
            container = self.client.instances.get(name)
            if not container:
                raise LXDContainerException(f"Container '{name}' not found")
            return container
        except exceptions.LXDAPIException as e:
            raise LXDContainerException(f"Failed to get container {name}: {str(e)}")
    
    def create_container(self, instance_create_config: dict) -> bool:
        try:
            container = self.client.instances.create(
                config=instance_create_config,
                wait=True,
                target=f"@{self.get_cluster_group_name()}"
            )
            if not (container and isinstance(container, models.Instance)):
                raise LXDContainerException("Failed to create container")
            return True
        except exceptions.LXDAPIException as e:
            raise LXDContainerException(f"Failed to create container: {str(e)}")

    def execute_command(
        self, 
        container: models.Instance, 
        command: List[str], 
        stdin_data: List[str] = None,
        check_success: bool = True
    ) -> Tuple[int, str, str]:
        try:
            # If we have stdin data, join with newlines and encode
            stdin_payload = None
            if stdin_data:
                stdin_payload = '\n'.join(stdin_data + ['']) # Add empty string for final newline
                
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
        try:
            # Execute passwd command with password inputs
            exit_code, stdout, stderr = self.execute_command(
                container,
                ["passwd root"],
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
        try:
            return self.client.cluster.members.all()
        except exceptions.LXDAPIException as e:
            raise LXDContainerException(f"Failed to get cluster members: {str(e)}")
    
    def get_cluster_group_name(self) -> str:
        try:
            for member in self.get_all_cluster_members():
                if "main" not in member.server_name and member.status == "Online":
                    return next((group for group in member.groups if "resource" in group), None)
        except exceptions.LXDAPIException as e:
            raise LXDContainerException(f"Failed to get cluster group name: {str(e)}")