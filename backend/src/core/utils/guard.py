from fastapi import HTTPException, status
from typing import Any, Tuple
from .decorator import create_decorator
from ..config import APP_ENV

async def check_test_environment(self: Any, args: list, kwargs: dict, 
                                exception_cls=HTTPException, **factory_kwargs) -> Tuple[list, dict]:
    """
    Check if the current user is in test environment.
    """
    if APP_ENV == "test":
        return args, kwargs
    
    raise exception_cls(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Only allowed in test environment",
    )

# Create a decorator that doesn't require parameters
require_test_environment = create_decorator(
    precondition_check=check_test_environment,
    skip_if_check_fails=False
)()  # Note the additional parentheses to invoke the decorator factory