from pydantic import BaseModel

class User(BaseModel):
  username: str
  email: str

class UserInDB(User):
  password_hash: str

class UserRole(BaseModel):
  role_id: int
  role_name: str

class UserCreateRequest(User):
  password: str

class UserCreateResponse(User):
  created_at: str

class UserLoginRequest(BaseModel):
  username: str
  password: str

class UserLoginResponse(BaseModel):
  message: str

class UserSessionResponse(BaseModel):
  is_authenticated: bool
  username: str
  email: str
  role: str