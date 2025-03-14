from fastapi import APIRouter, Depends, Request, Response

from ..models.lxd_cluster import AddMemberResponse, CreateJoinTokenResponse
from ..service.lxd_cluster import LXDClusterService


router = APIRouter(
    prefix="internal/cluster",
    tags=["user"],
)

@router.post(
    "create_token",
    response_model=CreateJoinTokenResponse
)
async def create_join_token(
    request: Request,
    lxd_cluster_service: LXDClusterService = Depends()
):
    return await lxd_cluster_service.create_lxd_cluster_join_token(request)
  
@router.post(
    "add_member",
    response_model=AddMemberResponse
)
async def add_member(
    request: Request,
    lxd_cluster_service: LXDClusterService = Depends()
):
    return await lxd_cluster_service.add_member_to_lxd_cluster_group(request)
  

