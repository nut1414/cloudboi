from playwright.sync_api import Page, expect

from ..base_class import BasePage
from ..common.side_nav_bar import SideNavBar

class InstanceCreatePage(BasePage):
    path: str = "/user/{username}/instance/create"
    
    def __init__(self, page: Page, username: str):
        super().__init__(page, self.path.format(username=username))

        self.side_nav = SideNavBar(page)
        self.os_image_section = {
            "os_option_button": {
                "ubuntu": page.get_by_test_id("os-image-ubuntu-option-button"),
                "debian": page.get_by_test_id("os-image-debian-option-button"),
                "fedora": page.get_by_test_id("os-image-fedora-option-button"),
            },
            "os_version_dropdown": page.get_by_test_id("os-version-dropdown-dropdown-button"),
            "os_version_dropdown_item": page.get_by_test_id("os-version-dropdown-dropdown-item-button-0"),
        }
        self.instance_plan_section = {
            "compute_option_button": page.get_by_test_id("instance-plan-compute-2-option-button"),
            "memory_option_button": page.get_by_test_id("instance-plan-memory-2-option-button"),
            "micro_option_button": page.get_by_test_id("instance-plan-micro-1-option-button"),
            "nano_option_button": page.get_by_test_id("instance-plan-nano-1-option-button"),
            "performance_option_button": page.get_by_test_id("instance-plan-performance-16-option-button"),
            "standard_option_button": page.get_by_test_id("instance-plan-standard-2-option-button"),
            "storage_option_button": page.get_by_test_id("instance-plan-storage-2-option-button"),
        }
        self.set_auth_section = {
            "password_input": page.get_by_test_id("root-password-input-input-field")
        }
        self.set_hostname_section = {
            "hostname_input": page.get_by_test_id("hostname-input-input-field")
        }
        self.create_instance_button = page.get_by_test_id("instance-create-page-submit-button")

    def choose_os_image(self, os_image: str):
        self.os_image_section["os_option_button"][os_image].click()
        self.os_image_section["os_version_dropdown"].click()
        self.os_image_section["os_version_dropdown_item"].click()
        
    def choose_instance_plan(self, instance_plan: str):
        self.instance_plan_section[f"{instance_plan}_option_button"].click()
        
    def set_root_password(self, password: str):
        self.set_auth_section["password_input"].fill(password)
        
    def set_hostname(self, hostname: str):
        self.set_hostname_section["hostname_input"].fill(hostname)
        
    def click_create_instance_button(self):
        self.create_instance_button.click()
        
    def should_disable_create_instance_button(self):
        expect(self.create_instance_button).to_be_disabled()
    
    def should_navigate_to_instance_dashboard(self):
        expect(self.page).to_have_url(f"/user/{self.username}/instance")