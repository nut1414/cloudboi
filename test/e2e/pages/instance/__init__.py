"""
Instance page objects for the E2E tests.
This package contains page objects for instance listing, creation, and management.
"""

from .instance_list_page import InstanceListPage
from .instance_create_page import InstanceCreatePage
from .instance_setting_page import InstanceSettingPage

__all__ = [
    'InstanceListPage',
    'InstanceCreatePage',
    'InstanceSettingPage'
]
