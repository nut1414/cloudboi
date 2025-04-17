from typing import Optional, Any, TypeVar, Dict, List, Union
from playwright.sync_api import Page, Locator, expect


class BasePage:
    """
    Base class for all page objects with common functionality.
    All page objects should inherit from this class.
    """
    path: str = ""
    
    def __init__(self, page: Page, path: Optional[str] = None):
        """
        Initialize the page object with a Playwright page instance and optional path override.
        
        Args:
            page: Playwright Page object
            path: Optional path to navigate to (overrides the class path)
        """
        self.page = page
        if path is not None:
            self.path = path
    
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
        """
        self.page.wait_for_load_state("networkidle")