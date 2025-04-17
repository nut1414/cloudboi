import pytest
from typing import Dict, Any
from playwright.sync_api import Page, expect, Browser

from ..pages.auth import RegisterPage, LoginPage
from ..pages.instance import InstanceListPage
from ..data.models import RegisterData, UserData, LoginData


class TestAuthorization:
    def test_valid_register_login_logout(self, page: Page, test_user: UserData, browser: Browser) -> None:
        # Start with registration
        register_page = RegisterPage(page)
        register_page.navigate()
        register_page.fill_form(RegisterData(
            email=test_user.email,
            username=test_user.username,
            password=test_user.password
        ))
        register_page.click_register()
        register_page.should_navigate_to_login_page()
        
        # Login with the registered user
        login_page = LoginPage(page)
        login_page.fill_form(LoginData(
            username=test_user.username,
            password=test_user.password
        ))
        login_page.click_login()
        login_page.should_navigate_to_user_dashboard(test_user.username)
        
        # Check instance page and logout
        instance_list_page = InstanceListPage(page, test_user.username)
        instance_list_page.wait_for_page_load()
        instance_list_page.side_nav.click_user_menu_item("logout")
        register_page.should_navigate_to_login_page()