from datetime import datetime
import pytest
from typing import Dict, Any
from playwright.sync_api import Page, expect, Browser

from ..pages.admin import AdminCreditPage
from ..data.models import UserData
from ..registry.actions import ActionRegistry, TestData
from ..api.client import ApiClient

@pytest.fixture(scope="module")
def test_admin_credit_user() -> UserData:
    return UserData(
        username="test-admin-credit",
        email="test-admin-credit@example.com",
        password="Password123!",
        role="user"
    )

@pytest.fixture(scope="module", autouse=True)
def setup_class_actions(
    action_registry: ActionRegistry,
    test_user: UserData,
    test_admin_credit_user: UserData,
) -> None:
    @action_registry.before_all()
    def create_user(api_client: ApiClient) -> None:
        api_client.register_user(test_admin_credit_user)

@pytest.mark.usefixtures("test_class_lifecycle")
class TestAdminCredit:
    def test_admin_credit_top_up_should_work_correctly(self, page: Page, test_admin_credit_user: UserData) -> None:
        admin_credit_page = AdminCreditPage(page)
        admin_credit_page.navigate()
        admin_credit_page.wait_for_locator(page.get_by_text("Credit").first)

        admin_credit_page.add_credit_button_should_be_disabled()
        admin_credit_page.click_user_search_dropdown()
        admin_credit_page.fill_user_search_dropdown(test_admin_credit_user.username)
        admin_credit_page.select_user_from_dropdown(test_admin_credit_user.username)
        
        admin_credit_page.add_credit_button_should_be_disabled()
        admin_credit_page.click_credit_option("100")
        admin_credit_page.credit_input_field_should_have_value("100")
        admin_credit_page.fill_credit_input_field("123")
        admin_credit_page.credit_input_field_should_have_value("123")
        admin_credit_page.click_add_credit_button()
        admin_credit_page.wait_for_toast("success")
