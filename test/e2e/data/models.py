"""
Data models for E2E testing fixtures.
These models ensure type safety and data consistency across tests.
"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional
import uuid

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