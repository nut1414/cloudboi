from playwright.sync_api import Page, expect

from ..base_class import BasePage
from ..common.side_nav_bar import SideNavBar

class InstanceSettingPage(BasePage):
    path: str = "/user/{username}/instance/{instance_name}"
    
    def __init__(self, page: Page, username: str, instance_name: str):
        self.instance_name = instance_name
        super().__init__(page)
        
        self.side_nav = SideNavBar(page)
        self.path = self.path.format(username=username, instance_name=instance_name)
        self.instance_status = {
            "running": page.get_by_test_id("status-badge-Running"),
            "stopped": page.get_by_test_id("status-badge-Stopped"),
        }
        
        self.tab_navigation = {
            "access": page.get_by_test_id("instance-setting-tab-button-AccessMenu"),
            "power": page.get_by_test_id("instance-setting-tab-button-PowersMenu"),
            "networking": page.get_by_test_id("instance-setting-tab-button-NetworkingMenu"),
            "monitor": page.get_by_test_id("instance-setting-tab-button-MonitorMenu"),
            "destroy": page.get_by_test_id("instance-setting-tab-button-DestroyMenu"),
        }
        
        self.access_menu = {
            "terminal": page.get_by_test_id("instance-terminal-container"),
            "console": page.get_by_test_id("instance-console-container"),
            "input_textbox": page.get_by_role("textbox", name="Terminal input"),
            "reset_root_password": page.get_by_test_id("reset-root-password-input-field"),
            "reset_root_password_button": page.get_by_test_id("reset-root-password-button"),
        }
        self.access_menu_tab = {
            "terminal": page.get_by_test_id("instance-access-tab-button-terminal"),
            "console": page.get_by_test_id("instance-access-tab-button-console"),
        }

        self.power_menu = {
            "start": page.get_by_test_id("start-instance-button"),
            "stop": page.get_by_test_id("stop-instance-button"),
            "restart": page.get_by_test_id("restart-instance-button"),
        }

        self.monitor_menu = {
            "cpu_cores": page.get_by_test_id("cpu-cores"),
            "memory_used": page.get_by_test_id("memory-used"),
        }
        
        self.destroy_menu = {
            "destroy_instance": page.get_by_test_id("destroy-instance-button"),
            "destroy_instance_input": page.get_by_test_id("destroy-instance-input-input-field"),
        }
    
    def navigate_to_menu(self, menu: str):
        self.tab_navigation[menu].click()
    
    def click_access_menu_tab(self, tab: str):
        self.access_menu_tab[tab].click()
        
    def input_to_terminal(self, text: str):
        # Add debounce to prevent spamming the input
        self.wait_for_timeout(500)
        self.access_menu["input_textbox"].fill(text)
        self.access_menu["input_textbox"].press("Enter")

    def logout_console(self):
        self.access_menu["input_textbox"].press("ControlOrMeta+d")
    
    def wait_for_terminal_prompt(self):
        expect_prompt = self.access_menu["terminal"].get_by_text(f"root@{self.instance_name}:~#")
        try:
            self.wait_for_locator(expect_prompt, state="visible", timeout=20000)
        except:
            self.access_menu["input_textbox"].press("Enter")
        self.wait_for_timeout(3000) # Wait for websocket connection to stabilize
    
    def wait_for_console_prompt(self):
        # Wait for the console to be visible first
        self.wait_for_locator(self.access_menu["console"], state="visible", timeout=20000)
        
        # Try different potential patterns that could indicate console is ready
        try:
            # Check for login prompt with instance name
            login_prompt = self.access_menu["console"].get_by_text(f"{self.instance_name} login:", exact=False)
            self.wait_for_locator(login_prompt, state="visible", timeout=10000)
        except:
            self.access_menu["input_textbox"].press("Enter")
            self.access_menu["input_textbox"].press("Enter")
        
        self.wait_for_timeout(5000)  # Wait for websocket connection to stabilize
        self.access_menu["input_textbox"].press("ControlOrMeta+u")  # Clear the current line
    
    def should_have_output_access_menu(self, text: str, terminal_type: str):
        expect_output = self.access_menu[terminal_type].get_by_text(text, exact=False)
        expect(expect_output).to_be_visible()
    
    def access_menu_should_not_be_available(self):
        self.navigate_to_menu("access")
        terminal_text = "Terminal unavailable - Instance not running"
        console_text = "Console unavailable - Instance not running"
        expect(self.page.get_by_text(terminal_text)).to_be_visible()
        self.click_access_menu_tab("console")
        expect(self.page.get_by_text(console_text)).to_be_visible()

    def fill_reset_root_password(self, text: str):
        self.access_menu["reset_root_password"].fill(text)
    
    def click_reset_root_password(self):
        self.access_menu["reset_root_password_button"].click()

    def should_disable_reset_root_password(self):
        expect(self.access_menu["reset_root_password_button"]).to_be_disabled()
    
    def click_power_button(self, power_type: str):
        self.power_menu[power_type].click()

    def should_have_instance_status(self, status: str):
        expect(self.instance_status[status]).to_be_visible()

    def should_disable_restart_instance(self):
        expect(self.power_menu["restart"]).to_be_disabled()
    
    def should_have_same_monitoring_data(self, cpu_cores: str, memory_used: str):
        expect(self.monitor_menu["cpu_cores"]).to_contain_text(cpu_cores)
        expect(self.monitor_menu["memory_used"]).to_contain_text(memory_used)
    
    def fill_destroy_instance_input(self, text: str):
        self.destroy_menu["destroy_instance_input"].fill(text)
    
    def click_destroy_instance_button(self):
        self.destroy_menu["destroy_instance"].click()
    
    def should_disable_destroy_instance_button(self):
        expect(self.destroy_menu["destroy_instance"]).to_be_disabled()