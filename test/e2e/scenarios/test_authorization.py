import pytest
from typing import Dict, Any
from playwright.sync_api import Page, expect, Browser

from ..pages.auth import RegisterPage, LoginPage
from ..pages.instance import InstanceListPage
from ..data.models import RegisterData, UserData, LoginData

@pytest.fixture
def invalid_user_data() -> UserData:
    return UserData(
        email="email",
        username="uw",
        password="1234",
        role="user"
    )

@pytest.fixture
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

class TestAuthorization:
    @pytest.mark.skip_auth
    def test_valid_fields_register_login_logout(self, page: Page, test_user_auth: UserData) -> None:
        # Start with registration
        register_page = RegisterPage(page)
        register_page.navigate()
        register_page.fill_form(RegisterData(
            email=test_user_auth.email,
            username=test_user_auth.username,
            password=test_user_auth.password
        ))
        register_page.click_register()
        register_page.toast.should_show_success_toast()
        register_page.should_navigate_to_login_page()
        
        # Login with the registered user
        login_page = LoginPage(page)
        login_page.fill_form(LoginData(
            username=test_user_auth.username,
            password=test_user_auth.password
        ))
        login_page.click_login()
        login_page.toast.should_show_success_toast()
        login_page.should_navigate_to_user_dashboard(test_user_auth.username)
        
        # Check instance page and logout
        instance_list_page = InstanceListPage(page, test_user_auth.username)
        instance_list_page.wait_for_page_load()
        instance_list_page.side_nav.click_user_menu_item("logout")
        instance_list_page.toast.should_show_success_toast()
        register_page.should_navigate_to_login_page()
    
    @pytest.mark.skip_auth
    def test_invalid_field_register(self, page: Page, invalid_user_data: UserData) -> None:
        register_page = RegisterPage(page)
        register_page.navigate()
        register_page.fill_form(RegisterData(
            email=invalid_user_data.email,
            username=invalid_user_data.username,
            password=invalid_user_data.password
        ))
        register_page.click_register()
        register_page.should_show_email_error()
        register_page.should_show_username_error()
        register_page.should_show_password_error()
    
    @pytest.mark.skip_auth
    def test_user_already_exists_register(self, page: Page, test_user_auth: UserData) -> None:
        register_page = RegisterPage(page)
        register_page.navigate()
        register_page.fill_form(RegisterData(
            email=test_user_auth.email,
            username=test_user_auth.username,
            password=test_user_auth.password
        ))
        register_page.click_register()
        register_page.toast.should_show_error_toast()
    
    @pytest.mark.skip_auth
    def test_invalid_login(self, page: Page, invalid_user_data: UserData) -> None:
        login_page = LoginPage(page)
        login_page.navigate()
        login_page.fill_form(LoginData(
            username="UwU",
            password=invalid_user_data.password
        ))
        login_page.click_login()
        login_page.toast.should_show_error_toast()
        