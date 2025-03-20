from fastapi import APIRouter, Depends, Request
from dependency_injector.wiring import Provide, inject

from ..models.lxd_cluster import AddMemberRequest, CreateJoinTokenRequest, CreateJoinTokenResponse
from ..service.lxd_cluster import LXDClusterService
from ..container import AppContainer

router = APIRouter(
    prefix="/internal/cluster",
    tags=["cluster"],
)

@router.post(
    "/create_token",
    response_model=CreateJoinTokenResponse
)
@inject
async def create_join_token(
    request: CreateJoinTokenRequest,
    lxd_cluster_service: LXDClusterService = Depends(Provide[AppContainer.lxd_cluster_service])
):
    token = await lxd_cluster_service.create_lxd_cluster_join_token(request)
    return token

@router.post(
    "/add_member",
    response_model=AddMemberRequest
)
@inject
async def add_member(
    request: Request,
    lxd_cluster_service: LXDClusterService = Depends(Provide[AppContainer.lxd_cluster_service])
):
    return await lxd_cluster_service.add_member_to_lxd_cluster_group(request)
  

