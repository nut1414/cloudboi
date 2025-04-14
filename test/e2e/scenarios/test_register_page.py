import pytest
from typing import Dict, Any
from playwright.sync_api import Page, expect

from ..pages.page_navigator import PageNavigator
from ..pages.auth import RegisterPage
from ..data.models import RegisterData, UserData


class TestRegisterPage:
    def test_should_success_when_register_data_is_valid(self, navigator: PageNavigator, test_user: UserData) -> None:
        register_page: RegisterPage = navigator.register_page()
        register_page.fill_form(RegisterData(
            email=test_user.email,
            username=test_user.username,
            password=test_user.password
        ))
        register_page.click_register()
        register_page.should_navigate_to_login_page()