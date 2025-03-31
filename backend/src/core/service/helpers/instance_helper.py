from ...models.instance import UserInstanceFromDB, UserInstance, UserInstanceResponse

class InstanceHelper:
    @staticmethod
    def to_instance_upsert_model(
        instance: UserInstanceFromDB,
    ) -> UserInstance:
        return UserInstance(
            instance_id=instance.instance_id,
            user_id=instance.user_id,
            instance_plan_id=instance.instance_plan.instance_plan_id,
            os_type_id=instance.os_type.os_type_id,
            hostname=instance.hostname,
            lxd_node_name=instance.lxd_node_name,
            status=instance.status,
            created_at=instance.created_at,
            last_updated_at=instance.last_updated_at
        )

    @staticmethod
    def to_instance_response_model(
        instance: UserInstanceFromDB,
    ) -> UserInstanceResponse:
        return UserInstanceResponse(
            instance_id=instance.instance_id,
            instance_name=instance.hostname,
            instance_status=instance.status,
            instance_plan=instance.instance_plan,
            os_type=instance.os_type,
            last_updated_at=instance.last_updated_at
        )