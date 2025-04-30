from datetime import datetime
import pytest
from typing import Dict, Any
from playwright.sync_api import Page, expect, Browser

from ..pages.admin import UserManagePage
from ..data.models import InstancePlanData, OsTypeData, UserData, UserInstanceData, AdminUserDetailData
from ..registry.actions import ActionRegistry, TestData
from ..api.client import ApiClient
from ..data.constant import Currency, TransactionStatus, TransactionType
from ..utils.datetime_utils import now_formatted, future_date_formatted, get_month_short, get_current_month_short

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
def test_user_instance_1(
    test_instance_plan: InstancePlanData,
    test_os_type: OsTypeData
) -> UserInstanceData:
    return UserInstanceData(
        instance_plan=test_instance_plan,
        os_type=test_os_type,
        hostname="test-hostname-user-1",
        lxd_node_name="test-lxd-node-name",
        status="stopped",
        root_password="Password123!",
        created_at=now_formatted(date_only=True),
        last_updated_at=now_formatted(date_only=True)
    )

@pytest.fixture(scope="module")
def test_user_instance_2(
    test_instance_plan: InstancePlanData,
    test_os_type: OsTypeData
) -> UserInstanceData:
    return UserInstanceData(
        instance_plan=test_instance_plan,
        os_type=test_os_type,
        hostname="test-hostname-user-2",
        lxd_node_name="test-lxd-node-name",
        status="running",
        root_password="Password123!",
        created_at=now_formatted(date_only=True),
        last_updated_at=now_formatted(date_only=True)
    )

@pytest.fixture(scope="module")
def test_user_manage_user() -> UserData:
    return UserData(
        username="test-user-manage",
        email="test-user-manage@example.com",
        password="Password123!",
        role="user"
    )

@pytest.fixture(scope="module")
def test_users_detail_data(
    test_user_instance_1: UserInstanceData,
    test_user_instance_2: UserInstanceData,
    test_user_manage_user: UserData,
    test_user: UserData
) -> list[AdminUserDetailData]:
    return [
        AdminUserDetailData(
            username=test_user_manage_user.username,
            email=test_user_manage_user.email,
            number_of_instances=2,
            instances=[test_user_instance_1, test_user_instance_2],
            status_breakdown="1 Running, 1 Stopped",
            role=test_user_manage_user.role
        ),
        AdminUserDetailData(
            username=test_user.username,
            email=test_user.email,
            number_of_instances=0,
            instances=[],
            status_breakdown="None",
            role=test_user.role
        )
    ]

@pytest.fixture(scope="module", autouse=True)
def setup_class_actions(
    action_registry: ActionRegistry,
    test_user_instance_1: UserInstanceData,
    test_user_instance_2: UserInstanceData,
    test_user_manage_user: UserData,
    test_user: UserData
) -> None:
    # Rename locally for clarity
    regular_user = test_user_manage_user
    admin_user = test_user

    @action_registry.before_all()
    def create_user_with_instances(api_client: ApiClient) -> None:
        api_client.register_user(regular_user)
        api_client.login_user(regular_user)
        api_client.user_topup(regular_user.username, 100)
        api_client.create_instance(test_user_instance_1)
        api_client.stop_instance(test_user_instance_1.hostname)
        api_client.create_instance(test_user_instance_2)
    
    @action_registry.after_all()
    def delete_instances(api_client: ApiClient) -> None:
        api_client.login_user(admin_user)
        api_client.delete_instance(test_user_instance_1.hostname)
        api_client.delete_instance(test_user_instance_2.hostname)

@pytest.mark.usefixtures("test_class_lifecycle")
class TestUserManage:
    def test_user_manage_should_have_correct_info(self, page: Page, test_users_detail_data: list[AdminUserDetailData]) -> None:
        user_manage_page = UserManagePage(page)
        user_manage_page.navigate()
        user_manage_page.wait_for_locator(user_manage_page.user_table["table"])

        user_manage_page.table_row_should_have_data(test_users_detail_data[0])
        user_manage_page.table_row_should_have_data(test_users_detail_data[1])

        # Click on user with no instances
        user_manage_page.click_table_row(test_users_detail_data[1].username)
        user_manage_page.should_have_empty_dropdown_row()

        # Click on user with instances
        user_manage_page.click_table_row(test_users_detail_data[0].username)
        user_manage_page.click_instance_card_header(test_users_detail_data[0].instances[0].hostname)
        user_manage_page.instance_card_should_have_data(test_users_detail_data[0].instances[0])
        user_manage_page.click_instance_card_header(test_users_detail_data[0].instances[1].hostname)
        user_manage_page.instance_card_should_have_data(test_users_detail_data[0].instances[1])

    def test_user_manage_navigation_buttons_should_work_correctly(self, page: Page, test_users_detail_data: list[AdminUserDetailData]) -> None:
        user_manage_page = UserManagePage(page)
        user_manage_page.navigate()
        user_manage_page.wait_for_locator(user_manage_page.user_table["table"])

        # View user instances
        user_manage_page.click_view_user_instances_button(test_users_detail_data[0].username)
        user_manage_page.should_go_to_instance_list_page(test_users_detail_data[0].username)
        user_manage_page.navigate()
        user_manage_page.click_view_user_instances_button(test_users_detail_data[1].username)
        user_manage_page.should_go_to_instance_list_page(test_users_detail_data[1].username)
        user_manage_page.navigate()

        # View user instance details
        user_manage_page.click_table_row(test_users_detail_data[0].username)
        user_manage_page.click_instance_card_header(test_users_detail_data[0].instances[0].hostname)
        user_manage_page.click_view_instance_details_button(test_users_detail_data[0].instances[0].hostname)
        user_manage_page.should_go_to_instance_setting_page(test_users_detail_data[0].username, test_users_detail_data[0].instances[0].hostname)
        user_manage_page.navigate()
        user_manage_page.click_table_row(test_users_detail_data[0].username)
        user_manage_page.click_instance_card_header(test_users_detail_data[0].instances[1].hostname)
        user_manage_page.click_view_instance_details_button(test_users_detail_data[0].instances[1].hostname)
        user_manage_page.should_go_to_instance_setting_page(test_users_detail_data[0].username, test_users_detail_data[0].instances[1].hostname)
        user_manage_page.navigate()