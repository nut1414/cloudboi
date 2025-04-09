from typing import List, Optional
from datetime import datetime
import uuid

from .base_model import BaseModel
from .user import UserRole, UserInDB
from .instance import UserInstanceFromDB
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

class AdminBillingStatsRequest(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_alltime: bool = False

class AdminBillingStatsResponse(BaseModel):
    stats: List[AdminBillingStatsByType]