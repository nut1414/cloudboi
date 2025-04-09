from fastapi import APIRouter, Depends, Request
from dependency_injector.wiring import inject, Provide
from typing import List
from datetime import datetime

from ..container import AppContainer
from ..utils.dependencies import get_admin_user
from ..models.admin import AdminUsersResponse, AdminBillingStatsRequest, AdminBillingStatsResponse, AdminTransactionResponse
from ..service.admin import AdminService

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(get_admin_user)],
)

@router.get(
    "/users",
    response_model=AdminUsersResponse
)
@inject
async def get_all_users(
    admin_service: AdminService = Depends(Provide[AppContainer.admin_service])
):
    return await admin_service.get_all_users_with_details()

@router.get(
    "/billing-stats",
    response_model=AdminBillingStatsResponse
)
@inject
async def get_billing_stats(
    billing_stats_request: AdminBillingStatsRequest,
    admin_service: AdminService = Depends(Provide[AppContainer.admin_service])
):
    return await admin_service.get_billing_stats(billing_stats_request)

@router.get(
    "/transactions",
    response_model=List[AdminTransactionResponse]
)
@inject
async def get_all_transactions(
    admin_service: AdminService = Depends(Provide[AppContainer.admin_service])
):
    return await admin_service.get_all_transactions()
