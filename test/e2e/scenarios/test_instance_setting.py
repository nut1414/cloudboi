from datetime import datetime
import pytest
from typing import Dict, Any
from playwright.sync_api import Page, expect, Browser

from ..pages.auth import RegisterPage, LoginPage
from ..pages.instance import InstanceListPage, InstanceSettingPage
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

# Using before_all and after_all for class-level setup and teardown
@pytest.fixture(scope="module", autouse=True)
def setup_class_actions(action_registry: ActionRegistry, test_user_instance: UserInstanceData, test_user: UserData) -> None:
    # This action runs once before all tests in the class
    @action_registry.before_all()
    def create_instance_once(api_client: ApiClient) -> None:
        print("Creating instance once before all tests")
        api_client.login_user(test_user)
        api_client.create_instance(test_user_instance)
    
    # This action runs once after all tests in the class    
    @action_registry.after_all()
    def delete_instance_once(api_client: ApiClient) -> None:
        print("Deleting instance once after all tests")
        api_client.delete_instance(test_user_instance.hostname)

        
@pytest.mark.usefixtures("test_class_lifecycle")  # Add this fixture to use class-level actions
class TestInstanceSetting:
    # def test_access_menu_terminal(self, page: Page, test_user_instance: UserInstanceData, test_user: UserData) -> None:
    #     # We use a function-scoped page for each test, but the instance was created once by before_all
    #     instance_list_page = InstanceListPage(page, test_user.username)
    #     instance_list_page.navigate()
    #     instance_list_page.click_row_view_button(test_user_instance.hostname)
    #     instance_list_page.should_navigate_to_instance_setting_page(test_user_instance.hostname)

    #     instance_setting_page = InstanceSettingPage(page, test_user.username, test_user_instance.hostname)
    #     instance_setting_page.wait_for_terminal_prompt()
    #     instance_setting_page.input_to_terminal("echo $(( (17*19) + (23*3) - (5*6) ))")
    #     instance_setting_page.should_have_output_access_menu("362", "terminal")

    def test_access_menu_console_login_success(self, page: Page, test_user_instance: UserInstanceData, test_user: UserData) -> None:
        instance_list_page = InstanceListPage(page, test_user.username)
        instance_list_page.navigate()
        instance_list_page.click_row_view_button(test_user_instance.hostname)
        instance_list_page.should_navigate_to_instance_setting_page(test_user_instance.hostname)
        
        instance_setting_page = InstanceSettingPage(page, test_user.username, test_user_instance.hostname)
        instance_setting_page.click_access_menu_tab("console")
        instance_setting_page.wait_for_console_prompt()
        instance_setting_page.input_to_terminal("root")
        instance_setting_page.input_to_terminal(test_user_instance.root_password)
        instance_setting_page.should_have_output_access_menu(f"root@{test_user_instance.hostname}:~#", "console")
        instance_setting_page.input_to_terminal("echo $(( (17*19) + (23*3) - (5*6) ))")
        instance_setting_page.should_have_output_access_menu("362", "console")
        instance_setting_page.logout_console()

    # def test_access_menu_console_login_failed(self, page: Page, test_user_instance: UserInstanceData, test_user: UserData) -> None:
    #     instance_list_page = InstanceListPage(page, test_user.username)
    #     instance_list_page.navigate()
    #     instance_list_page.click_row_view_button(test_user_instance.hostname)
    #     instance_list_page.should_navigate_to_instance_setting_page(test_user_instance.hostname)
        
    #     instance_setting_page = InstanceSettingPage(page, test_user.username, test_user_instance.hostname)
    #     instance_setting_page.click_access_menu_tab("console")
    #     instance_setting_page.wait_for_console_prompt()
    #     instance_setting_page.input_to_terminal("root")
    #     instance_setting_page.input_to_terminal("wrong-password")
    #     instance_setting_page.should_have_output_access_menu("Login incorrect", "console")

    def test_access_menu_reset_root_password(self, page: Page, test_user_instance: UserInstanceData, test_user: UserData) -> None:
        instance_list_page = InstanceListPage(page, test_user.username)
        instance_list_page.navigate()
        instance_list_page.click_row_view_button(test_user_instance.hostname)
        instance_list_page.should_navigate_to_instance_setting_page(test_user_instance.hostname)
        
        instance_setting_page = InstanceSettingPage(page, test_user.username, test_user_instance.hostname)
        instance_setting_page.should_disable_reset_root_password()
        instance_setting_page.fill_reset_root_password("123Password!")
        instance_setting_page.click_reset_root_password()
        
        instance_setting_page.click_access_menu_tab("console")
        instance_setting_page.wait_for_console_prompt()
        instance_setting_page.input_to_terminal("root")
        instance_setting_page.input_to_terminal("123Password!")
        instance_setting_page.should_have_output_access_menu(f"root@{test_user_instance.hostname}:~#", "console")
        instance_setting_page.logout_console()

    def test_power_menu_stop_instance(self, page: Page, test_user_instance: UserInstanceData, test_user: UserData, api_client: ApiClient) -> None:
        # Make sure the instance is running
        api_client.start_instance(test_user_instance.hostname)

        instance_list_page = InstanceListPage(page, test_user.username)
        instance_list_page.navigate()
        instance_list_page.click_row_view_button(test_user_instance.hostname)
        instance_list_page.should_navigate_to_instance_setting_page(test_user_instance.hostname)
        
        instance_setting_page = InstanceSettingPage(page, test_user.username, test_user_instance.hostname)
        instance_setting_page.navigate_to_menu("power")
        instance_setting_page.click_power_button("stop")
        instance_setting_page.wait_for_toast("success")
        instance_setting_page.should_have_instance_status("stopped")
        instance_setting_page.should_disable_restart_instance()
        instance_setting_page.access_menu_should_not_be_available()
        
    def test_power_menu_start_instance(self, page: Page, test_user_instance: UserInstanceData, test_user: UserData, api_client: ApiClient) -> None:
        # Make sure the instance is stopped
        api_client.stop_instance(test_user_instance.hostname)
        
        instance_list_page = InstanceListPage(page, test_user.username)
        instance_list_page.navigate()
        instance_list_page.click_row_view_button(test_user_instance.hostname)
        instance_list_page.should_navigate_to_instance_setting_page(test_user_instance.hostname)
        
        instance_setting_page = InstanceSettingPage(page, test_user.username, test_user_instance.hostname)
        instance_setting_page.navigate_to_menu("power")
        instance_setting_page.click_power_button("start")
        instance_setting_page.wait_for_toast("success")
        instance_setting_page.should_have_instance_status("running")
        
    def test_power_menu_restart_instance(self, page: Page, test_user_instance: UserInstanceData, test_user: UserData, api_client: ApiClient) -> None:
        # Make sure the instance is running
        api_client.start_instance(test_user_instance.hostname)
        
        instance_list_page = InstanceListPage(page, test_user.username)
        instance_list_page.navigate()
        instance_list_page.click_row_view_button(test_user_instance.hostname)
        instance_list_page.should_navigate_to_instance_setting_page(test_user_instance.hostname)
        
        instance_setting_page = InstanceSettingPage(page, test_user.username, test_user_instance.hostname)
        instance_setting_page.navigate_to_menu("power")
        instance_setting_page.click_power_button("restart")
        instance_setting_page.wait_for_toast("success")
        instance_setting_page.should_have_instance_status("running")

    def test_monitoring_menu(self, page: Page, test_user_instance: UserInstanceData, test_user: UserData, api_client: ApiClient) -> None:
        # Make sure the instance is running
        api_client.start_instance(test_user_instance.hostname)
        
        instance_list_page = InstanceListPage(page, test_user.username)
        instance_list_page.navigate()
        instance_list_page.click_row_view_button(test_user_instance.hostname)
        instance_list_page.should_navigate_to_instance_setting_page(test_user_instance.hostname)
        
        instance_setting_page = InstanceSettingPage(page, test_user.username, test_user_instance.hostname)
        instance_setting_page.navigate_to_menu("monitor")
        cpu_cores = f"{test_user_instance.instance_plan.vcpu_amount} core"
        ram_amount = f"{test_user_instance.instance_plan.ram_amount} GB"
        instance_setting_page.should_have_same_monitoring_data(cpu_cores, ram_amount)
    
    def test_destroy_menu(self, page: Page, test_user_instance: UserInstanceData, test_user: UserData) -> None:
        instance_list_page = InstanceListPage(page, test_user.username)
        instance_list_page.navigate()
        instance_list_page.click_row_view_button(test_user_instance.hostname)
        instance_list_page.should_navigate_to_instance_setting_page(test_user_instance.hostname)
        
        instance_setting_page = InstanceSettingPage(page, test_user.username, test_user_instance.hostname)
        instance_setting_page.navigate_to_menu("destroy")
        instance_setting_page.should_disable_destroy_instance_button()
        instance_setting_page.fill_destroy_instance_input(test_user_instance.hostname)
        instance_setting_page.click_destroy_instance_button()
        instance_setting_page.wait_for_toast("success")