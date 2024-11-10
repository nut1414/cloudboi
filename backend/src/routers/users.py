from fastapi import APIRouter

from ..models import Users

router = APIRouter()


@router.get("/users/", response_model=list[Users.User], tags=["users"])
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]


@router.get("/users/me", response_model=Users.User, tags=["users"])
async def read_user_me():
    return {"username": "fakecurrentuser"}


@router.get("/users/{username}", response_model=Users.User, tags=["users"])
async def read_user(username: str):
    return {"username": username}