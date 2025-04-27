from playwright.sync_api import Page, expect

from ..base_class import BasePage
from ..common.side_nav_bar import SideNavBar
from ...data.models import AdminTransactionData, AdminBillingStatsSubscriptionData, AdminBillingStatsTopUpData
from ...data.constant import TransactionType, TransactionStatus, Currency
from ...utils.datetime_utils import extract_datetime_from_text, compare_datetimes_with_tolerance

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
            "top_up_card": page.get_by_test_id(f"billing-stats-visualizer-item-{TransactionType.TOP_UP.value}-item-card"),
            "top_up_content": {
                "right_header": page.get_by_test_id(f"billing-stats-visualizer-right-header-{TransactionType.TOP_UP.value}"),
                "status_item": lambda status: page.get_by_test_id(f"billing-stats-visualizer-status-item-{status}"),
            },
            "subscription_card": page.get_by_test_id(f"billing-stats-visualizer-item-{TransactionType.SUBSCRIPTION_PAYMENT.value}-item-card"),
            "subscription_content": {
                "right_header": page.get_by_test_id(f"billing-stats-visualizer-right-header-{TransactionType.SUBSCRIPTION_PAYMENT.value}"),
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
        self.monthly_picker["get_month_button"](month).click()

    def click_monthly_picker_previous_year(self):
        self.monthly_picker["previous_year"].click()

    def click_monthly_picker_next_year(self):
        self.monthly_picker["next_year"].click()
    
    def top_up_card_should_have_info(self, data: AdminBillingStatsTopUpData):
        expect(self.billing_stats_visualizer["top_up_card"]).to_be_visible()
        expect(self.billing_stats_visualizer["top_up_content"]["right_header"]).to_contain_text(f"{data.total_amount:g} {Currency.SYMBOL}")
        
        # Check each status amount
        for status_enum in [TransactionStatus.PENDING, TransactionStatus.FAILED, TransactionStatus.SUCCESS]:
            status = status_enum.value
            field_name = f"{status.lower()}_amount"
            amount = getattr(data, field_name)
            expect(self.billing_stats_visualizer["top_up_content"]["status_item"](status)).to_contain_text(f"{amount:g} {Currency.SYMBOL}")
    
    def subscription_card_should_have_info(self, data: AdminBillingStatsSubscriptionData):
        expect(self.billing_stats_visualizer["subscription_card"]).to_be_visible()
        expect(self.billing_stats_visualizer["subscription_content"]["right_header"]).to_contain_text(f"{data.total_amount:g} {Currency.SYMBOL}")
        
        # Check each status amount
        for status_enum in [TransactionStatus.SCHEDULED, TransactionStatus.PAID, TransactionStatus.OVERDUE, TransactionStatus.EXPIRED]:
            status = status_enum.value
            field_name = f"{status.lower()}_amount"
            amount = getattr(data, field_name)
            expect(self.billing_stats_visualizer["subscription_content"]["status_item"](status)).to_contain_text(f"{amount:g} {Currency.SYMBOL}")
        
    def transactions_table_should_be_empty(self):
        expect(self.transaction_table["table"]).to_contain_text("No transactions found")
        
    def table_row_should_have_info(self, transaction: AdminTransactionData, row_index: int = 0, tolerance_minutes: int = 2):
        """
        Check if a specific row in the transactions table has the expected information.
        
        Args:
            transaction: The expected transaction data
            row_index: The index of the row to check (0-based index)
            tolerance_minutes: Tolerance in minutes for datetime comparison (default: 2)
        """
        # Get the rows in the table
        rows = self.page.locator("table[data-testid='transactions-table-table'] tbody tr")
        
        # Get the specific row by index
        row = rows.nth(row_index)
        
        # Make sure the row exists
        expect(row).to_be_visible()
        
        # Verify each cell's content, based on the columns defined in AdminBillingPage.tsx
        # The cells are ordered based on the columns defined in AdminBillingPage.tsx
        cells = row.locator("td")
        
        # Date column
        if transaction.last_updated_at:
            date_cell_text = cells.nth(0).text_content()
            actual_date = extract_datetime_from_text(date_cell_text)
            
            # Compare dates with tolerance
            assert compare_datetimes_with_tolerance(
                actual_date, 
                transaction.last_updated_at, 
                tolerance_minutes
            ), f"Date mismatch: '{actual_date}' is not within {tolerance_minutes} minutes of expected '{transaction.last_updated_at}'"
        
        # Username column
        expect(cells.nth(1)).to_contain_text(transaction.username)
        
        # Instance name column
        if transaction.instance_name:
            expect(cells.nth(2)).to_contain_text(transaction.instance_name)
            
        # Transaction type column
        transaction_type_display = "Top-up" if transaction.transaction_type == TransactionType.TOP_UP else "Subscription"
        expect(cells.nth(3)).to_contain_text(transaction_type_display)
        
        # Status column
        expect(cells.nth(4)).to_contain_text(transaction.transaction_status, ignore_case=True)
        
        # Amount column - We can check if it contains a number, but the exact format might vary
        amount_text_format = "+" if transaction.transaction_type == TransactionType.TOP_UP else "-"
        amount_text_format += f"{transaction.amount:g} {Currency.SYMBOL}"
        expect(cells.nth(5)).to_contain_text(amount_text_format)
        
        # For subscription payments with valid instance, check if the "View Instance" button is present
        if (transaction.transaction_type == TransactionType.SUBSCRIPTION_PAYMENT and 
            transaction.instance_name != "Deleted Instance"):
            view_instance_button = cells.nth(6).locator("button")
            expect(view_instance_button).to_be_visible()
            expect(view_instance_button).to_have_text("View Instance")
            
    def transactions_table_should_have_data(self, transactions: list[AdminTransactionData], tolerance_minutes: int = 2):
        """
        Check if the transactions table contains the expected list of transactions in the correct order.
        
        Args:
            transactions: The list of expected transaction data in the expected order
            tolerance_minutes: Tolerance in minutes for datetime comparison (default: 2)
        """
        # Get the rows in the table
        rows = self.page.locator("table[data-testid='transactions-table-table'] tbody tr")
        
        # Check the row count
        expect(rows).to_have_count(len(transactions))
        
        # Check each row
        for i, transaction in enumerate(transactions):
            self.table_row_should_have_info(transaction, i, tolerance_minutes=tolerance_minutes)
            
    def click_view_instance_button(self, row_index: int = 0):
        """
        Click the View Instance button for a specific row.
        
        Args:
            row_index: The index of the row to click the button for (0-based index)
        """
        # Get the rows in the table
        rows = self.page.locator("table[data-testid='transactions-table-table'] tbody tr")
        
        # Get the specific row by index
        row = rows.nth(row_index)
        
        # Make sure the row exists
        expect(row).to_be_visible()
        
        # Get the button cell and click the button
        cells = row.locator("td")
        view_instance_button = cells.nth(6).locator("button")
        
        # Make sure the button exists and has the correct text
        expect(view_instance_button).to_be_visible()
        expect(view_instance_button).to_have_text("View Instance")
        
        # Click the button
        view_instance_button.click()
