from playwright.sync_api import Page, expect

from ...data.models import LoginData

from ..base_class import BasePage

class LoginPage(BasePage):
    path: str = "/login"
    
    def __init__(self, page: Page):
        super().__init__(page, self.path)

        self.username_input = self.page.get_by_test_id("login-username-input-field")
        self.password_input = self.page.get_by_test_id("login-password-input-field")
        self.login_button = self.page.get_by_test_id("login-button")

    def fill_form(self, login_data: LoginData):
        self.username_input.fill(login_data.username)
        self.password_input.fill(login_data.password)
    
    def click_login(self):
        self.login_button.click()
        
    def should_show_username_error(self):
        username_error = self.page.get_by_test_id("login-username-input-field-error")
        expect(username_error).to_be_visible()
    
    def should_show_password_error(self):
        password_error = self.page.get_by_test_id("login-password-input-field-error")
        expect(password_error).to_be_visible()
    
    def should_navigate_to_user_dashboard(self, username: str):
        expect(self.page).to_have_url(f"{self.base_url}/user/{username}/instance")
    
    def should_navigate_to_admin_dashboard(self):
        expect(self.page).to_have_url(f"{self.base_url}/admin")
        
        
        
        