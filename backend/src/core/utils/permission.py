from typing import List, Any, Callable, Tuple, Optional, Union
from fastapi import HTTPException, status
from contextlib import contextmanager
from enum import Enum
import uuid
from contextvars import ContextVar

from .dependencies import user_session_ctx
from .decorator import create_decorator
from ..constants.user_const import UserRole


# Context variable to store worker context state
worker_context_var: ContextVar[bool] = ContextVar("worker_context", default=False)

@contextmanager
def worker_context():
    """
    Context manager to establish a worker context for permission checks.
    
    Example:
        with worker_context():
            await subscription_service.get_overdue_subscriptions()
    """
    token = worker_context_var.set(True)
    try:
        yield
    finally:
        worker_context_var.reset(token)


def _get_role_value(role):
    """Extract string value from role whether it's an enum or string"""
    return role.value if isinstance(role, Enum) else role


def _is_role_allowed(role_to_check, allowed_roles):
    """Check if a role is in the allowed roles list"""
    role_value = _get_role_value(role_to_check)
    return any(_get_role_value(role) == role_value for role in allowed_roles)


def _format_role_list(roles):
    """Format a list of roles for error messages"""
    return ", ".join([_get_role_value(role) for role in roles])


async def check_permission(self: Any, args: list, kwargs: dict, allowed_roles: List[Union[str, Enum]], 
                          exception_cls=HTTPException, **factory_kwargs) -> Tuple[list, dict]:
    """
    Check if the current user has permission to access the method based on their role.
    
    Args:
        self: The instance the decorated method is attached to
        args: The arguments passed to the method
        kwargs: The keyword arguments passed to the method
        allowed_roles: List of roles that are allowed to use this method (strings or UserRole enums)
        exception_cls: Exception class to raise if permission check fails
    """
    # Worker context check
    if worker_context_var.get():
        if _is_role_allowed(UserRole.WORKER, allowed_roles):
            return args, kwargs
        else:
            raise exception_cls(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Worker does not have permission. Required roles: {_format_role_list(allowed_roles)}",
            )
    
    # Authentication check
    if user_session_ctx.get() is None:
        raise exception_cls(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Authorization check
    from ..sql.operations import UserOperation
    from ..container import AppContainer
    user_opr: UserOperation = AppContainer.user_opr()
    current_user_role = await user_opr.get_user_role(user_session_ctx.get().username)
    
    if not any(_get_role_value(role) == current_user_role.role_name for role in allowed_roles):
        raise exception_cls(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Insufficient permissions. Required roles: {_format_role_list(allowed_roles)}",
        )
    
    return args, kwargs


async def check_instance_ownership(self: Any, args: list, kwargs: dict, 
                                 instance_id_param: str = 'instance_id', 
                                 instance_name_param: str = 'instance_name',
                                 exception_cls=HTTPException, **factory_kwargs) -> Tuple[list, dict]:
    """
    Check if the current user owns the specified instance or has admin/worker role.
    
    Args:
        self: The instance the decorated method is attached to
        args: The arguments passed to the method
        kwargs: The keyword arguments passed to the method
        instance_id_param: Name of the parameter containing the instance ID
        instance_name_param: Name of the parameter containing the instance name
        exception_cls: Exception class to raise if permission check fails
    """
    # Worker context check - workers bypass ownership check
    if worker_context_var.get():
        return args, kwargs
    
    # Authentication check
    if user_session_ctx.get() is None:
        raise exception_cls(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user role - admin bypass ownership check
    from ..sql.operations import UserOperation
    from ..container import AppContainer
    user_opr: UserOperation = AppContainer.user_opr()
    current_user_role = await user_opr.get_user_role(user_session_ctx.get().username)
    
    if _get_role_value(current_user_role.role_name) == _get_role_value(UserRole.ADMIN):
        return args, kwargs
    
    # Extract instance ID or name from arguments
    instance_id: Optional[uuid.UUID] = kwargs.get(instance_id_param)
    instance_name: Optional[str] = kwargs.get(instance_name_param)
    
    if instance_id is None and instance_name is None:
        raise exception_cls(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Either {instance_id_param} or {instance_name_param} must be provided",
        )
    
    # Check if user owns the instance
    from ..sql.operations import InstanceOperation
    instance_opr: InstanceOperation = AppContainer.instance_opr()
    
    instance = None
    if instance_id is not None:
        instances = await instance_opr.get_user_instances(
            username=user_session_ctx.get().username,
            instance_ids=[instance_id]
        )
        if instances and len(instances) > 0:
            instance = instances[0]
    elif instance_name is not None:
        instances = await instance_opr.get_user_instances(
            username=user_session_ctx.get().username,
            instance_names=[instance_name]
        )
        if instances and len(instances) > 0:
            instance = instances[0]
    
    if instance is None:
        raise exception_cls(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this instance",
        )
    
    return args, kwargs


# Create the permission decorators
require_roles = create_decorator(
    precondition_check=check_permission,
    skip_if_check_fails=False
)

require_instance_ownership = create_decorator(
    precondition_check=check_instance_ownership,
    skip_if_check_fails=False
)

# Example usage:
"""
from ..utils.permission import require_roles, worker_context, require_instance_ownership
from ..constants.user_const import UserRole

class ExampleService:
    # Using string literals (backwards compatible)
    @require_roles(["admin"])
    async def admin_only_method_old(self, param1, param2):
        return "Admin operation completed"
    
    # Using enum values (preferred for maintainability)
    @require_roles([UserRole.ADMIN])
    async def admin_only_method(self, param1, param2):
        return "Admin operation completed"
    
    @require_roles([UserRole.ADMIN, UserRole.USER])
    async def any_user_method(self, param1):
        return "Operation completed"
    
    @require_roles([UserRole.ADMIN, UserRole.WORKER])
    async def worker_method(self):
        return "Worker operation"
        
    # Check instance ownership (admins and workers bypass)
    @require_instance_ownership()
    async def manage_instance(self, instance_id=None, instance_name=None):
        return "Instance operation completed"
"""

