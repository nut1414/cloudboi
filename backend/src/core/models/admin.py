from typing import List, Optional
from datetime import datetime
import uuid
from .base_model import BaseModel
from .user import UserRole, UserInDB
from .instance import UserInstanceFromDB, InstancePlan


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
