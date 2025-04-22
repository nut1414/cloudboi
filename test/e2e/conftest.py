"""
Global pytest fixtures for E2E tests.
This file contains fixtures that are automatically available to all test files.
"""
import pytest
from typing import Dict, Any, Generator, Optional, List
from playwright.sync_api import sync_playwright, Browser, Page, Playwright, Response, APIResponse
import os
import json

from .data.models import UserData, UserInstanceData
from .api.client import ApiClient
from .registry.actions import ActionRegistry, TestData

def pytest_configure(config: pytest.Config) -> None:
    """Register custom markers."""
    config.addinivalue_line("markers", "skip_auth: Skip authentication for this test")

def pytest_addoption(parser: pytest.Parser) -> None:
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
    parser.addoption(
        "--backend-url",
        action="store",
        default=None,
        help="Override the backend URL for tests",
    )


@pytest.fixture(scope="session")
def browser_type_launch_args(pytestconfig: pytest.Config) -> Dict[str, Any]:
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
def browser_context_args(frontend_url: str) -> Dict[str, Any]:
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
        "base_url": frontend_url,  # Set the base URL for the frontend
        "accept_downloads": True,  # Allow downloads in the browser
    }


@pytest.fixture(scope="session", autouse=True)
def set_frontend_url(pytestconfig: pytest.Config) -> None:
    """
    Set the frontend URL from command line option or environment variable.
    """
    frontend_url = pytestconfig.getoption("--frontend-url")
    if frontend_url:
        os.environ["FRONTEND_URL"] = frontend_url


@pytest.fixture(scope="session", autouse=True)
def set_backend_url(pytestconfig: pytest.Config) -> None:
    """
    Set the backend URL from command line option or environment variable.
    """
    backend_url = pytestconfig.getoption("--backend-url")
    if backend_url:
        os.environ["BACKEND_URL"] = backend_url


@pytest.fixture(scope="session")
def frontend_url() -> str:
    """
    Get the frontend URL from environment variable.
    """
    return os.environ.get("FRONTEND_URL", "http://localhost:80")


@pytest.fixture(scope="session")
def backend_url() -> str:
    """
    Get the backend URL from environment variable.
    """
    return os.environ.get("BACKEND_URL", "http://localhost:80/api")


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
def api_client(page: Page, backend_url: str) -> ApiClient:
    """
    Create an API client for the current page.
    This provides a convenient way to make API calls with consistent error handling.
    """
    return ApiClient(page, backend_url)


@pytest.fixture
def page(
    browser: Browser,
    browser_context_args: Dict[str, Any],
    backend_url: str,
    test_user: UserData,
    request: pytest.FixtureRequest
) -> Generator[Page, None, None]:
    """
    Create a new page for each test with auth cookies already set based on markers.
    
    Markers:
        skip_auth: Skip authentication entirely
    """
    # Check for markers
    skip_auth = request.node.get_closest_marker("skip_auth") is not None
    
    # Create browser context with default args
    context = browser.new_context(**browser_context_args)
    page = context.new_page()
    
    # Create an API client for this page
    api_client = ApiClient(page, backend_url)
    
    if not skip_auth:
        # Login to get auth cookies
        api_client.login_user(test_user)
    
    # Navigate to the frontend page
    page.goto("/")
    
    yield page
    page.close()
    context.close()


@pytest.fixture(scope="session")
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
        role="admin"
    )


@pytest.fixture(scope="session", autouse=True)
def app_startup(
    browser: Browser,
    browser_context_args: Dict[str, Any],
    backend_url: str,
    test_user: UserData,
) -> None:
    """
    Startup function that runs once at the beginning of the test session.
    This is automatically executed before any tests run.
    
    Note: This fixture requires its own ApiClient instance because:
    1. It runs before any tests and before the api_client fixture is available
    2. It has session scope while api_client has function scope (tied to each page)
    3. The api_client fixture depends on the page fixture, which isn't available here
    """
    context = browser.new_context(**browser_context_args)
    page = context.new_page()

    try:
        # Create a dedicated ApiClient instance for startup tasks
        # Cannot use the api_client fixture due to dependency and scope differences
        api_client = ApiClient(page, backend_url)
        api_client.create_admin_user(test_user)
    except Exception as e:
        print(f"Error during app startup: {str(e)}")
    finally:
        page.close()
        context.close()


@pytest.fixture(scope="module")
def action_registry() -> ActionRegistry:
    """
    Fixture that provides the test action registry.
    This can be used to register custom before/after actions.
    Will be be reset for each module/file.
    """
    return ActionRegistry()


@pytest.fixture(scope="function")
def test_lifecycle(action_registry: ActionRegistry, page: Page, backend_url: str, api_client: ApiClient, request: pytest.FixtureRequest) -> Generator[TestData, None, None]:
    # Run before actions
    action_context = {
        "page": page,
        "backend_url": backend_url,
        "request": request,
        "api_client": api_client
    }
    test_data = action_registry.run_before_actions(**action_context)
    page.wait_for_load_state("load", timeout=10000)
    
    # Return the test data (results from before actions)
    yield test_data
    
    # Run after actions - using load state instead of the discouraged networkidle
    page.wait_for_load_state("load", timeout=10000)
    action_registry.run_after_actions(**action_context)


@pytest.fixture(scope="class")
def test_class_lifecycle(browser: Browser, browser_context_args: Dict[str, Any], action_registry: ActionRegistry, backend_url: str, request: pytest.FixtureRequest) -> Generator[TestData, None, None]:
    """
    Fixture that runs before_all actions once at the beginning of a test class 
    and after_all actions once at the end of a test class.
    
    This fixture must be explicitly included in test classes that need class-level setup/teardown.
    """
    context = browser.new_context(**browser_context_args)
    page = context.new_page()
    
    # Create API client
    api_client = ApiClient(page, backend_url)

    # Run before_all actions once at the beginning of the class
    action_context = {
        "page": page,
        "backend_url": backend_url,
        "request": request,
        "api_client": api_client
    }
    test_data = action_registry.run_before_all_actions(**action_context)
    
    # Return the test data (results from before_all actions)
    yield test_data
    
    # Run after_all actions once at the end of the class
    action_registry.run_after_all_actions(**action_context)