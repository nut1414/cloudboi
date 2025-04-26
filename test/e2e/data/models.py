"""
Data models for E2E testing fixtures.
These models ensure type safety and data consistency across tests.
"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional
import uuid

from .constant import TransactionType, TransactionStatus

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
class InstancePlanData:
    """
    Data model for instance plan fixture data used in instance management tests.
    """
    instance_plan_id: int
    instance_package_name: str
    vcpu_amount: int
    ram_amount: int
    storage_amount: int
    cost_hour: float

@dataclass
class OsTypeData:
    """
    Data model for os type fixture data used in instance management tests.
    """
    os_type_id: int
    os_image_name: str
    os_image_version: str

@dataclass
class UserInstanceData:
    """
    Data model for instance fixture data used in instance management tests.
    """
    instance_plan: InstancePlanData
    os_type: OsTypeData
    hostname: str
    lxd_node_name: str
    status: str
    root_password: str
    last_updated_at: datetime
    instance_id: Optional[uuid.UUID] = None
    user_id: Optional[uuid.UUID] = None
    created_at: Optional[datetime] = None

@dataclass
class TransactionData:
    """
    Data model for transaction fixture data used in transaction tests.
    """
    transaction_type: TransactionType
    transaction_status: TransactionStatus
    amount: float
    transaction_id: Optional[uuid.UUID] = None
    user_id: Optional[uuid.UUID] = None
    created_at: Optional[str] = None
    last_updated_at: Optional[str] = None

@dataclass
class AdminTransactionData(TransactionData):
    """
    Data model for admin transaction fixture data used in admin transaction tests.
    """
    instance_name: str = None
    username: str = None

@dataclass
class AdminBillingStatsSubscriptionData:
    scheduled_amount: float
    paid_amount: float
    overdue_amount: float
    expired_amount: float
    total_amount: float

@dataclass
class AdminBillingStatsTopUpData:
    pending_amount: float
    failed_amount: float
    success_amount: float
    total_amount: float

