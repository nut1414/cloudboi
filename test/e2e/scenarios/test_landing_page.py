import pytest
from typing import Dict, Any
from playwright.sync_api import Page, expect

from ..pages.landing_page import LandingPage


class TestLandingPage:
    """
    Test scenarios for the landing page.
    
    These tests verify the content and functionality of the main landing page.
    """
    
    @pytest.mark.skip_auth
    def test_landing_page_elements(self, page: Page) -> None:
        """
        Test that all the main elements of the landing page are visible.
        
        This test checks that:
        1. The hero section is visible
        2. The features section is visible
        3. The CTA section is visible
        4. There are exactly 3 feature cards
        """
        # Create and navigate to the landing page
        landing_page = LandingPage(page)
        landing_page.navigate()
        
        # Check that all sections are visible
        landing_page.expect_hero_section_visible()
        landing_page.expect_features_section_visible()
        landing_page.expect_cta_section_visible()
        
        # Check that there are 3 feature cards
        landing_page.expect_feature_count(3)
    
    @pytest.mark.skip_auth
    def test_join_waitlist_navigation(self, page: Page) -> None:
        """
        Test that clicking the 'Join the waitlist' button navigates to the registration page.
        
        This test checks that:
        1. Clicking the join waitlist button navigates to the registration page
        """
        # Create and navigate to the landing page
        landing_page = LandingPage(page)
        landing_page.navigate()
        landing_page.wait_for_page_load()
        
        # Click the join waitlist button
        landing_page.click_join_waitlist()
        
        # Check that we are redirected to the registration page
        expect(page).to_have_url("/register")
    
    @pytest.mark.skip_auth
    def test_learn_more_navigation(self, page: Page) -> None:
        """
        Test that clicking the 'Learn more' button navigates to the about page.
        
        This test checks that:
        1. Clicking the learn more button navigates to the about page
        """
        # Create and navigate to the landing page
        landing_page = LandingPage(page)
        landing_page.navigate()
        
        # Click the learn more button
        landing_page.click_learn_more()
        
        # Check that we are redirected to the about page
        expect(page).to_have_url("/about")
    
    @pytest.mark.skip_auth
    def test_landing_page_workflow(self, page: Page) -> None:
        """
        Test a common workflow starting from the landing page.
        
        This test shows how to use the workflow methods in the page object
        and combine multiple pages into a scenario.
        """
        # Create and navigate to the landing page
        landing_page = LandingPage(page)
        landing_page.navigate()
        
        # Verify the landing page content
        landing_page.expect_hero_section_visible()
        landing_page.expect_features_section_visible()
        
        # Use the workflow method to navigate to registration
        landing_page.navigate_to_registration()
        
        # Verify that we are on the registration page
        expect(page).to_have_url("/register") 