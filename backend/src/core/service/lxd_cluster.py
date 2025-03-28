from .clients.base_instance_client import BaseInstanceClient
from .clients.lxd import LXDClient
from fastapi import Depends
from ..models.lxd_cluster import CreateJoinTokenRequest, CreateJoinTokenResponse, AddMemberResponse, AddMemberRequest


class LXDClusterService:
    def __init__(
        self, 
        lxd_client: LXDClient
    ):
        self.lxd_client = lxd_client
        
    async def create_lxd_cluster_join_token(self, request: CreateJoinTokenRequest) -> CreateJoinTokenResponse:
        token = self.lxd_client.create_lxd_cluster_join_token(request.server_name)
        return CreateJoinTokenResponse(join_token=token)
      
    async def add_member_to_lxd_cluster_group(self, request: AddMemberRequest) -> AddMemberResponse:
        add_result = self.lxd_client.add_member_to_lxd_cluster_group(request.server_name)
        return AddMemberResponse(success=add_result)
      
    
    