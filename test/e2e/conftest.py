"""
Global pytest fixtures for E2E tests.
This file contains fixtures that are automatically available to all test files.
"""
import pytest
from typing import Dict, Any, Generator
from playwright.sync_api import sync_playwright, Browser, Page, Playwright
import os
import uuid

from .pages.base_class import BasePage
from .pages.page_navigator import PageNavigator
from .data.models import UserData, InstanceData, BillingData


def pytest_addoption(parser):
    """Add command-line options for the tests."""
    parser.addoption(
        "--headless",
        action="store",
        default="true",
        help="Run browser in headless mode: true or false",
    )
    parser.addoption(
        "--slow-mo",
        action="store",
        default="0",
        help="Slow down execution by specified milliseconds",
    )
    parser.addoption(
        "--frontend-url",
        action="store",
        default=None,
        help="Override the frontend URL for tests",
    )


@pytest.fixture(scope="session")
def browser_type_launch_args(pytestconfig) -> Dict[str, Any]:
    """
    Define browser launch arguments based on command line options.
    This can be used to set browser-specific options.
    """
    headless = pytestconfig.getoption("--headless").lower() == "true"
    slow_mo = int(pytestconfig.getoption("--slow-mo"))
    
    return {
        "headless": headless,
        "slow_mo": slow_mo,
    }


@pytest.fixture(scope="session")
def browser_context_args() -> Dict[str, Any]:
    """
    Define browser context arguments.
    This affects all pages created in this context.
    """
    return {
        "ignore_https_errors": True,  # Ignore HTTPS errors for local development
        "viewport": {
            "width": 1280,
            "height": 720,
        },
        "record_video_dir": None,  # Set to a path to record videos
        "record_har_path": None,  # Set to a path to record HAR files
    }


@pytest.fixture(scope="session", autouse=True)
def set_frontend_url(pytestconfig) -> None:
    """
    Set the frontend URL from command line option or environment variable.
    """
    frontend_url = pytestconfig.getoption("--frontend-url")
    if frontend_url:
        os.environ["FRONTEND_URL"] = frontend_url


@pytest.fixture(scope="session")
def playwright() -> Generator[Playwright, None, None]:
    """
    Create a Playwright instance for the test session.
    """
    with sync_playwright() as playwright:
        yield playwright


@pytest.fixture(scope="session")
def browser(playwright: Playwright, browser_type_launch_args: Dict[str, Any]) -> Generator[Browser, None, None]:
    """
    Create a browser instance for the test session.
    """
    browser = playwright.chromium.launch(**browser_type_launch_args)
    yield browser
    browser.close()


@pytest.fixture
def page(browser: Browser, browser_context_args: Dict[str, Any]) -> Generator[Page, None, None]:
    """
    Create a new page for each test.
    """
    context = browser.new_context(**browser_context_args)
    page = context.new_page()
    
    # In debug mode, explicitly navigate to the base URL to avoid starting with about:blank
    if os.environ.get("PWDEBUG") == "1":
        frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
        page.goto(frontend_url)
    
    yield page
    page.close()
    context.close()


@pytest.fixture(scope="session", autouse=True)
def setup_base_url() -> None:
    """
    Set up the base URL for all page objects at the start of the test session.
    This is run automatically (autouse=True) once per test session.
    """
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    BasePage.set_base_url(frontend_url)
    print(f"\nSetting base URL to: {frontend_url}")


@pytest.fixture
def navigator(page: Page) -> PageNavigator:
    """
    Fixture that provides a PageNavigator instance.
    This makes it easy to navigate between pages in the tests.
    
    Args:
        page: Playwright Page fixture
        
    Returns:
        PageNavigator instance
    """
    return PageNavigator(page)


@pytest.fixture
def test_user() -> UserData:
    """
    Fixture that provides test user data.
    Returns a UserData object that supports both dict and dot notation.
    
    Returns:
        UserData object with valid test data
    """
    return UserData(
        username="testuser",
        email="testuser@example.com",
        password="Password123!",
        role="user"
    )


@pytest.fixture
def test_instance() -> InstanceData:
    """
    Fixture that provides test instance data.
    Returns an InstanceData object that supports both dict and dot notation.
    
    Returns:
        InstanceData object with randomly generated valid test data
    """
    unique_id = str(uuid.uuid4())[:8]
    return InstanceData(
        name=f"test-instance-{unique_id}",
        plan="Basic Plan",
        description=f"Test instance created by automated test ({unique_id})"
    )


@pytest.fixture
def test_billing() -> BillingData:
    """
    Fixture that provides test billing data.
    Returns a BillingData object that supports both dict and dot notation.
    
    Returns:
        BillingData object with valid test card data
    """
    return BillingData(
        card_number="4111111111111111",  # Test Visa card
        expiry_month=12,
        expiry_year=2030,
        cvv="123",
        name_on_card="Test User",
        billing_address="123 Test St, Test City, Test Country"
    )


# @pytest.fixture
# def authenticated_user(navigator: PageNavigator, test_user: UserData) -> UserData:
#     """
#     Fixture that creates and logs in a user.
#     Can be used by tests that require an authenticated user.
    
#     Args:
#         navigator: PageNavigator fixture
#         test_user: Test user data
        
#     Returns:
#         The UserData of the created and authenticated user
#     """
#     # Register a new user
#     register_page = navigator.register_page()
#     register_page.register(
#         username=test_user.username,
#         email=test_user.email,
#         password=test_user.password
#     )
#     register_page.expect_successful_redirect()
    
#     # Login with the newly registered user
#     login_page = navigator.login_page()
#     login_page.login(
#         email=test_user.email,
#         password=test_user.password
#     )
#     login_page.expect_successful_redirect(test_user.username)
    
#     return test_user 