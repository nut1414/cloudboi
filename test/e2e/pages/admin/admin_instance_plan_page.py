from playwright.sync_api import Page, expect

from ..base_class import BasePage
from ..common.side_nav_bar import SideNavBar
from ...data.models import InstancePlanData
from ...data.constant import Currency

class AdminInstancePlanPage(BasePage):
    path: str = "/admin/plans"
    
    def __init__(self, page: Page):
        super().__init__(page)
        
        self.side_nav = SideNavBar(page)
        self.create_instance_plan_button = page.get_by_test_id("create-instance-plan-button")
        self.modal_input_fields = {
            "package_name": page.get_by_test_id("instance-plan-package-name-modal-input-field"),
            "id": page.get_by_test_id("instance-plan-id-modal-input-field"),
            "vcpu_amount": page.get_by_test_id("instance-plan-vcpu-amount-modal-input-field"),
            "ram_amount": page.get_by_test_id("instance-plan-ram-amount-modal-input-field"),
            "storage_amount": page.get_by_test_id("instance-plan-storage-amount-modal-input-field"),
            "cost_hour": page.get_by_test_id("instance-plan-cost-hour-modal-input-field"),
        }
        self.modal_buttons = {
            "get_cancel_button": lambda modal_name: page.get_by_test_id(f"instance-plan-cancel-{modal_name}-modal-button"),
            "get_confirm_button": lambda modal_name: page.get_by_test_id(f"instance-plan-{modal_name}-modal-button"),
            "get_close_button": lambda modal_name: page.get_by_test_id(f"instance-plan-close-{modal_name}-modal-button"),
        }
        self.table_buttons = {
            "get_edit_button": lambda plan_name: page.get_by_test_id(f"instance-plan-edit-{plan_name}-button"),
            "get_view_button": lambda plan_name: page.get_by_test_id(f"instance-plan-view-{plan_name}-button"),
            "get_delete_button": lambda plan_name: page.get_by_test_id(f"instance-plan-delete-{plan_name}-button"),
        }
        self.get_table_row = lambda plan_name: page.get_by_role("row").filter(has_text=plan_name)
        self.table = page.get_by_test_id("instance-plan-table")

    def click_create_instance_plan_button(self):
        self.create_instance_plan_button.click()

    def fill_create_modal(self, data: InstancePlanData):
        self.modal_input_fields["package_name"].fill(data.instance_package_name)
        self.modal_input_fields["vcpu_amount"].fill(str(data.vcpu_amount))
        self.modal_input_fields["ram_amount"].fill(str(data.ram_amount))
        self.modal_input_fields["storage_amount"].fill(str(data.storage_amount))
        self.modal_input_fields["cost_hour"].fill(str(data.cost_hour))
    
    def fill_edit_modal(self, data: InstancePlanData):
        expect(self.modal_input_fields["id"]).to_be_disabled()
        self.modal_input_fields["package_name"].fill(data.instance_package_name)
        self.modal_input_fields["vcpu_amount"].fill(str(data.vcpu_amount))
        self.modal_input_fields["ram_amount"].fill(str(data.ram_amount))
        self.modal_input_fields["storage_amount"].fill(str(data.storage_amount))
        self.modal_input_fields["cost_hour"].fill(str(data.cost_hour))
    
    def modal_should_have_info(self, data: InstancePlanData):
        expect(self.modal_input_fields["package_name"]).to_have_value(data.instance_package_name)
        expect(self.modal_input_fields["vcpu_amount"]).to_have_value(str(data.vcpu_amount))
        expect(self.modal_input_fields["ram_amount"]).to_have_value(str(data.ram_amount))
        expect(self.modal_input_fields["storage_amount"]).to_have_value(str(data.storage_amount))
        expect(self.modal_input_fields["cost_hour"]).to_have_value(str(data.cost_hour))
    
    def modal_all_fields_should_be_disabled(self):
        for field in self.modal_input_fields.values():
            expect(field).to_be_disabled()
    
    def click_close_modal_button(self, modal_name: str):
        self.modal_buttons["get_close_button"](modal_name).click()

    def click_confirm_modal_button(self, modal_name: str):
        self.modal_buttons["get_confirm_button"](modal_name).click()

    def click_cancel_modal_button(self, modal_name: str):
        self.modal_buttons["get_cancel_button"](modal_name).click()
    
    def click_table_button(self, button_name: str, plan_name: str):
        self.table_buttons[f"get_{button_name}_button"](plan_name).click()
    
    def table_button_should_not_be_visible(self, button_name: str, plan_name: str):
        expect(self.table_buttons[f"get_{button_name}_button"](plan_name)).not_to_be_visible()
        
    def table_row_should_have_info(self, data: InstancePlanData):
        row = self.get_table_row(data.instance_package_name)
        expect(row).to_be_visible()
        expect(row).to_contain_text(data.instance_package_name)
        expect(row).to_contain_text(f"{data.vcpu_amount} vCPUs")
        expect(row).to_contain_text(f"{data.ram_amount} GBs")
        expect(row).to_contain_text(f"{data.storage_amount} GBs")
        expect(row).to_contain_text(f"{data.cost_hour:.{Currency.PRECISION}f} {Currency.SYMBOL}/hour")

    def table_row_should_not_have_info(self, data: InstancePlanData):
        row = self.get_table_row(data.instance_package_name)
        expect(row).not_to_be_visible()
