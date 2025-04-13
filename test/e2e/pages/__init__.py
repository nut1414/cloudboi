"""
Page Object Models for E2E testing.
"""

from .base_class import BasePage

# Import all pages from subpackages
from .auth import *
from .instance import *
from .admin import *
from .user import *

# Import any top-level page classes
from .landing_page import LandingPage

# Export all page classes
__all__ = [
    'BasePage',
    'LandingPage',
    # The rest are imported from subpackages
]
