from datetime import datetime
import pytest
from typing import Dict, Any
from playwright.sync_api import Page, expect, Browser

from ..pages.admin import AdminInstancePlanPage
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

@pytest.fixture(scope="module")
def test_new_instance_plan() -> InstancePlanData:
    return InstancePlanData(
        instance_package_name="test-instance-plan",
        vcpu_amount=1,
        ram_amount=1,
        storage_amount=10,
        cost_hour=0.005
    )

@pytest.fixture(scope="module")
def test_edited_instance_plan() -> InstancePlanData:
    return InstancePlanData(
        instance_package_name="test-instance-plan-edited",
        vcpu_amount=2,
        ram_amount=2,
        storage_amount=20,
        cost_hour=0.01
    )


# Using before_all and after_all for class-level setup and teardown
@pytest.fixture(scope="module", autouse=True)
def setup_class_actions(action_registry: ActionRegistry, test_user_instance: UserInstanceData, test_user: UserData) -> None:
    # This action runs once before all tests in the class
    @action_registry.before_all()
    def create_instance_with_instance_plan(api_client: ApiClient) -> None:
        api_client.login_user(test_user)
        api_client.create_instance(test_user_instance)
    
    @action_registry.after_all()
    def delete_instance_once(api_client: ApiClient) -> None:
        api_client.delete_instance(test_user_instance.hostname)

@pytest.mark.usefixtures("test_class_lifecycle")
class TestAdminInstancePlan:
    def test_admin_should_be_able_to_create_instance_plan(self, page: Page, test_new_instance_plan: InstancePlanData) -> None:
        admin_instance_plan_page = AdminInstancePlanPage(page)
        admin_instance_plan_page.navigate()
        admin_instance_plan_page.wait_for_locator(admin_instance_plan_page.table)

        admin_instance_plan_page.click_create_instance_plan_button()
        admin_instance_plan_page.fill_create_modal(test_new_instance_plan)
        admin_instance_plan_page.click_confirm_modal_button("create")

        admin_instance_plan_page.wait_for_toast("success")
        admin_instance_plan_page.table_row_should_have_info(test_new_instance_plan)
    
    def test_admin_should_get_error_when_creating_instance_plan_with_existing_name(self, page: Page, test_new_instance_plan: InstancePlanData) -> None:
        admin_instance_plan_page = AdminInstancePlanPage(page)
        admin_instance_plan_page.navigate()

        admin_instance_plan_page.click_create_instance_plan_button()
        admin_instance_plan_page.fill_create_modal(test_new_instance_plan)
        admin_instance_plan_page.click_confirm_modal_button("create")

        admin_instance_plan_page.wait_for_toast("error")
    
    def test_used_instance_plan_should_not_be_editable(self, page: Page, test_user_instance: UserInstanceData) -> None:
        admin_instance_plan_page = AdminInstancePlanPage(page)
        admin_instance_plan_page.navigate()

        admin_instance_plan_page.table_button_should_not_be_visible("edit", test_user_instance.instance_plan.instance_package_name)
        admin_instance_plan_page.table_button_should_not_be_visible("delete", test_user_instance.instance_plan.instance_package_name)
        admin_instance_plan_page.click_table_button("view", test_user_instance.instance_plan.instance_package_name)
        admin_instance_plan_page.modal_should_have_info(test_user_instance.instance_plan)
        admin_instance_plan_page.modal_all_fields_should_be_disabled()
    
    def test_admin_should_be_able_to_edit_instance_plan(self, page: Page, test_new_instance_plan: InstancePlanData, test_edited_instance_plan: InstancePlanData) -> None:
        admin_instance_plan_page = AdminInstancePlanPage(page)
        admin_instance_plan_page.navigate()

        admin_instance_plan_page.click_table_button("edit", test_new_instance_plan.instance_package_name)
        admin_instance_plan_page.fill_edit_modal(test_edited_instance_plan)
        admin_instance_plan_page.click_confirm_modal_button("update")

        admin_instance_plan_page.wait_for_toast("success")
        admin_instance_plan_page.table_row_should_have_info(test_edited_instance_plan)
    
    def test_admin_should_get_error_when_editing_instance_plan_with_existing_name(self, page: Page, test_new_instance_plan: InstancePlanData, test_edited_instance_plan: InstancePlanData) -> None:
        admin_instance_plan_page = AdminInstancePlanPage(page)
        admin_instance_plan_page.navigate()

        admin_instance_plan_page.click_table_button("edit", test_new_instance_plan.instance_package_name)
        admin_instance_plan_page.fill_edit_modal(test_edited_instance_plan)
        admin_instance_plan_page.click_confirm_modal_button("update")

        admin_instance_plan_page.wait_for_toast("error")
    
    def test_admin_should_be_able_to_delete_instance_plan(self, page: Page, test_edited_instance_plan: InstancePlanData) -> None:
        admin_instance_plan_page = AdminInstancePlanPage(page)
        admin_instance_plan_page.navigate()

        admin_instance_plan_page.click_table_button("delete", test_edited_instance_plan.instance_package_name)
        admin_instance_plan_page.click_confirm_modal_button("delete")

        admin_instance_plan_page.wait_for_toast("success")
        admin_instance_plan_page.table_row_should_not_have_info(test_edited_instance_plan)