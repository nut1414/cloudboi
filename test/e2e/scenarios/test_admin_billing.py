from datetime import datetime
import pytest
from typing import Dict, Any
from playwright.sync_api import Page, expect, Browser

from ..pages.admin import AdminBillingPage
from ..data.models import InstancePlanData, OsTypeData, UserData, UserInstanceData, TransactionData
from ..registry.actions import ActionRegistry, TestData
from ..api.client import ApiClient
from ..data.constant import Currency, TransactionStatus, TransactionType

class TestAdminBilling:
    def test_admin_billing_should_have_correct_info(self, page: Page, test_user: UserData, api_client: ApiClient) -> None:
        admin_billing_page = AdminBillingPage(page)
        admin_billing_page.navigate()
        admin_billing_page.wait_for_locator(page.get_by_text("Billing").first)
