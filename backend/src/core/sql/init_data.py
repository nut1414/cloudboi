from .database import DataInitializer
from .tables.user_role import UserRole
from .tables.os_type import OsType
from .tables.instance_plan import InstancePlan

async def initialize_data():
    initializer = DataInitializer()

    initializer.register(UserRole, [
        {"role_name": "user"},
        {"role_name": "admin"}
    ], ["role_name"])

    await initializer.execute()