from typing import List

from ..sql.operations import AdminOperation
from ..models.admin import AdminUser, AdminUsersResponse
from ..utils.permission import require_roles
from ..constants.user_const import UserRole


class AdminService:
    def __init__(
        self,
        admin_opr: AdminOperation,
    ):
        self.admin_opr = admin_opr
    
    @require_roles([UserRole.ADMIN])
    async def get_all_users_with_details(self) -> List[AdminUsersResponse]:
        users = await self.admin_opr.get_all_users_with_details()
        return AdminUsersResponse(
            users=[
                AdminUser(
                    user_id=user.user_id,
                    username=user.username,
                    email=user.email,
                    role=user.role,
                    instances=user.user_instances,
                )
                for user in users
            ]
        )

