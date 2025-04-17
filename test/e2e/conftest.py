"""
Global pytest fixtures for E2E tests.
This file contains fixtures that are automatically available to all test files.
"""
import pytest
from typing import Dict, Any, Generator, Optional, Callable, List, Union, cast, TypeVar
from playwright.sync_api import sync_playwright, Browser, Page, Playwright, Response, APIResponse
import os
import uuid
import json

from .data.models import UserData, InstanceData, BillingData

# Type variables for complex type annotations
APIRequestCallable = TypeVar('APIRequestCallable', bound=Callable[[Optional[Page], str, Dict[str, Any], str], Optional[APIResponse]])
UserActionCallable = TypeVar('UserActionCallable', bound=Callable[[Optional[Page], Optional[UserData]], Optional[APIResponse]])

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


@pytest.fixture(scope="session")
def api_request() -> APIRequestCallable:
    """
    Fixture that provides a helper function for making API requests.
    Handles common error scenarios and logging.
    """
    def _api_request(page: Optional[Page], url: str, data: Dict[str, Any], action_name: str = "API request") -> Optional[APIResponse]:
        """Make an API request and handle common error scenarios."""
        if page is None:
            return None
            
        try:
            response = page.context.request.post(
                url,
                headers={"Content-Type": "application/json"},
                data=json.dumps(data)
            )
            
            if response.status >= 400:
                print(f"{action_name} warning - Status: {response.status}")
                try:
                    error_details = response.json()
                    print(f"{action_name} details: {error_details}")
                except Exception:
                    print(f"Could not parse error response: {response.text()[:100]}...")
                
                if response.status >= 500:
                    print(f"Server error detected, skipping {action_name}")
                    return None
                elif response.status != 409:  # 409 = User already exists (acceptable for registration)
                    if "login" in action_name.lower() and response.status == 401:
                        raise Exception(f"Authentication failed: Invalid credentials")
                    else:
                        raise Exception(f"{action_name} failed with status {response.status}")
            
            return response
        except json.JSONDecodeError as e:
            print(f"{action_name} response is not valid JSON: {str(e)}")
            return None
        except Exception as e:
            print(f"{action_name} exception: {str(e)}")
            if "502 Bad Gateway" in str(e):
                print(f"502 Bad Gateway detected, skipping {action_name}")
                return None
            raise
            
    return _api_request


@pytest.fixture(scope="session")
def register_user(
    backend_url: str,
    api_request: APIRequestCallable
) -> UserActionCallable:
    """
    Fixture that registers a test user.
    Returns a function that will register the user when called with a page object.
    
    The page parameter is optional - if not provided, registration will be skipped.
    """
    def _register_user(page: Optional[Page] = None, user: Optional[UserData] = None) -> Optional[APIResponse]:
        """Register a test user using the provided page."""
        if page is None:
            return None
            
        register_data = {
            "username": user.username,
            "email": user.email,
            "password": user.password
        }
        return api_request(page, f"{backend_url}/user/register", register_data, "Registration")
            
    return _register_user


@pytest.fixture(scope="session")
def login_user(
    backend_url: str,
    api_request: APIRequestCallable
) -> UserActionCallable:
    """
    Fixture that logs in a test user.
    Returns a function that will log in the user when called with a page object.
    
    The page parameter is optional - if not provided, login will be skipped.
    """
    def _login_user(page: Optional[Page] = None, user: Optional[UserData] = None) -> Optional[APIResponse]:
        """Login a test user using the provided page."""
        if page is None:
            return None
            
        login_data = {
            "username": user.username,
            "password": user.password
        }
        return api_request(page, f"{backend_url}/user/login", login_data, "Login")
            
    return _login_user


@pytest.fixture
def page(
    browser: Browser,
    browser_context_args: Dict[str, Any],
    login_user: UserActionCallable,
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
    
    if not skip_auth:
        try:
            # Login to get auth cookies
            login_response = login_user(page, test_user)
            
            # Report authentication status
            if login_response and login_response.status == 200:
                print("Authentication successful")
            else:
                print("Authentication skipped or failed - continuing with unauthenticated page")
                
        except Exception as e:
            print(f"Auth process exception: {str(e)} - continuing with unauthenticated page")
    
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
        role="user"
    )


@pytest.fixture(scope="session")
def test_user_auth() -> UserData:
    """
    Fixture that provides test user data for authenticated tests.
    Returns a UserData object that supports both dict and dot notation.
    """
    return UserData(
        username="testuser_auth",
        email="testuser_auth@example.com",
        password="Password123!",
        role="user"
    )


@pytest.fixture(scope="session", autouse=True)
def app_startup(
    browser: Browser,
    browser_context_args: Dict[str, Any],
    register_user: UserActionCallable,
    test_user: UserData,
) -> None:
    """
    Startup function that runs once at the beginning of the test session.
    This is automatically executed before any tests run.
    """
    context = browser.new_context(**browser_context_args)
    page = context.new_page()

    try:
        register_user(page, test_user)
    except Exception as e:
        print(f"Error during app startup: {str(e)}")
    finally:
        page.close()
        context.close()
