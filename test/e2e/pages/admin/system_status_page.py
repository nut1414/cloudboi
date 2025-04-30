from playwright.sync_api import Page, expect

from ..base_class import BasePage
from ..common.side_nav_bar import SideNavBar

class SystemStatusPage(BasePage):
    path: str = "/admin/system"

    def __init__(self, page: Page):
        super().__init__(page)

        self.side_nav = SideNavBar(page)
        self.system_metrics_cards = page.locator('[data-testid^="system-metrics-card-"]')

    def system_metrics_cards_should_have_more_count_than_or_equal_to(self, min_count: int):
        cards = self.system_metrics_cards
        count = cards.count()
        assert count >= min_count, f"Expected more than or equal to {min_count} system metrics cards, but found {count}"
