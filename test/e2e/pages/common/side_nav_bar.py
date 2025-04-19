from playwright.sync_api import Page, expect

class SideNavBar:
    def __init__(self, page: Page):
        self.page = page
        
        self.user_menu_button = self.page.get_by_test_id("side-navbar-user-menu-dropdown-button")
        self.side_navbar_items = {
            "instance": self.page.get_by_test_id("side-navbar-item-instance"),
            "billing": self.page.get_by_test_id("side-navbar-item-billing"),
            "support": self.page.get_by_test_id("side-navbar-item-support"),
            "setting": self.page.get_by_test_id("side-navbar-item-setting"),
        }
        self.user_menu_items = {
            "view_profile": self.page.get_by_test_id("side-navbar-user-menu-dropdown-item-link-0"),
            "preferences": self.page.get_by_test_id("side-navbar-user-menu-dropdown-item-link-1"),
            "logout": self.page.get_by_test_id("side-navbar-user-menu-dropdown-item-button-3"),
        }
        
    def click_user_menu_item(self, item_name: str):
        self.user_menu_button.click()
        self.user_menu_items[item_name].click()

        
    def click_side_navbar_item(self, item_name: str):
        self.side_navbar_items[item_name].click()
        
    def should_navigate_to_user_dashboard(self, username: str):
        expect(self.page).to_have_url(f"/user/{username}/instance")