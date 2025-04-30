from datetime import datetime
import pytest
from typing import Dict, Any
from playwright.sync_api import Page, expect, Browser

from ..pages.auth import RegisterPage, LoginPage
from ..pages.instance import InstanceListPage, InstanceCreatePage
from ..data.models import InstancePlanData, OsTypeData, UserData, UserInstanceData
from ..registry.actions import ActionRegistry, TestData
from ..api.client import ApiClient
from ..utils.datetime_utils import now_formatted

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
        created_at=now_formatted(),
        last_updated_at=now_formatted()
    )

# Standard actions for all tests in this module
@pytest.fixture(scope="module", autouse=True)
def setup_standard_actions(action_registry: ActionRegistry, test_user_instance: UserInstanceData) -> None:
    """
    Register standard instance actions for all tests in this module.
    The autouse=True ensures this runs automatically.
    """
    @action_registry.after()
    def cleanup_instance(api_client: ApiClient) -> None:
        """Cleanup the instance after each test"""
        api_client.delete_instance(test_user_instance.hostname)

class TestInstanceCreate:
    def test_valid_data_create_instance(self, page: Page, test_user_instance: UserInstanceData, test_user: UserData) -> None:
        instance_list_page = InstanceListPage(page, test_user.username)
        instance_list_page.navigate()
        instance_list_page.click_create_instance_button()
        instance_list_page.should_navigate_to_instance_create_page()

        # Create button is disabled until all fields are filled
        instance_create_page = InstanceCreatePage(page, test_user.username)
        instance_create_page.choose_os_image(test_user_instance.os_type.os_image_name.lower())
        instance_create_page.should_disable_create_instance_button() # Check that create button is disabled
        instance_create_page.choose_instance_plan(test_user_instance.instance_plan.instance_package_name.split("-")[0])
        instance_create_page.should_disable_create_instance_button() # Check that create button is disabled
        instance_create_page.set_root_password(test_user_instance.root_password)
        instance_create_page.should_disable_create_instance_button() # Check that create button is disabled
        instance_create_page.set_hostname(test_user_instance.hostname)
        instance_create_page.click_create_instance_button()

        # During the creation, the create button is disabled
        instance_create_page.should_disable_create_instance_button() # Check that create button is disabled
        
        # Wait for success toast to appear
        instance_create_page.wait_for_toast("success", timeout=20000)
        instance_create_page.toast.should_show_success_toast()
        instance_create_page.should_navigate_to_instance_dashboard()
    
    # Including the test_lifecycle fixture ensures registered actions will be executed only for this test
    def test_create_with_existing_hostname(self, page: Page, test_lifecycle: TestData, test_user_instance: UserInstanceData, test_user: UserData) -> None:
        instance_list_page = InstanceListPage(page, test_user.username)
        instance_list_page.navigate()
        instance_list_page.click_create_instance_button()
        instance_list_page.should_navigate_to_instance_create_page()

        # Create button is disabled until all fields are filled
        instance_create_page = InstanceCreatePage(page, test_user.username)
        instance_create_page.choose_os_image(test_user_instance.os_type.os_image_name.lower())
        instance_create_page.should_disable_create_instance_button() # Check that create button is disabled
        instance_create_page.choose_instance_plan(test_user_instance.instance_plan.instance_package_name.split("-")[0])
        instance_create_page.should_disable_create_instance_button() # Check that create button is disabled
        instance_create_page.set_root_password(test_user_instance.root_password)
        instance_create_page.should_disable_create_instance_button() # Check that create button is disabled
        instance_create_page.set_hostname(test_user_instance.hostname)
        instance_create_page.click_create_instance_button()

        # Wait for the error toast
        instance_create_page.wait_for_toast("error")
        instance_create_page.toast.should_show_error_toast()