from fastapi import APIRouter, Depends
from dependency_injector.wiring import Provide, inject

from ..models.lxd_cluster import (
    AddMemberRequest, AddMemberResponse, 
    CreateJoinTokenRequest, CreateJoinTokenResponse,
    GetClusterMembersStateInfoResponse
)
from ..service.lxd_cluster import LXDClusterService
from ..container import AppContainer
from ..utils.dependencies import get_admin_user

router = APIRouter(
    prefix="/system/cluster",
    tags=["cluster"],
)

@router.post(
    "/create-token",
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
    "/add-member",
    response_model=AddMemberResponse
)
@inject
async def add_member(
    request: AddMemberRequest,
    lxd_cluster_service: LXDClusterService = Depends(Provide[AppContainer.lxd_cluster_service])
):
    return await lxd_cluster_service.add_member_to_lxd_cluster_group(request)
  
@router.get(
    "/members/state-info",
    response_model=GetClusterMembersStateInfoResponse,
    dependencies=[Depends(get_admin_user)]
)
@inject
async def get_members_state(
    lxd_cluster_service: LXDClusterService = Depends(Provide[AppContainer.lxd_cluster_service])
):
    return await lxd_cluster_service.get_lxd_cluster_members_state_info()
  

