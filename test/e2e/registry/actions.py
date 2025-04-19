"""
Registry for managing test actions and lifecycle.
"""
import pytest
import functools
import inspect
from typing import Dict, Any, List, Protocol, Callable, TypeVar, cast, Set, Tuple, Optional
from playwright.sync_api import Page

from ..api.client import ApiClient

# Define Protocol for action functions
class BeforeActionFn(Protocol):
    def __call__(self, page: Page, backend_url: str, request: pytest.FixtureRequest, api_client: ApiClient, **kwargs: Any) -> Any:
        ...

class AfterActionFn(Protocol):
    def __call__(self, page: Page, backend_url: str, request: pytest.FixtureRequest, api_client: ApiClient, **kwargs: Any) -> None:
        ...

# Alias for test data returned from actions
TestData = List[Any]

# Define type variables for decorator
F = TypeVar('F', bound=Callable[..., Any])

class TestActionRegistry:
    """
    Registry to store before/after actions for tests.
    This allows for a more flexible way to configure test setup/teardown.
    """
    def __init__(self) -> None:
        self.before_actions: List[BeforeActionFn] = []
        self.after_actions: List[AfterActionFn] = []
        
    def register_before(self, action_fn: BeforeActionFn) -> BeforeActionFn:
        """Register a function to run before each test"""
        self.before_actions.append(action_fn)
        return action_fn  # Return for use as decorator
        
    def register_after(self, action_fn: AfterActionFn) -> AfterActionFn:
        """Register a function to run after each test"""
        self.after_actions.append(action_fn)
        return action_fn  # Return for use as decorator
    
    def action(self, is_before: bool = True) -> Callable[[F], F]:
        """
        Flexible decorator for registering actions with specific parameters.
        Will automatically extract only the parameters that the decorated function needs.
        
        Usage:
            @action_registry.action()  # Default is before action
            def my_action(page: Page, api_client: ApiClient):
                # Only gets page and api_client, other parameters are ignored
                
            @action_registry.action(is_before=False)  # Register as after action
            def my_cleanup(backend_url: str):
                # Only gets backend_url
        """
        def decorator(fn: F) -> F:
            # Get parameter names from the function signature
            sig = inspect.signature(fn)
            param_names = set(sig.parameters.keys())
            
            @functools.wraps(fn)
            def wrapper(**kwargs: Any) -> Any:
                # Extract only the parameters needed by the function
                filtered_kwargs = {k: v for k, v in kwargs.items() if k in param_names}
                return fn(**filtered_kwargs)
            
            # Add to the appropriate list
            if is_before:
                self.before_actions.append(cast(BeforeActionFn, wrapper))
            else:
                self.after_actions.append(cast(AfterActionFn, wrapper))
                
            return cast(F, fn)  # Return original function for use as decorator
        
        return decorator
    
    def before(self) -> Callable[[F], F]:
        """Shorthand for action(is_before=True)"""
        return self.action(is_before=True)
    
    def after(self) -> Callable[[F], F]:
        """Shorthand for action(is_before=False)"""
        return self.action(is_before=False)
        
    def run_before_actions(self, **kwargs: Any) -> TestData:
        """Run all registered before actions"""
        results: TestData = []
        for action in self.before_actions:
            try:
                result = action(**kwargs)
                results.append(result)
            except Exception as e:
                print(f"Error in before action {action.__name__}: {str(e)}")
        return results
        
    def run_after_actions(self, **kwargs: Any) -> None:
        """Run all registered after actions"""
        for action in reversed(self.after_actions):
            try:
                action(**kwargs)
            except Exception as e:
                print(f"Error in after action {action.__name__}: {str(e)}") 