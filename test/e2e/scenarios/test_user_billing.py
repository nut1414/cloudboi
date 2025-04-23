from datetime import datetime
import pytest
from typing import Dict, Any
from playwright.sync_api import Page, expect, Browser

from ..pages.auth import RegisterPage, LoginPage
from ..pages.user import UserBillingPage
from ..data.models import InstancePlanData, OsTypeData, UserData, UserInstanceData
from ..registry.actions import ActionRegistry, TestData
from ..api.client import ApiClient
from ..data.constant import Currency
from ..utils.datetime_utils import future_date_formatted

@pytest.fixture(scope="module")
def test_instance_plan() -> InstancePlanData:
    return InstancePlanData(
        instance_plan_id=1,
        instance_package_name="nano-1",
        vcpu_amount=1,
        ram_amount=1,
        storage_amount=10,
        cost_hour=0.005
    )

@pytest.fixture(scope="module")
def test_os_type() -> OsTypeData:
    return OsTypeData(
        os_type_id=11,
        os_image_name="Debian",
        os_image_version="bookworm"
    )

@pytest.fixture(scope="module")
def test_user_instance(
    test_instance_plan: InstancePlanData,
    test_os_type: OsTypeData
) -> UserInstanceData:
    return UserInstanceData(
        instance_plan=test_instance_plan,
        os_type=test_os_type,
        hostname="test-hostname",
        lxd_node_name="test-lxd-node-name",
        status="running",
        root_password="Password123!",
        created_at=datetime.now(),
        last_updated_at=datetime.now()
    )

@pytest.fixture(scope="module")
def test_billing_user_data() -> UserData:
    return UserData(
        username="test-user-billing",
        email="test-user-billing@example.com",
        password="Password123!",
        role="user"
    )

# Using before_all and after_all for class-level setup and teardown
@pytest.fixture(scope="module", autouse=True)
def setup_class_actions(action_registry: ActionRegistry, test_user_instance: UserInstanceData, test_billing_user_data: UserData) -> None:
    # This action runs once before all tests in the class
    @action_registry.before_all()
    def create_user_with_minimum_balance(api_client: ApiClient) -> None:
        api_client.register_user(test_billing_user_data)
        api_client.login_user(test_billing_user_data)
        api_client.user_topup(test_billing_user_data.username, round(test_user_instance.instance_plan.cost_hour * 730) + 1)
        api_client.create_instance(test_user_instance)
    
    @action_registry.after_all()
    def delete_instance_once(api_client: ApiClient) -> None:
        api_client.delete_instance(test_user_instance.hostname)

@pytest.mark.usefixtures("test_class_lifecycle")
class TestUserBilling:
    @pytest.mark.user("test_billing_user_data")
    def test_user_should_have_correct_info_after_create_instance(self, page: Page, test_user_instance: UserInstanceData, test_billing_user_data: UserData) -> None:
        monthly_cost_string = f"{round(test_user_instance.instance_plan.cost_hour * 730, 1)} {Currency.SYMBOL}"
        current_balance = f"1.4 {Currency.SYMBOL}"
        
        next_billing_date = future_date_formatted(days_from_now=30)

        user_billing_page = UserBillingPage(page, test_billing_user_data.username)
        user_billing_page.navigate()
        user_billing_page.wait_for_locator(page.get_by_text("Billing").first)

        # Overview menu
        user_billing_page.current_balance_overview_should_be(current_balance)
        user_billing_page.estimated_due_amount_should_be(monthly_cost_string)
        
        # Check next billing date with 2-minute tolerance
        user_billing_page.next_billing_date_should_be(next_billing_date)