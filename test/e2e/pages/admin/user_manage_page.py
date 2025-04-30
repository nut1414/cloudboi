import re
from playwright.sync_api import Page, expect

from ..base_class import BasePage
from ..common.side_nav_bar import SideNavBar
from ...data.models import AdminUserDetailData, UserInstanceData
from ...data.constant import Currency
from ...utils.datetime_utils import format_date_for_instance_card

class UserManagePage(BasePage):
    path: str = "/admin/users"

    def __init__(self, page: Page):
        super().__init__(page)

        self.side_nav = SideNavBar(page)
        self.user_table = {
            "table": page.get_by_test_id("user-manage-table"),
            "rows": page.locator("table[data-testid='user-manage-table'] tbody tr"),
            "get_row": lambda username: page.get_by_test_id(f"user-manage-table-row-{username}"),
            "get_row_button": lambda username: page.get_by_test_id(f"view-instances-{username}-button"),
        }
        self.instance_card = {
            "get_card": lambda hostname: page.get_by_test_id(f"instance-card-{hostname}-item-card"),
            "get_card_header": lambda hostname: page.get_by_test_id(f"instance-card-{hostname}-item-card-header"),
            "get_view_details_button": lambda hostname: page.get_by_test_id(f"view-instance-detail-{hostname}-button"),
        }
    
    def click_view_user_instances_button(self, username: str):
        self.user_table["get_row_button"](username).click()

    def table_row_should_have_data(self, data: AdminUserDetailData):
        row = self.user_table["get_row"](data.username)
        expect(row).to_be_visible()
        
        cells = row.locator("td")
        expect(cells.nth(1)).to_contain_text(data.username)
        expect(cells.nth(2)).to_contain_text(data.email)
        expect(cells.nth(3)).to_contain_text(str(data.number_of_instances))
        expect(cells.nth(4)).to_contain_text(re.sub(r"[\s,]+", "", data.status_breakdown), ignore_case=True)
        expect(cells.nth(5)).to_contain_text(data.role)
    
    def click_table_row(self, username: str):
        self.user_table["get_row"](username).click()

    def click_instance_card_header(self, hostname: str):
        self.instance_card["get_card_header"](hostname).click()

    def click_view_instance_details_button(self, hostname: str):
        self.instance_card["get_view_details_button"](hostname).click()
    
    def should_have_empty_dropdown_row(self):
        expect(self.page.get_by_role("cell", name="No instances found").locator("div").first).to_be_visible()

    def instance_card_should_have_data(self, data: UserInstanceData):
        card = self.instance_card["get_card"](data.hostname)
        card_header = self.instance_card["get_card_header"](data.hostname)
        card_body = card.locator("div").filter(has_text="Plan").nth(2)

        expect(card).to_be_visible()

        expect(card_header).to_contain_text(data.hostname)
        expect(card_header).to_contain_text(data.status)

        instance_plan_text = f"{data.instance_plan.instance_package_name} ({data.instance_plan.vcpu_amount} vCPU, {data.instance_plan.ram_amount} GB RAM)"
        expect(card_body).to_contain_text(instance_plan_text)
        os_type_text = f"{data.os_type.os_image_name} {data.os_type.os_image_version}"
        expect(card_body).to_contain_text(os_type_text)
        storage_text = f"{data.instance_plan.storage_amount} GB"
        expect(card_body).to_contain_text(storage_text)
        cost_hour_text = f"{data.instance_plan.cost_hour:.4f} {Currency.SYMBOL}/hour"
        expect(card_body).to_contain_text(cost_hour_text)
        expect(card_body).to_contain_text(format_date_for_instance_card(data.created_at))
        expect(card_body).to_contain_text(format_date_for_instance_card(data.last_updated_at))
    
    def should_go_to_instance_list_page(self, username: str):
        expect(self.page).to_have_url(f"/user/{username}/instance")
    
    def should_go_to_instance_setting_page(self, username: str, hostname: str):
        expect(self.page).to_have_url(f"/user/{username}/instance/{hostname}")
