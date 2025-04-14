from playwright.sync_api import Page, expect

from ...data.models import RegisterData

from ..base_class import BasePage

class RegisterPage(BasePage):
    path: str = "/register"
    
    def __init__(self, page: Page):
        super().__init__(page, self.path)

        self.email_input = self.page.get_by_test_id("register-email-input-field")
        self.username_input = self.page.get_by_test_id("register-username-input-field")
        self.password_input = self.page.get_by_test_id("register-password-input-field")
        self.register_button = self.page.get_by_test_id("register-button")

    def fill_form(self, register_data: RegisterData):
        self.email_input.fill(register_data.email)
        self.username_input.fill(register_data.username)
        self.password_input.fill(register_data.password)
    
    def click_register(self):
        self.register_button.click()
        
    def should_show_email_error(self):
        email_error = self.page.get_by_test_id("register-email-input-field-error")
        expect(email_error).to_be_visible()
        
    def should_show_username_error(self):
        username_error = self.page.get_by_test_id("register-username-input-field-error")
        expect(username_error).to_be_visible()
    
    def should_show_password_error(self):
        password_error = self.page.get_by_test_id("register-password-input-field-error")
        expect(password_error).to_be_visible()

    def should_navigate_to_login_page(self):
        expect(self.page).to_have_url(f"{self.base_url}/login")
        