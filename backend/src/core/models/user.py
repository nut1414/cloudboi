from datetime import datetime
from typing import Optional
import uuid
from .base_model import BaseModel


class User(BaseModel):
    username: str
    email: str

class UserInDB(User):
    user_id: Optional[uuid.UUID] = None
    password_hash: str
    last_updated_at: Optional[datetime] = None

class UserRole(BaseModel):
    role_id: int
    role_name: str

class UserWallet(BaseModel):
    user_id: uuid.UUID
    balance: float
    last_updated_at: datetime

class UserCreateRequest(User):
    password: str

class UserCreateResponse(User):
    balance: float
    created_at: datetime

class UserLoginRequest(BaseModel):
    username: str
    password: str

class UserLoginResponse(BaseModel):
    message: str

class UserSessionResponse(BaseModel):
    is_authenticated: bool
    username: Optional[str]
    email: Optional[str]
    role: Optional[str]