from contextlib import asynccontextmanager
from typing import Callable, Dict, List, Optional, Sequence, Type, TypeVar, Union, AsyncContextManager, AsyncGenerator, Any
from functools import wraps
import inspect
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

PydanticT = TypeVar("PydanticT", bound=BaseModel)

class OperationException(Exception):
    """Custom exception for operation errors with method name context"""
    def __init__(self, method_name: str, original_exception: Exception):
        self.method_name = method_name
        self.original_exception = original_exception
        super().__init__(f"Error in {method_name}: {str(original_exception)}")


def operation_exception_handler(func):
    """Decorator to wrap methods with exception handling"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            # Exclude OperationException to avoid double-wrapping
            if isinstance(e, OperationException):
                raise
            raise OperationException(func.__name__, e)
    return wrapper


class BaseOperationMeta(type):
    """Metaclass to automatically apply exception handling to all async methods"""
    def __new__(mcs: Type[type], name: str, bases: tuple[type, ...], namespace: Dict[str, Any]) -> type:
        # Create the class
        cls = super().__new__(mcs, name, bases, namespace)
        
        # Only apply to subclasses of BaseOperation, not BaseOperation itself
        if name != 'BaseOperation':
            # Get all methods defined in the class
            for attr_name, attr_value in namespace.items():
                # Check if it's an async method (not inherited) and not a special method
                if (inspect.iscoroutinefunction(attr_value) and 
                    not attr_name.startswith('__') and 
                    attr_name != 'session'):
                    # Replace the method with the wrapped version
                    setattr(cls, attr_name, operation_exception_handler(attr_value))
        
        return cls


class BaseOperation(metaclass=BaseOperationMeta):
    """
    Base class for database operations with automatic exception handling.
    
    All async methods in subclasses will automatically be wrapped with
    exception handling that includes the method name in the error details.
    """
    def __init__(self, db_session: Callable[[], AsyncContextManager[AsyncSession]]):
        self.db_session = db_session
    
    @asynccontextmanager
    async def session(self) -> AsyncGenerator[AsyncSession, None]:
        """Get a database session with automatic commit/rollback"""
        async with self.db_session() as session:
            yield session
    
    def to_pydantic(self, pydantic_model: Type[PydanticT], orm_objects: Union[Sequence, object, None]) -> Union[List[PydanticT], Optional[PydanticT]]:
        if orm_objects is None:
            return None
        
        # Convert SQLAlchemy model to dict if needed
        if hasattr(orm_objects, '__table__'):  # Check if it's a SQLAlchemy model
            orm_objects = {c.name: getattr(orm_objects, c.name) for c in orm_objects.__table__.columns}
            
        if isinstance(orm_objects, Sequence) and not isinstance(orm_objects, (str, bytes)):
            return [pydantic_model.model_validate(obj) for obj in orm_objects]
        else:
            return pydantic_model.model_validate(orm_objects)