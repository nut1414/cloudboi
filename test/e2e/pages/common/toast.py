from playwright.sync_api import Page, expect

class Toast:
    def __init__(self, page: Page):
        self.page = page

        self.success_toast = self.page.get_by_test_id("alert-success")
        self.error_toast = self.page.get_by_test_id("alert-error")
        self.info_toast = self.page.get_by_test_id("alert-info")
        self.warning_toast = self.page.get_by_test_id("alert-warning")
        
    def should_show_success_toast(self):
        expect(self.success_toast).to_be_visible()
        
    def should_show_error_toast(self):
        expect(self.error_toast).to_be_visible()
        
    def should_show_info_toast(self):
        expect(self.info_toast).to_be_visible()
        
    def should_show_warning_toast(self):
        expect(self.warning_toast).to_be_visible()

    def should_not_show_toast(self):
        expect(self.success_toast).to_be_hidden()
        expect(self.error_toast).to_be_hidden()
        expect(self.info_toast).to_be_hidden()
        expect(self.warning_toast).to_be_hidden()
        
