from datetime import datetime
import pytest
from typing import Dict, Any
from playwright.sync_api import Page, expect, Browser

from ..pages.admin import AdminBillingPage
from ..data.models import InstancePlanData, OsTypeData, UserData, UserInstanceData, AdminBillingStatsSubscriptionData, AdminBillingStatsTopUpData, AdminTransactionData
from ..registry.actions import ActionRegistry, TestData
from ..api.client import ApiClient
from ..data.constant import Currency, TransactionStatus, TransactionType
from ..utils.datetime_utils import now_formatted, future_date_formatted, get_month_short, get_current_month_short

@pytest.fixture(scope="module")
def test_instance_plan() -> InstancePlanData:
    return InstancePlanData(
        instance_plan_id=1,
        instance_package_name="nano-1",
        vcpu_amount=1,
        ram_amount=1,
        storage_amount=10,
        cost_hour=0.005
    )

@pytest.fixture(scope="module")
def test_os_type() -> OsTypeData:
    return OsTypeData(
        os_type_id=11,
        os_image_name="Debian",
        os_image_version="bookworm"
    )

@pytest.fixture(scope="module")
def test_user_instance(
    test_instance_plan: InstancePlanData,
    test_os_type: OsTypeData
) -> UserInstanceData:
    return UserInstanceData(
        instance_plan=test_instance_plan,
        os_type=test_os_type,
        hostname="test-hostname-user",
        lxd_node_name="test-lxd-node-name",
        status="running",
        root_password="Password123!",
        created_at=datetime.now(),
        last_updated_at=datetime.now()
    )

@pytest.fixture(scope="module")
def test_admin_instance(
    test_instance_plan: InstancePlanData,
    test_os_type: OsTypeData
) -> UserInstanceData:
    return UserInstanceData(
        instance_plan=test_instance_plan,
        os_type=test_os_type,
        hostname="test-hostname-admin",
        lxd_node_name="test-lxd-node-name",
        status="running",
        root_password="Password123!",
        created_at=datetime.now(),
        last_updated_at=datetime.now()
    )

@pytest.fixture(scope="module")
def test_admin_billing_user() -> UserData:
    return UserData(
        username="test-admin-billing",
        email="test-admin-billing@example.com",
        password="Password123!",
        role="user"
    )

@pytest.fixture(scope="module")
def test_transactions(
    test_admin_billing_user: UserData,
    test_user: UserData,
    test_user_instance: UserInstanceData,
    test_admin_instance: UserInstanceData
) -> list[AdminTransactionData]:
    return [
        # Admin transactions
        AdminTransactionData(
            transaction_type=TransactionType.TOP_UP,
            transaction_status=TransactionStatus.SUCCESS,
            amount=50.0,
            username=test_user.username,
            last_updated_at=now_formatted()
        ),
        AdminTransactionData(
            transaction_type=TransactionType.SUBSCRIPTION_PAYMENT,
            transaction_status=TransactionStatus.PAID,
            amount=round(test_admin_instance.instance_plan.cost_hour * 730, 1),
            username=test_user.username,
            instance_name="Deleted Instance",
            last_updated_at=now_formatted()
        ),
        # User transactions
        AdminTransactionData(
            transaction_type=TransactionType.TOP_UP,
            transaction_status=TransactionStatus.SUCCESS,
            amount=25.0,
            username=test_admin_billing_user.username,
            last_updated_at=now_formatted()
        ),
        AdminTransactionData(
            transaction_type=TransactionType.SUBSCRIPTION_PAYMENT,
            transaction_status=TransactionStatus.PAID,
            amount=round(test_user_instance.instance_plan.cost_hour * 730, 1),
            username=test_admin_billing_user.username,
            instance_name=test_user_instance.hostname,
            last_updated_at=now_formatted()
        ),
        AdminTransactionData(
            transaction_type=TransactionType.SUBSCRIPTION_PAYMENT,
            transaction_status=TransactionStatus.SCHEDULED,
            amount=round(test_user_instance.instance_plan.cost_hour * 730, 1),
            username=test_admin_billing_user.username,
            instance_name=test_user_instance.hostname,
            last_updated_at=now_formatted()
        )
    ]

