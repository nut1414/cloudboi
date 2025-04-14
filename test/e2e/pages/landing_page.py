from typing import Optional, List, Dict, Any
from playwright.sync_api import Page, Locator, expect
from .base_class import BasePage


class LandingPage(BasePage):
    """
    Page object model for the Landing page.
    
    This page object represents the main landing page of the application.
    It provides methods to interact with and assert against elements on the page.
    """
    
    # Define the path for this page - this is the root path
    path: str = "/"
    
    def __init__(self, page: Page, path: Optional[str] = None):
        """
        Initialize the landing page object.
        
        Args:
            page: Playwright Page object
            path: Optional path override
        """
        super().__init__(page, path)
        
        # Define all locators as instance variables using data-testid
        self.hero_section = self.page.get_by_test_id("hero-section")
        self.hero_title = self.page.get_by_test_id("hero-title")
        self.hero_subtitle = self.page.get_by_test_id("hero-subtitle")
        self.join_waitlist_button = self.page.get_by_test_id("hero-primary-button-link")
        self.learn_more_button = self.page.get_by_test_id("hero-secondary-button-link")
        self.features_section = self.page.get_by_test_id("features-section")
        self.feature_cards = self.page.locator('[data-testid^="feature-card-"]')
        self.cta_section = self.page.get_by_test_id("cta-section")
        self.cta_button = self.page.get_by_test_id("cta-button-link")
        self.sign_in_button = self.page.get_by_test_id("public-navbar-sign-in-button")
        
    # ATOMIC ACTIONS - Each method performs a single action
    
    def click_join_waitlist(self) -> None:
        """
        Click the 'Join the waitlist' button.
        """
        self.join_waitlist_button.click()
    
    def click_learn_more(self) -> None:
        """
        Click the 'Learn more' button.
        """
        self.learn_more_button.click()
    
    def click_cta_button(self) -> None:
        """
        Click the CTA button.
        """
        self.cta_button.click()
    
    def click_sign_in_button(self) -> None:
        """
        Click the sign in button.
        """
        self.sign_in_button.click()
    
    # ASSERTIONS - Each method checks one aspect of the page state
    
    def expect_hero_section_visible(self) -> None:
        """
        Assert that the hero section is visible.
        """
        expect(self.hero_title).to_be_visible()
        expect(self.hero_subtitle).to_be_visible()
    
    def expect_features_section_visible(self) -> None:
        """
        Assert that the features section is visible.
        """
        expect(self.features_section).to_be_visible()
        
    def expect_feature_count(self, count: int) -> None:
        """
        Assert that the correct number of feature cards are visible.
        
        Args:
            count: Expected number of feature cards
        """
        expect(self.feature_cards).to_have_count(count)
    
    def expect_cta_section_visible(self) -> None:
        """
        Assert that the CTA section is visible.
        """
        expect(self.cta_section).to_be_visible()
    
    # WORKFLOWS - Combine multiple atomic actions into common workflows
    
    def navigate_to_registration(self) -> None:
        """
        Navigate to the registration page by clicking the 'Join the waitlist' button.
        """
        # The navigate() call is handled by the PageNavigator
        self.click_join_waitlist() 