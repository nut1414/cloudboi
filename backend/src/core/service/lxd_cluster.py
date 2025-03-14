from .clients.base_instance_client import BaseInstanceClient
from .clients.lxd import LXDClient
from fastapi import Depends
from ..models.lxd_cluster import CreateJoinTokenRequest, CreateJoinTokenResponse, AddMemberResponse


class LXDClusterService:
    def __init__(
        self, 
        lxd_client: LXDClient = Depends(LXDClient.get_client)
    ):
        self.lxd_client = lxd_client
        
    async def create_lxd_cluster_join_token(self, request: CreateJoinTokenRequest) -> str:
        token = await self.lxd_client.create_lxd_cluster_join_token(request.server_name)
        return CreateJoinTokenResponse(token=token)
      
    async def add_member_to_lxd_cluster_group(self, request: AddMemberResponse) -> bool:
        add_result = await self.lxd_client.add_member_to_lxd_cluster_group(request.server_name)
        return AddMemberResponse(result=add_result)
      
    
    