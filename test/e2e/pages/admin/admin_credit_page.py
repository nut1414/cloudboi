from playwright.sync_api import Page, expect

from ..base_class import BasePage
from ..common.side_nav_bar import SideNavBar

class AdminCreditPage(BasePage):
    path: str = "/admin/credits"

    def __init__(self, page: Page):
        super().__init__(page)

        self.side_nav = SideNavBar(page)
        self.user_search_dropdown = {
            "dropdown_button": page.get_by_test_id("admin-credits-dropdown-button"),
            "dropdown_search": page.get_by_test_id("admin-credits-dropdown-search"),
            "get_option": lambda username: page.get_by_test_id(f"admin-credits-dropdown-option-{username}"),
        }
        self.add_credit_button = page.get_by_test_id("admin-add-credit-button")
        self.credit_input_field = page.get_by_test_id("admin-credits-input-field")
        self.get_credit_option = lambda amount: page.get_by_test_id(f"admin-credit-option-{amount}-option-button")

    def click_user_search_dropdown(self):
        self.user_search_dropdown["dropdown_button"].click()
    
    def fill_user_search_dropdown(self, username: str):
        self.user_search_dropdown["dropdown_search"].fill(username)
    
    def select_user_from_dropdown(self, username: str):
        self.user_search_dropdown["get_option"](username).click()
    
    def click_credit_option(self, amount: str):
        self.get_credit_option(amount).click()
    
    def fill_credit_input_field(self, amount: str):
        self.credit_input_field.fill(amount)
    
    def click_add_credit_button(self):
        self.add_credit_button.click()
    
    def credit_input_field_should_have_value(self, amount: str):
        expect(self.credit_input_field).to_have_value(amount)
    
    def add_credit_button_should_be_disabled(self):
        expect(self.add_credit_button).to_be_disabled()
    