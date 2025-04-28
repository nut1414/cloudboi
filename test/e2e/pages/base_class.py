from typing import Optional, Any, TypeVar, Dict, List, Union, Callable
from playwright.sync_api import Page, Locator, expect
from .common.toast import Toast


class BasePage:
    """
    Base class for all page objects with common functionality.
    All page objects should inherit from this class.
    """
    path: str = ""
    
    def __init__(self, page: Page, path: Optional[str] = None, username: Optional[str] = None):
        """
        Initialize the page object with a Playwright page instance and optional parameters.
        
        Args:
            page: Playwright Page object
            path: Optional path to navigate to (overrides the class path)
            username: Optional username to format into the path
        """
        self.page = page
        self.toast = Toast(self.page)
        self.username = username
        
        if path is not None:
            self.path = path
            
        # Format username into path if provided and path contains {username} placeholder
        if username is not None and "{username}" in self.path:
            self.path = self.path.format(username=username)
    
    def is_current(self) -> bool:
        """
        Check if the current page is this page.
        
        Returns:
            True if the current page is this page, False otherwise
        """
        current_url = self.page.url
        return current_url.endswith(self.path)

    def navigate(self) -> None:
        """
        Navigate to this page only if not already on it.
        Uses the browser context's base_url automatically.
        
        Returns:
            True if navigation occurred, False if already on the page
        """
        if not self.is_current():
            self.page.goto(self.path)
            return True
        return False
        
    def wait_for_page_load(self) -> None:
        """
        Wait for the page to be fully loaded.
        DEPRECATED: Use more specific waiting methods instead.
        """
        # This method is kept for backward compatibility
        # Use wait_for_locator or wait_for_event instead
        self.page.wait_for_load_state("load")
    
    def wait_for_document_ready(self) -> None:
        """
        Wait for the document to be ready.
        """
        self.page.wait_for_load_state("domcontentloaded")
        
    def wait_for_locator(self, locator: Locator, state: str = "visible", timeout: int = 30000) -> Locator:
        """
        Wait for a locator to be in the specified state.
        
        Args:
            locator: The locator to wait for
            state: The state to wait for (visible, hidden, attached, detached)
            timeout: Maximum time to wait in milliseconds
            
        Returns:
            The locator for chaining
        """
        locator.wait_for(state=state, timeout=timeout)
        return locator
    
    def wait_for_event(self, event: str, predicate: Optional[Callable] = None, timeout: int = 30000) -> Any:
        """
        Wait for a specific event to occur.
        
        Args:
            event: Event name to wait for
            predicate: Optional function to filter events
            timeout: Maximum time to wait in milliseconds
            
        Returns:
            The event data
        """
        with self.page.expect_event(event, predicate=predicate, timeout=timeout) as event_info:
            pass  # The expectation is already set up, no action needed here
        return event_info.value
    
    def wait_for_response(self, url_pattern: str, timeout: int = 30000) -> Any:
        """
        Wait for a network response matching the specified URL pattern.
        
        Args:
            url_pattern: URL pattern to match (supports glob patterns)
            timeout: Maximum time to wait in milliseconds
            
        Returns:
            The response object
        """
        with self.page.expect_response(url_pattern, timeout=timeout) as response_info:
            pass  # The expectation is already set up, no action needed here
        return response_info.value
    
    def wait_for_navigation(self, url_pattern: Optional[str] = None, timeout: int = 30000) -> None:
        """
        Wait for navigation to complete, optionally to a specific URL.
        
        Args:
            url_pattern: Optional URL pattern to wait for
            timeout: Maximum time to wait in milliseconds
        """
        if url_pattern:
            self.page.wait_for_url(url_pattern, timeout=timeout)
        else:
            self.page.wait_for_load_state("load", timeout=timeout)
    
    def wait_for_timeout(self, timeout: int = 10000) -> None:
        """
        Wait for a timeout.
        """
        self.page.wait_for_timeout(timeout)
            
    def wait_for_toast(self, toast_type: str = "success", timeout: int = 10000) -> Locator:
        """
        Wait for a toast notification to appear.
        
        Args:
            toast_type: Type of toast to wait for ("success", "error", "info", or "warning")
            timeout: Maximum time to wait in milliseconds
            
        Returns:
            The toast locator
        """
        toast_map = {
            "success": self.toast.success_toast,
            "error": self.toast.error_toast,
            "info": self.toast.info_toast,
            "warning": self.toast.warning_toast
        }
        
        if toast_type not in toast_map:
            raise ValueError(f"Invalid toast type: {toast_type}. Valid options are: {', '.join(toast_map.keys())}")
            
        try:
            self.wait_for_locator(toast_map[toast_type], state="visible", timeout=timeout)
        except:
            expect(toast_map[toast_type]).to_be_visible()