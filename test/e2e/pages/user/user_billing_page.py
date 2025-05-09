from playwright.sync_api import Page, expect

from ..base_class import BasePage
from ..common.side_nav_bar import SideNavBar
from ...data.models import TransactionData
from ...utils.datetime_utils import compare_datetimes_with_tolerance, extract_datetime_from_text, parse_datetime

class UserBillingPage(BasePage):
    path: str = "/user/{username}/billing"

    def __init__(self, page: Page, username: str):
        super().__init__(page, username=username)

        self.side_nav = SideNavBar(page)
        self.tab_navigation = {
            "overview": page.get_by_test_id("user-billing-tab-button-OverviewMenu"),
            "history": page.get_by_test_id("user-billing-tab-button-HistoryMenu"),
            "top_up": page.get_by_test_id("user-billing-tab-button-TopUpMenu"),
        }

        self.overview_menu = {
            # Billing Overview
            "estimated_due": page.get_by_test_id("overview-menu-estimated-due"),
            "next_billing_date": page.get_by_test_id("overview-menu-next-billing-date"),
            "active_subscriptions": page.get_by_test_id("overview-menu-active-subscriptions"),
            "total_paid_cycle": page.get_by_test_id("overview-menu-total-paid-cycle"),
            # Payment Method
            "current_balance": page.get_by_test_id("overview-menu-current-balance"),
            "top_up_button": page.get_by_test_id("overview-menu-top-up-balance-button"),
        }

        self.history_menu = {
            "history_table": page.get_by_test_id("history-menu-table"),
            "get_row": lambda row_id: page.get_by_test_id(f"history-menu-table-row-{row_id}"),
        }

        self.top_up_menu = {
            "current_balance": page.get_by_test_id("top-up-menu-current-balance"),
            "top_up_input": page.get_by_test_id("top-up-menu-input-amount-input-field"),
            "add_credit_button": page.get_by_test_id("top-up-menu-add-credit-button"),
            "get_quick_selection": lambda amount: page.get_by_test_id(f"top-up-menu-quick-selection-{amount}-option-button"),
        }

    def navigate_to_tab(self, tab: str):
        self.tab_navigation[tab].click()
        
    def estimated_due_amount_should_be(self, amount: str):
        expect(self.overview_menu["estimated_due"]).to_have_text(amount)

    def next_billing_date_should_be(self, date: str, tolerance_minutes: int = 2):
        """
        Check if the next billing date is within the specified tolerance
        
        Args:
            date: Expected next billing date in format 'YYYY-MM-DD HH:MM:SS' (Bangkok timezone)
            tolerance_minutes: Tolerance in minutes (default: 2)
        """
        element = self.overview_menu["next_billing_date"]
        
        # First verify that the element exists and is visible
        expect(element).to_be_visible()
        
        actual_text = element.text_content()
        
        # For exact matching without tolerance
        if tolerance_minutes <= 0:
            expect(element).to_contain_text(date)
            return
            
        try:
            # Extract the date from the text using our utility
            actual_date = extract_datetime_from_text(actual_text)
            
            # Compare with tolerance - both dates are already in Bangkok timezone
            assert compare_datetimes_with_tolerance(actual_date, date, tolerance_minutes), \
                f"Next billing date '{actual_date}' is not within {tolerance_minutes} minutes of expected '{date}'"
                
        except ValueError as e:
            raise AssertionError(f"Failed to validate next billing date: {str(e)}")
        
    def active_subscriptions_should_be(self, count: int):
        expect(self.overview_menu["active_subscriptions"]).to_contain_text(str(count))

    def total_paid_cycle_should_be(self, paid_amount: str, cycle_count: int):
        expect(self.overview_menu["total_paid_cycle"]).to_contain_text(paid_amount)
        expect(self.overview_menu["total_paid_cycle"]).to_contain_text(f"{cycle_count} payment cycle(s)")
    
    def current_balance_overview_should_be(self, balance: str):
        expect(self.overview_menu["current_balance"]).to_have_text(balance)

    def click_top_up_overview_button(self):
        self.overview_menu["top_up_button"].click()        
        
    def should_have_transaction_in_row(self, transaction_type: str, transaction_status: str, amount: str, row_id: int):
        row = self.history_menu["get_row"](row_id)
        expect(row).to_contain_text(transaction_type, ignore_case=True)
        expect(row).to_contain_text(transaction_status, ignore_case=True)
        expect(row).to_contain_text(amount, ignore_case=True)
    
    def should_have_no_transaction(self):
        expect(self.history_menu["history_table"]).to_contain_text("No transactions found")
    
    def current_balance_top_up_should_be(self, balance: str):
        expect(self.top_up_menu["current_balance"]).to_have_text(balance)
    
    def click_add_credit_button(self):
        self.top_up_menu["add_credit_button"].click()
    
    def click_quick_selection_button(self, amount: str):
        self.top_up_menu["get_quick_selection"](amount).click()
        
    def fill_top_up_input_field(self, amount: str):
        self.top_up_menu["top_up_input"].fill(amount)
        
    def top_up_input_field_should_have_value(self, amount: str):
        expect(self.top_up_menu["top_up_input"]).to_have_value(amount)
        
    def add_credit_button_should_be_disabled(self):
        expect(self.top_up_menu["add_credit_button"]).to_be_disabled()
        