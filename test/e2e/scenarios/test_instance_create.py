from datetime import datetime
import pytest
from typing import Dict, Any
from playwright.sync_api import Page, expect, Browser

from ..pages.auth import RegisterPage, LoginPage
from ..pages.instance import InstanceListPage, InstanceCreatePage
from ..data.models import InstancePlanData, OsTypeData, UserInstanceData
from ..registry.actions import TestActionRegistry, TestData
from ..api.client import ApiClient

@pytest.fixture
def test_instance_plan() -> InstancePlanData:
    return InstancePlanData(
        instance_plan_id=1,
        instance_package_name="nano-1",
        vcpu_amount=1,
        ram_amount=1,
        storage_amount=10,
        cost_hour=0.005
    )

@pytest.fixture
def test_os_type() -> OsTypeData:
    return OsTypeData(
        os_type_id=11,
        os_image_name="Debian",
        os_image_version="bookworm"
    )

@pytest.fixture
def test_user_instance(
    test_instance_plan: InstancePlanData,
    test_os_type: OsTypeData
) -> UserInstanceData:
    return UserInstanceData(
        instance_plan=test_instance_plan,
        os_type=test_os_type,
        hostname="test_hostname",
        lxd_node_name="test_lxd_node_name",
        status="running",
        root_password="Password123!",
        created_at=datetime.now(),
        last_updated_at=datetime.now()
    )

# Standard actions for all tests in this module
@pytest.fixture(scope="module", autouse=True)
def setup_standard_actions(action_registry: TestActionRegistry, test_user_instance: UserInstanceData) -> None:
    """
    Register standard instance actions for all tests in this module.
    The autouse=True ensures this runs automatically.
    """
    @action_registry.after()
    def cleanup_instance(page: Page, backend_url: str, api_client: ApiClient) -> None:
        """Cleanup the instance after each test"""
        api_client.delete_instance(test_user_instance.hostname)

class TestInstanceCreate:
    def test_create_instance(self, page: Page, test_lifecycle: TestData, test_user_instance: UserInstanceData) -> None:
        instance_list_page = InstanceListPage(page)
        instance_list_page.navigate()
        instance_list_page.click_create_instance()
        instance_list_page.should_navigate_to_instance_create_page()

        instance_create_page = InstanceCreatePage(page)
        instance_create_page.choose_os_image(test_user_instance.os_type.os_image_name)
        instance_create_page.choose_instance_plan(test_user_instance.instance_plan.instance_package_name)
        instance_create_page.set_root_password(test_user_instance.root_password)
        instance_create_page.set_hostname(test_user_instance.hostname)
        instance_create_page.click_create_instance_button()
        instance_create_page.toast.should_show_success_toast()
        instance_create_page.should_navigate_to_instance_dashboard()