@pytest.fixture(scope="module")
def test_admin_billing_stats_data(
    test_transactions: list[AdminTransactionData]
) -> tuple[AdminBillingStatsSubscriptionData, AdminBillingStatsTopUpData]:
    def sum_transactions(transaction_type: TransactionType, status: TransactionStatus = None) -> float:
        return sum(
            transaction.amount
            for transaction in test_transactions
            if transaction.transaction_type == transaction_type
            and (status is None or transaction.transaction_status == status)
        )
    
    # Calculate subscription amounts
    subscription_type = TransactionType.SUBSCRIPTION_PAYMENT
    subscription_amounts = {
        'total': sum_transactions(subscription_type),
        'scheduled': sum_transactions(subscription_type, TransactionStatus.SCHEDULED),
        'paid': sum_transactions(subscription_type, TransactionStatus.PAID),
        'overdue': sum_transactions(subscription_type, TransactionStatus.OVERDUE),
        'expired': sum_transactions(subscription_type, TransactionStatus.EXPIRED)
    }
    
    # Calculate top-up amounts
    topup_type = TransactionType.TOP_UP
    topup_amounts = {
        'total': sum_transactions(topup_type),
        'pending': sum_transactions(topup_type, TransactionStatus.PENDING),
        'failed': sum_transactions(topup_type, TransactionStatus.FAILED),
        'success': sum_transactions(topup_type, TransactionStatus.SUCCESS)
    }
    
    return (
        AdminBillingStatsSubscriptionData(
            total_amount=subscription_amounts['total'],
            scheduled_amount=subscription_amounts['scheduled'],
            paid_amount=subscription_amounts['paid'],
            overdue_amount=subscription_amounts['overdue'],
            expired_amount=subscription_amounts['expired']
        ),
        AdminBillingStatsTopUpData(
            total_amount=topup_amounts['total'],
            pending_amount=topup_amounts['pending'],
            failed_amount=topup_amounts['failed'],
            success_amount=topup_amounts['success']
        )
    )

@pytest.fixture(scope="module", autouse=True)
def setup_class_actions(
    action_registry: ActionRegistry,
    test_user_instance: UserInstanceData,
    test_admin_instance: UserInstanceData,
    test_user: UserData,
    test_admin_billing_user: UserData,
    test_transactions: list[AdminTransactionData]
) -> None:
    # Rename locally for clarity
    admin_user = test_user
    regular_user = test_admin_billing_user
    
    @action_registry.before()
    def create_transactions(api_client: ApiClient) -> None:
        api_client.register_user(regular_user)

        # Create transactions for admin
        api_client.login_user(admin_user)
        api_client.user_topup(admin_user.username, test_transactions[0].amount)
        api_client.create_instance(test_admin_instance)
        api_client.delete_instance(test_admin_instance.hostname)

        # Create transactions for user
        api_client.login_user(regular_user)
        api_client.user_topup(regular_user.username, test_transactions[2].amount)
        api_client.create_instance(test_user_instance)

        # Login back as admin
        api_client.login_user(admin_user)
    
    @action_registry.after_all()
    def delete_instances(api_client: ApiClient) -> None:
        api_client.login_user(admin_user)
        api_client.delete_instance(test_user_instance.hostname)

