# CloudBoi Testing Guide

This document provides information on how to set up and run tests for the CloudBoi project, both locally and using Docker. We recommend running tests in Docker for the most consistent experience across environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Running Tests with Docker](#running-tests-with-docker) (Recommended)
- [Local Test Setup](#local-test-setup)
- [Running Tests Locally](#running-tests-locally)
- [Test Types](#test-types)
  - [E2E Tests](#e2e-tests)
- [Architecture](#architecture)
  - [Proxy Setup](#proxy-setup)
- [Writing Tests](#writing-tests)
  - [E2E Tests with Playwright](#e2e-tests-with-playwright)
  - [Using Markers](#using-markers)
- [E2E Testing Architecture](#e2e-testing-architecture)
  - [Overview](#overview)
  - [Directory Structure](#directory-structure)
  - [Writing Page Objects](#writing-page-objects)
  - [Writing Scenarios](#writing-scenarios)
  - [URL Resolution with base_url](#url-resolution-with-base_url)
- [CI/CD Integration](#cicd-integration)

## Prerequisites

### Docker Testing (Recommended)
- Docker
- Docker Compose

### Local Testing
- Python 3.12+
- Make

## Running Tests with Docker

From the project root, you can use Docker to run tests without setting up a local environment. This is the recommended approach for the most consistent experience.

### Docker Integration
The testing setup follows the same pattern as other services in the project:
- The `Dockerfile` uses Make commands for setup and running tests
- `docker-compose.yaml` is consistent with other services' configurations
- Environment variable `DOCKER=true` identifies when running in Docker context

### Build and Run Tests
```
# First, make sure you're in the project root directory (not in the test directory)
make test-build    # Build the test container
make test-e2e      # Run all E2E tests in the container
```

### Other Docker Test Commands
```
# Run these from the project root directory
make test-e2e-report               # Generate HTML test report
make test-file FILE=e2e/scenarios/test_example.py    # Run a specific test file
make test-marked MARKER=smoke      # Run tests with a specific marker
```

## Local Test Setup

For development purposes, you can also run tests locally:

1. Navigate to the test directory:
   ```
   cd test
   ```

2. Setup the virtual environment and install dependencies:
   ```
   make setup
   ```
   
   This will:
   - Create a virtual environment
   - Install required Python packages
   - Install Playwright browsers and dependencies

## Running Tests Locally

From the `test` directory, you can run tests using:

### Run all E2E tests:
```
make test-e2e
```

### Generate HTML report:
```
make test-e2e-report
```
The report will be available at `test/reports/e2e-report.html`.

### Run a specific test file:
```
make test-file FILE=e2e/scenarios/test_example.py
```

### Run tests with a specific marker:
```
make test-marked MARKER=smoke
```

### Additional E2E test options:

Run tests with visible browser:
```
make test-e2e-headed
```

Run tests in slow motion (useful for debugging):
```
make test-e2e-slow
```

## Test Types

### E2E Tests
End-to-end tests use Playwright to automate browser testing. These tests interact with the application as a user would.

Located in the `test/e2e` directory.

## Architecture

### Proxy Setup

The testing environment uses an Nginx proxy to unify the frontend and backend services under a single domain, which solves cross-domain cookie issues:

- In Docker, tests communicate with the application through the proxy service at:
  - Frontend: `http://proxy/`
  - Backend API: `http://proxy/api/`

- These URLs are configured in `docker/test/docker-compose.yaml` with environment variables:
  ```yaml
  environment:
    - FRONTEND_URL=${FRONTEND_URL:-http://proxy}
    - BACKEND_URL=${BACKEND_URL:-http://proxy/api}
  ```

- The proxy setup ensures that cookies set by the backend (with `SameSite=strict`) are properly shared with frontend requests, as they appear to come from the same origin.

When running tests locally against a local development environment, you can override these URLs:
```bash
pytest --frontend-url=http://localhost --backend-url=http://localhost/api
```

## Writing Tests

### E2E Tests with Playwright

Tests use the Pytest framework with Playwright. Here's a basic example:

```python
def test_example(page: Page):
    # Navigate to the page
    page.goto("http://localhost:3000")
    
    # Interact with elements
    page.get_by_role("button", name="Click me").click()
    
    # Assert results
    expect(page.get_by_text("Success")).to_be_visible()
```

### Using Markers

You can add markers to categorize tests:

```python
import pytest

@pytest.mark.smoke
def test_smoke_example(page: Page):
    # Test code here
```

Then run only smoke tests with:
```
make test-marked MARKER=smoke
```

## E2E Testing Architecture

### Overview

The E2E testing architecture follows the Page Object Model (POM) pattern with enhancements to make tests more maintainable and reusable. The key components are:

1. **Page Objects** - Represent pages in the application and provide methods for interacting with them
2. **Data Models** - Provide type-safe and validated test data with consistent structure
3. **Scenarios** - High-level test cases that use page objects to test user flows
4. **Global Fixtures** - Provide common test data and setup/teardown operations via conftest.py

### Directory Structure

```
test/
├── Dockerfile           # Docker configuration for tests
├── Makefile             # Make commands for test operations
├── README.md            # This documentation
├── requirements.in      # Core dependencies
├── requirements.txt     # Generated dependencies with versions
└── e2e/                 # End-to-end tests directory
    ├── pages/           # Page objects
    │   ├── base_class.py   # Base page class
    │   ├── landing_page.py  # Landing page used as a template for other pages
    │   ├── auth/           # Authentication pages
    │   ├── instance/       # Instance management pages
    │   ├── admin/          # Admin pages
    │   └── user/           # User profile pages
    ├── data/            # Data models for test fixtures
    │   ├── models.py       # Data classes for structured test data
    │   └── __init__.py
    ├── scenarios/       # Test scenarios
    │   └── test_*.py       # Test scenario files
    ├── conftest.py      # Global fixtures and test configuration
    └── __init__.py
```

### Writing Page Objects

Page objects should follow these guidelines:

1. **Atomic Actions** - Each method should perform a single, focused action
2. **Clear Naming** - Method names should clearly describe what they do
3. **Assertions** - Assertion methods should be prefixed with `expect_`
4. **Locators** - Define locators as instance variables in the constructor
5. **Workflows** - Provide convenience methods for common workflows

Example:

```python
class LoginPage(BasePage):
    path = "/login"
    
    def __init__(self, page, path=None):
        super().__init__(page, path)
        self.email_field = self.page.get_by_label("Email")
        self.password_field = self.page.get_by_label("Password")
        self.login_button = self.page.get_by_role("button", name="Login")
    
    # Atomic actions
    def fill_email(self, email):
        self.email_field.fill(email)
    
    def fill_password(self, password):
        self.password_field.fill(password)
    
    def click_login_button(self):
        self.login_button.click()
    
    # Assertions
    def expect_login_error(self, expected_message=None):
        error = self.page.get_by_role("alert")
        expect(error).to_be_visible()
        if expected_message:
            expect(error).to_contain_text(expected_message)
    
    # Workflow
    def login(self, email, password):
        self.navigate()
        self.fill_email(email)
        self.fill_password(password)
        self.click_login_button()
```

### Writing Scenarios

Scenarios should be high-level and focus on the user flow, not the implementation details:

1. **Use Page Objects Directly** - Create and use page objects directly, calling navigate() when needed
2. **Use Global Fixtures** - Leverage fixtures from conftest.py for common test data and setup
3. **Type Annotations** - Use type hints for clear interfaces and IDE support
4. **Clear Assertions** - Each test should have clear assertions about the expected outcome

Example:

```python
class TestUserAuth:
    def test_user_registration(self, page: Page, test_user: UserData) -> None:
        # Register a new user
        register_page = RegisterPage(page)
        register_page.navigate()
        register_page.register(
            username=test_user.username,
            email=test_user.email, 
            password=test_user.password
        )
        
        # Verify registration was successful
        register_page.expect_successful_redirect()
        
        # Continue with login
        login_page = LoginPage(page)
        login_page.navigate()
        # ...
```

### URL Resolution with base_url

The project uses Playwright's `base_url` feature to simplify URL management:

1. The `base_url` is configured in the browser context (in conftest.py)
2. All page navigation uses relative paths (e.g., `/login` instead of `http://localhost:3000/login`)
3. This lets you easily run tests against different environments by changing only the base_url

Benefits:
- Simpler URL management - no need to construct full URLs in tests
- Easy to switch between environments (local, staging, etc.)
- Improved test readability with shorter, clearer URLs

The `BasePage` class handles navigation by using these relative paths:

```python
def navigate(self) -> None:
    """Navigate to this page only if not already on it."""
    if not self.is_current():
        self.page.goto(self.path)  # Uses base_url automatically
```

### Global Fixtures in conftest.py

The project provides global fixtures in `conftest.py` that are available to all tests:

```python
# Basic test configuration
def playwright():
    """Returns a Playwright instance for the test session"""

def browser(playwright):
    """Returns a browser instance for the test session"""
    
def browser_context_args(frontend_url):
    """Configure browser context with base_url and other settings"""
    
def page(browser, browser_context_args):
    """Returns a fresh page for each test using the configured browser context"""

# Data fixtures
def test_user():
    """Returns a UserData model with random valid test data"""
    
def test_instance():
    """Returns an InstanceData model with random valid test data"""
```

These fixtures greatly simplify your tests by handling common setup steps. By using pytest's fixture system, you get automatic teardown for resources like browser sessions, and you can compose fixtures together to create more complex test scenarios.

## CI/CD Integration

The test container is designed to work in CI/CD pipelines. The test commands exit with appropriate status codes to indicate test success or failure.

---

For more information, refer to:
- [Playwright Documentation](https://playwright.dev/python/docs/intro)
- [Pytest Documentation](https://docs.pytest.org/)