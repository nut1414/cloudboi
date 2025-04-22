from playwright.sync_api import Page, expect

from ..base_class import BasePage
from ..common.side_nav_bar import SideNavBar

class InstanceListPage(BasePage):
    path: str = "/user/{username}/instance"
    
    def __init__(self, page: Page, username: str):
        super().__init__(page, username=username)
        
        self.side_nav = SideNavBar(page)
        self.create_instance_button = page.get_by_test_id("top-navbar-create-instance-button")
    
    def click_create_instance_button(self):
        self.create_instance_button.click()
        
    def should_navigate_to_instance_create_page(self):
        expect(self.page).to_have_url(f"/user/{self.username}/instance/create")
    
    def click_row_view_button(self, hostname: str):
        self.page.get_by_test_id(f"view-instance-button-{hostname}-button").click()
        
    def should_navigate_to_instance_setting_page(self, hostname: str):
        expect(self.page).to_have_url(f"/user/{self.username}/instance/{hostname}")
