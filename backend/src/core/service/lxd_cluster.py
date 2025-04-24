from .clients.lxd import LXDClient
from ..models.lxd_cluster import (
    ClusterMember, CreateJoinTokenRequest, CreateJoinTokenResponse, 
    AddMemberResponse, AddMemberRequest, 
    GetClusterMembersStateInfoResponse, SysInfo
)
from ..utils.permission import require_roles
from ..constants.user_const import UserRole


class LXDClusterService:
    def __init__(
        self, 
        lxd_client: LXDClient
    ):
        self.lxd_client = lxd_client
        
    @require_roles([UserRole.ADMIN])
    async def create_lxd_cluster_join_token(self, request: CreateJoinTokenRequest) -> CreateJoinTokenResponse:
        token = self.lxd_client.create_lxd_cluster_join_token(request.server_name)
        return CreateJoinTokenResponse(join_token=token)
      
    @require_roles([UserRole.ADMIN])
    async def add_member_to_lxd_cluster_group(self, request: AddMemberRequest) -> AddMemberResponse:
        add_result = self.lxd_client.add_member_to_lxd_cluster_group(request.server_name)
        return AddMemberResponse(success=add_result)
      
    @require_roles([UserRole.ADMIN])
    async def get_lxd_cluster_members_state_info(self) -> GetClusterMembersStateInfoResponse:
        members = self.lxd_client.get_lxd_cluster_members()
        cluster_members = []
        member_groups = set()
        member_roles = set()
        leader = ""
        for member in members:
            try:
              member_state = self.lxd_client.get_lxd_cluster_member_state(member.server_name)
              cluster_members.append(ClusterMember(
                  server_name=member.server_name, 
                  status=member.status, 
                  message=member.message, 
                  url=member.url, 
                  roles=member.roles,
                  groups=member.groups,
                  storage_pools=member_state.storage_pools,
                  sysinfo=member_state.sysinfo
              ))
              member_groups.update(member.groups)
              member_roles.update(member.roles)
              if "database-leader" in member.roles:
                  leader = member.server_name
            except Exception as e:
              cluster_members.append(
                ClusterMember(
                  server_name=member.server_name, 
                  status="Offline", 
                  message="", 
                  url=member.url, 
                  roles=[],
                  groups=[],
                  storage_pools={},
                  sysinfo=SysInfo(
                    buffered_ram=0,
                    free_ram=0,
                    free_swap=0,
                    load_averages=[0,0,0],
                    logical_cpus=0,
                    processes=0,
                    shared_ram=0,
                    total_ram=0,
                    total_swap=0,
                    uptime=0
                  )
              ))

        return GetClusterMembersStateInfoResponse(
            members=cluster_members,
            members_groups=list(member_groups), 
            members_roles=list(member_roles),
            members_leader=leader
        )
