from typing import Dict, Type, Any, Optional, TypeVar, Generic, cast, Callable, Protocol
from playwright.sync_api import Page
import inspect
import sys

from . import BasePage

# Type variable for BasePage subclasses
T = TypeVar('T', bound=BasePage)

# Protocol for page getters with proper return typing
class PageGetterProtocol(Protocol):
    def __call__(self, **kwargs: Any) -> T: ...


class PageNavigator:
    """
    Helper class to navigate between pages and manage page objects.
    This allows scenarios to work with multiple pages more easily.
    
    This implementation uses Python's package system to organize and discover page objects.
    """
    
    def __init__(self, page: Page):
        """
        Initialize the page navigator with a Playwright page.
        
        Args:
            page: Playwright Page object
        """
        self.page = page
        self._page_cache: Dict[str, BasePage] = {}
        self._page_classes: Dict[str, Type[BasePage]] = {}
        
        # Discover page classes
        self._load_page_classes()
    
    def _load_page_classes(self) -> None:
        """
        Load all page classes available in the package structure.
        This allows the PageNavigator to work with new pages without modification.
        """
        # Try different module names since path can vary between environments
        module_names = ['e2e.pages', 'test.e2e.pages']
        current_module = None
        
        for module_name in module_names:
            try:
                current_module = sys.modules[module_name]
                break
            except KeyError:
                continue
        
        if current_module is None:
            # If we can't find the module, manually import it
            import e2e.pages
            current_module = sys.modules['e2e.pages']
        
        # Find all BasePage subclasses in the module
        for name, obj in inspect.getmembers(current_module):
            if (inspect.isclass(obj) and 
                issubclass(obj, BasePage) and 
                obj != BasePage):
                # Store the class with a normalized name for easier lookup
                class_name = name.lower()
                if class_name.endswith('page'):
                    class_name = class_name[:-4]  # Remove 'page' suffix for convenience
                self._page_classes[class_name] = obj
    
    def to(self, page_class: Type[T], **kwargs) -> T:
        """
        Navigate to a specific page and return its page object.
        If already on the page, just returns the page object without navigation.
        
        Args:
            page_class: The page class to navigate to
            **kwargs: Additional arguments to pass to the page class constructor
            
        Returns:
            An instance of the page class
        """
        # Create a cache key based on the class name and kwargs
        cache_key = f"{page_class.__name__}_{str(kwargs)}"
        
        # Check if page object is already in cache
        if cache_key not in self._page_cache:
            # Create new page object
            page_object = page_class(self.page, **kwargs)
            self._page_cache[cache_key] = page_object
        else:
            page_object = self._page_cache[cache_key]
        
        # Navigate to the page if not already there
        page_object.navigate()
        
        return cast(T, page_object)
    
    def get_page(self, page_name: str, **kwargs) -> BasePage:
        """
        Get a page object by its name (without the 'Page' suffix).
        This allows getting pages dynamically without hardcoding them.
        
        Args:
            page_name: Name of the page (lowercase, without 'Page' suffix)
            **kwargs: Additional arguments to pass to the page constructor
            
        Returns:
            The page object
            
        Raises:
            ValueError: If the page is not found
        """
        # Normalize the page name
        page_name = page_name.lower()
        if page_name.endswith('page'):
            page_name = page_name[:-4]
        
        # Check if the page class exists
        if page_name not in self._page_classes:
            available_pages = ", ".join(sorted(self._page_classes.keys()))
            raise ValueError(f"Page '{page_name}' not found. Available pages: {available_pages}")
        
        # Get the page class and create an instance
        page_class = self._page_classes[page_name]
        return self.to(page_class, **kwargs)
    
    def __getattr__(self, name: str) -> Any:
        """
        Magic method to allow accessing pages as attributes.
        
        For example:
        - navigator.login_page() -> returns LoginPage
        - navigator.instance_list_page(username="user1") -> returns InstanceListPage with username="user1"
        
        Args:
            name: The attribute name
            
        Returns:
            A callable that returns the page object
            
        Raises:
            AttributeError: If the attribute is not a page name
        """
        # Check if the attribute is a page getter (ends with _page)
        if name.endswith('_page'):
            page_name = name[:-5]  # Remove '_page' suffix
            
            # Check if the page exists
            normalized_name = page_name.lower()
            if normalized_name not in self._page_classes:
                available_pages = ", ".join(sorted(self._page_classes.keys()))
                raise AttributeError(
                    f"Page '{page_name}' not found. Available pages: {available_pages}"
                )
            
            # Get the actual page class for proper type hinting
            page_class = self._page_classes[normalized_name]
            
            # Return a function that returns the page object with proper type
            def page_getter(**kwargs) -> Any:
                return self.to(page_class, **kwargs)
            
            # The return type will be properly inferred by the IDE
            return page_getter
        
        # If it's not a page getter, raise an AttributeError
        raise AttributeError(f"'{self.__class__.__name__}' object has no attribute '{name}'") 