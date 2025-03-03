from functools import wraps
from typing import Any, Callable, TypeVar, cast

F = TypeVar("F", bound=Callable[..., Any])

def create_decorator(
    precondition_check: Callable[[Any, list, dict], tuple],
    skip_if_check_fails: bool = False
):
    """Factory for creating decorator factories with common boilerplate
    
    Args:
        precondition_check: Function that runs before the decorated function.
                           Should return (modified_args, modified_kwargs)
        skip_if_check_fails: If True, the original function won't be called if check fails
        
    Returns:
        A decorator factory function
    """
    def decorator_factory(*factory_args, **factory_kwargs):
        def decorator(func: F) -> F:
            @wraps(func)
            def wrapper(self: Any, *args, **kwargs):
                try:
                    new_args, new_kwargs = precondition_check(
                        self, args, kwargs, *factory_args, **factory_kwargs
                    )
                    if skip_if_check_fails and new_args is None and new_kwargs is None:
                        return None
                    return func(self, *new_args, **new_kwargs)
                except Exception as e:
                    if hasattr(e, '_decorator_handled'):
                        raise
                    if 'exception_cls' in factory_kwargs:
                        # Get the class name from self or cls
                        if hasattr(self, '__name__'):  # For classmethods
                            class_name = self.__name__
                        else:  # For instance methods
                            class_name = self.__class__.__name__
                            
                        # Add class name to the error message
                        error_msg = str(e)
                        context_msg = f"[{class_name}] {error_msg}"
                        
                        # Create the exception with the enhanced message
                        exception = factory_kwargs['exception_cls'](context_msg)
                        exception._decorator_handled = True
                        raise exception
                    raise
            return cast(F, wrapper)
        return decorator
    return decorator_factory