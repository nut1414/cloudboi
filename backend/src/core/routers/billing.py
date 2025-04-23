from typing import List
from fastapi import APIRouter, Depends, HTTPException, WebSocket
from dependency_injector.wiring import Provide, inject
from fastapi.websockets import WebSocketState


from ..service.helpers.instance_helper import InstanceHelper
from ..utils.logging import logger
from ..utils.dependencies import get_current_user, get_current_user_ws
from ..service.billing import BillingService
from ..models.billing import UserBillingOverviewResponse, UserTopUpRequest, UserTopUpResponse
from ..models.transaction import UserTransactionResponse
from ..models.user import UserWalletResponse
from ..container import AppContainer


router = APIRouter(
    prefix="/billing",
    tags=["billing"],
)

@router.get(
    "/overview/{username}",
    response_model=UserBillingOverviewResponse,
    dependencies=[Depends(get_current_user)]
)
@inject
async def get_billing_overview(
    username: str,
    billing_service: BillingService = Depends(Provide[AppContainer.billing_service])
):
    return await billing_service.get_user_billing_overview(username=username)

@router.get(
    "/transactions/{username}",
    response_model=List[UserTransactionResponse],
    dependencies=[Depends(get_current_user)]
)
@inject
async def get_all_user_transactions(
    username: str,
    billing_service: BillingService = Depends(Provide[AppContainer.billing_service])
):
    return await billing_service.get_all_user_transactions(username=username)

@router.post(
    "/topup/{username}",
    response_model=UserTopUpResponse,
    dependencies=[Depends(get_current_user)],
)
@inject
async def top_up(
    username: str,
    top_up_request: UserTopUpRequest,
    billing_service: BillingService = Depends(Provide[AppContainer.billing_service])
):
    return await billing_service.top_up(username=username, top_up_request=top_up_request)

@router.get(
    "/wallet/{username}",
    response_model=UserWalletResponse,
    dependencies=[Depends(get_current_user)],
)
@inject
async def get_user_wallet(
    username: str,
    billing_service: BillingService = Depends(Provide[AppContainer.billing_service])
):
    return await billing_service.get_user_wallet(username=username)

@router.post(
    "/trigger/overdue/{instance_name}",
    dependencies=[Depends(get_current_user)],
    include_in_schema=False,
)
@inject
async def trigger_overdue_subscription_action(
    instance_name: str,
    billing_service: BillingService = Depends(Provide[AppContainer.billing_service])
):
    return await billing_service.trigger_overdue_subscription_action(instance_name=instance_name)

@router.post(
    "/trigger/expired/{instance_name}",
    dependencies=[Depends(get_current_user)],
    include_in_schema=False,
)
@inject
async def trigger_expired_subscription_action(
    instance_name: str,
    billing_service: BillingService = Depends(Provide[AppContainer.billing_service])
):
    return await billing_service.trigger_expired_subscription_action(instance_name=instance_name)
