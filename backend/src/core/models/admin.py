from typing import List, Optional
from datetime import datetime
import uuid
from .base_model import BaseModel
from .user import UserRole, UserInDB
from .instance import UserInstanceFromDB


class AdminUsersWithDetails(UserInDB):
    role: UserRole
    user_instances: List[UserInstanceFromDB]

class AdminUser(BaseModel):
    user_id: uuid.UUID
    username: str
    email: str
    role: UserRole
    instances: List[UserInstanceFromDB]

class AdminUsersResponse(BaseModel):
    users: List[AdminUser]