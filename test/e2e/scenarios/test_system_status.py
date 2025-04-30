from datetime import datetime
import pytest
from typing import Dict, Any
from playwright.sync_api import Page, expect, Browser

from ..pages.admin import SystemStatusPage
from ..data.models import UserData
from ..registry.actions import ActionRegistry, TestData
from ..api.client import ApiClient

class TestSystemStatus:
    def test_system_status_should_have_main_node_and_resource_node(self, page: Page) -> None:
        system_status_page = SystemStatusPage(page)
        system_status_page.navigate()
        system_status_page.wait_for_locator(page.get_by_text("System Status").first)
        system_status_page.wait_for_toast("success")

        system_status_page.system_metrics_cards_should_have_more_count_than_or_equal_to(2)
