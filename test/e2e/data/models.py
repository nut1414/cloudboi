"""
Data models for E2E testing fixtures.
These models ensure type safety and data consistency across tests.
"""
from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class RegisterData:
    """
    Data model for register fixture data used in register tests.
    """
    email: str
    username: str
    password: str

@dataclass
class LoginData:
    """
    Data model for login fixture data used in login tests.
    """
    username: str
    password: str


@dataclass
class UserData:
    """
    Data model for user fixture data used in authentication tests.
    """
    username: str
    email: str
    password: str
    role: str


@dataclass
class InstanceData:
    """
    Data model for instance fixture data used in instance management tests.
    """
    name: str
    plan: str
    description: Optional[str] = None
    storage_gb: int = 10
    cpu_cores: int = 1
    ram_gb: int = 2
    tags: List[str] = field(default_factory=list)


@dataclass
class BillingData:
    """
    Data model for billing fixture data used in billing tests.
    """
    card_number: str
    expiry_month: int
    expiry_year: int
    cvv: str
    name_on_card: str
    billing_address: str 