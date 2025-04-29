"""
Admin page objects for the E2E tests.
This package contains page objects for administration and settings pages.
"""

# Import any admin page classes here
from .admin_instance_plan_page import AdminInstancePlanPage
from .admin_billing_page import AdminBillingPage
from .admin_credit_page import AdminCreditPage

__all__ = [
    # List exported classes here
    'AdminInstancePlanPage',
    'AdminBillingPage',
    'AdminCreditPage',
]
