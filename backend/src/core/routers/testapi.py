from fastapi import APIRouter

from ..models import Users

router = APIRouter()

@router.get("/testapi/{item}", response_model=Users.TestModel, tags=["testapi"])
async def read_testapi(item: int):
    return {
        "test_response": item,
        "test_response2": item
    }