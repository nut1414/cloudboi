from dependency_injector import containers, providers

from .sql.database import get_db_session, get_db_manager
from .service.clients.lxd import LXDClient
from .service.clients.websocket import LXDWebSocketManager
from ..infra.managers.lxd import LXDManager
from .workers.billing import BillingWorker
from .service.user import UserService
from .service.instance import InstanceService
from .service.subscription import SubscriptionService
from .sql.operations import *


class AppContainer(containers.DeclarativeContainer):
    config = providers.Configuration()

    # Database Session
    db_manager = providers.Singleton(get_db_manager)
    db = providers.Resource(get_db_session)

    # Infrastructure
    lxd_manager = providers.Singleton(LXDManager)
    lxd_ws_manager = providers.Singleton(LXDWebSocketManager)
    lxd_client = providers.Factory(
        LXDClient,
        lxd_manager=lxd_manager,
        lxd_ws_manager=lxd_ws_manager
    )

    # Database Operations
    instance_opr = providers.Factory(InstanceOperation, db=db)
    subscription_opr = providers.Factory(SubscriptionOperation, db=db)
    transaction_opr = providers.Factory(TransactionOperation, db=db)
    user_opr = providers.Factory(UserOperation, db=db)

    # Services
    user_service = providers.Factory(
        UserService,
        user_opr=user_opr
    )
    subscription_service = providers.Factory(
        SubscriptionService,
        user_opr=user_opr,
        subscription_opr=subscription_opr,
        transaction_opr=transaction_opr
    )
    instance_service = providers.Factory(
        InstanceService,
        user_service=user_service,
        subscription_service=subscription_service,
        instance_opr=instance_opr,
        lxd_client=lxd_client
    )

    # Workers
    billing_worker = providers.Singleton(
        BillingWorker,
        subscription_service=subscription_service
    )