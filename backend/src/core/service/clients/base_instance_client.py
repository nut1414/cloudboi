from abc import ABC, abstractmethod
from typing import TypeVar, Generic, Any, Optional

InstanceType = TypeVar('InstanceType')

class BaseInstanceClient(ABC, Generic[InstanceType]):
    @classmethod
    def get_client(cls) -> 'BaseInstanceClient':
        return cls()

    @abstractmethod
    def get_instance(
        self, 
        instance_identifier: Any, 
        **kwargs: Any
    ) -> Optional[InstanceType]:
        """Retrieve an instance by name"""
        pass

    @abstractmethod
    def create_instance(
        self, 
        instance_config: Any, 
        **kwargs: Any
    ) -> Any:
        """Create a new instance"""
        pass

    @abstractmethod
    def delete_instance(
        self, 
        instance_identifier: Any, 
        **kwargs: Any
    ) -> bool:
        """Delete an instance"""
        pass

    @abstractmethod
    def start_instance(
        self, 
        instance_identifier: Any, 
        **kwargs: Any
    ) -> bool:
        """Start an instance"""
        pass

    @abstractmethod
    def stop_instance(
        self, 
        instance_identifier: Any, 
        **kwargs: Any
    ) -> bool:
        """Stop an instance"""
        pass

    @abstractmethod
    def set_instance_password(
        self, 
        instance_identifier: Any, 
        password: str, 
        **kwargs: Any
    ) -> bool:
        """Set instance root password"""
        pass