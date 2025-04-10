from typing import List
from .clients.base_instance_client import BaseInstanceClient
from .clients.lxd import LXDClient
from fastapi import Depends
from ..models.lxd_cluster import (
    ClusterMemberInfo, CreateJoinTokenRequest, CreateJoinTokenResponse, 
    AddMemberResponse, AddMemberRequest, 
    GetClusterMembersStateInfoResponse
)


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
      
    async def get_lxd_cluster_members_state_info(self) -> GetClusterMembersStateInfoResponse:
        members = self.lxd_client.get_lxd_cluster_members()
        member_states = []
        member_infos = []
        member_groups = set()
        member_roles = set()
        leader = ""
        for member in members:
            member_states.append(self.lxd_client.get_lxd_cluster_member_state(member.server_name))
            member_infos.append(ClusterMemberInfo(
              server_name=member.server_name, 
              status=member.status, 
              message=member.message, 
              url=member.url, 
              roles=member.roles,
              groups=member.groups
            ))
            member_groups.update(member.groups)
            member_roles.update(member.roles)
            if "database-leader" in member.roles:
                leader = member.server_name
        return GetClusterMembersStateInfoResponse(
          members_states=member_states, 
          members_infos=member_infos, 
          members_groups=list(member_groups), 
          members_roles=list(member_roles),
          members_leader=leader
        )