# This test scenario need to be run first to make sure that the transactions table is empty
@pytest.mark.usefixtures("test_class_lifecycle")
class TestAdminBilling:
    def test_admin_billing_should_have_correct_info_when_no_transactions(self, page: Page) -> None:
        empty_subscription_stats = AdminBillingStatsSubscriptionData(
            total_amount=0,
            scheduled_amount=0,
            paid_amount=0,
            overdue_amount=0,
            expired_amount=0,
        )

        empty_top_up_stats = AdminBillingStatsTopUpData(
            total_amount=0,
            pending_amount=0,
            failed_amount=0,
            success_amount=0,
        )

        admin_billing_page = AdminBillingPage(page)
        admin_billing_page.navigate()
        admin_billing_page.wait_for_locator(page.get_by_text("Billing").first)

        admin_billing_page.top_up_card_should_have_info(empty_top_up_stats)
        admin_billing_page.subscription_card_should_have_info(empty_subscription_stats)
        admin_billing_page.transactions_table_should_be_empty()
    
    @pytest.mark.usefixtures("test_lifecycle")
    def test_admin_billing_should_show_display_table_with_correct_data(self, page: Page, test_transactions: list[AdminTransactionData]) -> None:
        admin_billing_page = AdminBillingPage(page)
        admin_billing_page.navigate()
        admin_billing_page.wait_for_locator(page.get_by_text("Billing").first)

        admin_billing_page.transactions_table_should_have_data(test_transactions, 5)
    
    def test_admin_billing_stats_all_time_filter_should_work_correctly(self, page: Page, test_admin_billing_stats_data: tuple[AdminBillingStatsSubscriptionData, AdminBillingStatsTopUpData]) -> None:
        admin_billing_page = AdminBillingPage(page)
        admin_billing_page.navigate()
        admin_billing_page.wait_for_locator(page.get_by_text("Billing").first)

        admin_billing_page.subscription_card_should_have_info(test_admin_billing_stats_data[0])
        admin_billing_page.top_up_card_should_have_info(test_admin_billing_stats_data[1])
    
    def test_admin_billing_stats_custom_range_filter_should_work_correctly(self, page: Page, test_admin_billing_stats_data: tuple[AdminBillingStatsSubscriptionData, AdminBillingStatsTopUpData]) -> None:
        empty_subscription_stats = AdminBillingStatsSubscriptionData(
            total_amount=0,
            scheduled_amount=0,
            paid_amount=0,
            overdue_amount=0,
            expired_amount=0,
        )
        empty_top_up_stats = AdminBillingStatsTopUpData(
            total_amount=0,
            pending_amount=0,
            failed_amount=0,
            success_amount=0,
        )

        admin_billing_page = AdminBillingPage(page)
        admin_billing_page.navigate()
        admin_billing_page.wait_for_locator(page.get_by_text("Billing").first)

        yesterday = future_date_formatted(-1, date_only=True)
        admin_billing_page.click_billing_stats_filter_button("custom_range")
        admin_billing_page.fill_custom_range_picker(yesterday, yesterday)
        admin_billing_page.subscription_card_should_have_info(empty_subscription_stats)
        admin_billing_page.top_up_card_should_have_info(empty_top_up_stats)

        today = now_formatted(date_only=True)
        admin_billing_page.fill_custom_range_picker(today, today)
        admin_billing_page.subscription_card_should_have_info(test_admin_billing_stats_data[0])
        admin_billing_page.top_up_card_should_have_info(test_admin_billing_stats_data[1])

    def test_admin_billing_stats_monthly_filter_should_work_correctly(self, page: Page, test_admin_billing_stats_data: tuple[AdminBillingStatsSubscriptionData, AdminBillingStatsTopUpData]) -> None:
        empty_subscription_stats = AdminBillingStatsSubscriptionData(
            total_amount=0,
            scheduled_amount=0,
            paid_amount=0,
            overdue_amount=0,
            expired_amount=0,
        )
        empty_top_up_stats = AdminBillingStatsTopUpData(
            total_amount=0,
            pending_amount=0,
            failed_amount=0,
            success_amount=0,
        )
        
        admin_billing_page = AdminBillingPage(page)
        admin_billing_page.navigate()
        admin_billing_page.wait_for_locator(page.get_by_text("Billing").first)

        # Last month to Last month
        last_month = get_month_short(-1)
        admin_billing_page.click_billing_stats_filter_button("monthly")
        admin_billing_page.click_monthly_picker(last_month)
        admin_billing_page.click_monthly_picker(last_month)
        admin_billing_page.subscription_card_should_have_info(empty_subscription_stats)
        admin_billing_page.top_up_card_should_have_info(empty_top_up_stats)

        # Current month to Current month
        current_month = get_current_month_short()
        admin_billing_page.click_monthly_picker(current_month)
        admin_billing_page.click_monthly_picker(current_month)
        admin_billing_page.subscription_card_should_have_info(test_admin_billing_stats_data[0])
        admin_billing_page.top_up_card_should_have_info(test_admin_billing_stats_data[1])