from playwright.sync_api import Page, expect

from ..base_class import BasePage
from ..common.side_nav_bar import SideNavBar
from ...data.models import AdminTransactionData
from ...data.constant import TransactionType

class AdminBillingPage(BasePage):
    path: str = "/admin/billing"

    def __init__(self, page: Page):
        super().__init__(page)

        self.side_nav = SideNavBar(page)
        self.billing_stats_filter_buttons = {
            "all_time": page.get_by_test_id("date-range-picker-all-time-button"),
            "custom_range": page.get_by_test_id("date-range-picker-custom-range-button"),
            "monthly": page.get_by_test_id("date-range-picker-monthly-button"),
        }

        self.custom_range_picker = {
            "start_date": page.get_by_test_id("date-range-picker-start-date-input-field"),
            "end_date": page.get_by_test_id("date-range-picker-end-date-input-field"),
        }
        
        self.monthly_picker = {
            "previous_year": page.get_by_test_id("month-picker-previous-year"),
            "next_year": page.get_by_test_id("month-picker-next-year"),
            "get_month_button": lambda month: page.get_by_test_id(f"month-picker-month-{month}"),
        }

        self.billing_stats_visualizer = {
            "top_up_card": page.get_by_test_id(f"billing-stats-visualizer-item-{TransactionType.TOP_UP}-item-card"),
            "top_up_content": {
                "right_header": page.get_by_test_id(f"billing-stats-visualizer-right-header-{TransactionType.TOP_UP}"),
                "status_item": lambda status: page.get_by_test_id(f"billing-stats-visualizer-status-item-{status}"),
            },
            "subscription_card": page.get_by_test_id(f"billing-stats-visualizer-item-{TransactionType.SUBSCRIPTION_PAYMENT}-item-card"),
            "subscription_content": {
                "right_header": page.get_by_test_id(f"billing-stats-visualizer-right-header-{TransactionType.SUBSCRIPTION_PAYMENT}"),
                "status_item": lambda status: page.get_by_test_id(f"billing-stats-visualizer-status-item-{status}"),
            },
        }

        self.transaction_table = {
            "table": page.get_by_test_id("transactions-table-table"),
        }
    
    def click_billing_stats_filter_button(self, filter_type: str):
        self.billing_stats_filter_buttons[filter_type].click()

    def fill_custom_range_picker(self, start_date: str, end_date: str):
        self.custom_range_picker["start_date"].fill(start_date)
        self.custom_range_picker["end_date"].fill(end_date)

    def click_monthly_picker(self, month: str):
        self.monthly_picker["get_month_button(month)"].click()

    def click_monthly_picker_previous_year(self):
        self.monthly_picker["previous_year"].click()

    def click_monthly_picker_next_year(self):
        self.monthly_picker["next_year"].click()
        
        
        



