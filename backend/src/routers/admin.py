from fastapi import APIRouter
from ..models import Admin

router = APIRouter()

@router.post("/", response_model=Admin.ResponseMessage, tags=["admin"])
async def update_admin():
    return {"message": "Admin getting schwifty"}