"""
User page objects for the E2E tests.
This package contains page objects for user-specific pages like profiles, settings, etc.
"""

# Import any user page classes here
from .user_billing_page import UserBillingPage

__all__ = [
    # List exported classes here
    'UserBillingPage',
]
