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
    "/overview",
    response_model=UserBillingOverviewResponse,
    dependencies=[Depends(get_current_user)]
)
@inject
async def get_billing_overview(
    billing_service: BillingService = Depends(Provide[AppContainer.billing_service])
):
    return await billing_service.get_user_billing_overview()

@router.get(
    "/transactions",
    response_model=List[UserTransactionResponse],
    dependencies=[Depends(get_current_user)]
)
@inject
async def get_all_user_transactions(
    billing_service: BillingService = Depends(Provide[AppContainer.billing_service])
):
    return await billing_service.get_all_user_transactions()

@router.post(
    "/topup",
    response_model=UserTopUpResponse,
    dependencies=[Depends(get_current_user)],
)
@inject
async def top_up(
    top_up_request: UserTopUpRequest,
    billing_service: BillingService = Depends(Provide[AppContainer.billing_service])
):
    return await billing_service.top_up(top_up_request)

@router.get(
    "/wallet",
    response_model=UserWalletResponse,
    dependencies=[Depends(get_current_user)],
)
@inject
async def get_user_wallet(
    billing_service: BillingService = Depends(Provide[AppContainer.billing_service])
):
    return await billing_service.get_user_wallet()
