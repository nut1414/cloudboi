from typing import List, Optional
from datetime import datetime
import uuid

from .base_model import BaseModel
from .user import UserRole, UserInDB
from .instance import UserInstanceFromDB, InstancePlan
from ..constants.transaction_const import TransactionStatus, TransactionType

class AdminUsersWithDetails(UserInDB):
    role: UserRole
    user_instances: List[UserInstanceFromDB]

class AdminUser(BaseModel):
    user_id: uuid.UUID
    username: str
    email: str
    role: UserRole
    instances: List[UserInstanceFromDB]

class AdminBillingStatsByStatus(BaseModel):
    status: TransactionStatus
    amount: float

class AdminBillingStatsByType(BaseModel):
    type: TransactionType
    stats: List[AdminBillingStatsByStatus]

class AdminUsersResponse(BaseModel):
    users: List[AdminUser]

class AdminBillingStatsResponse(BaseModel):
    stats: List[AdminBillingStatsByType]

class AdminTransactionResponse(BaseModel):
    transaction_id: uuid.UUID
    username: str
    instance_name: Optional[str] = None
    transaction_type: TransactionType
    transaction_status: TransactionStatus
    amount: float
    created_at: datetime
    last_updated_at: datetime

class AdminInstancePlan(InstancePlan):
    is_editable: bool

class AdminInstancePlanCreateRequest(InstancePlan):
    instance_plan_id: Optional[int] = None

class AdminInstancePlanCreateResponse(InstancePlan):
    pass

class AdminInstancePlanUpdateRequest(InstancePlan):
    pass

class AdminInstancePlanUpdateResponse(InstancePlan):
    pass

class AdminInstancePlanDeleteRequest(InstancePlan):
    pass

class AdminInstancePlanDeleteResponse(BaseModel):
    instance_plan_id: int
    instance_package_name: str
    is_success: bool

class AdminTopUpRequest(BaseModel):
    username: str
    amount: float

class AdminTopUpResponse(BaseModel):
    transaction_id: uuid.UUID
    transaction_type: str
    transaction_status: str
    amount: float
    created_at: str
    last_updated_at: str
