from .base_model import BaseModel

class CreateJoinTokenRequest(BaseModel):
    server_name: str
    
class CreateJoinTokenResponse(BaseModel):
    join_token: str
    
class AddMemberRequest(BaseModel):
    server_name: str

class AddMemberResponse(BaseModel):
    success: bool