from fastapi import APIRouter, Depends, Request
from dependency_injector.wiring import inject, Provide
from typing import List
from datetime import datetime

from ..container import AppContainer
from ..utils.dependencies import get_admin_user
from ..models.admin import (
    AdminUsersResponse,
    AdminBillingStatsResponse,
    AdminTransactionResponse,
    AdminInstancePlan,
    AdminInstancePlanCreateRequest,
    AdminInstancePlanCreateResponse,
    AdminInstancePlanUpdateRequest,
    AdminInstancePlanUpdateResponse,
    AdminInstancePlanDeleteRequest,
    AdminInstancePlanDeleteResponse
)
from ..models.instance import InstancePlan
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
    "/instance-plans",
    response_model=List[AdminInstancePlan]
)
@inject
async def get_instance_plans(
    admin_service: AdminService = Depends(Provide[AppContainer.admin_service])
):
    return await admin_service.get_instance_plans()

@router.post(
    "/instance-plan/create",
    response_model=AdminInstancePlanCreateResponse
)
@inject
async def create_instance_plan(
    instance_plan: AdminInstancePlanCreateRequest,
    admin_service: AdminService = Depends(Provide[AppContainer.admin_service])
):
    return await admin_service.create_instance_plan(instance_plan)

@router.put(
    "/instance-plan/update",
    response_model=AdminInstancePlanUpdateResponse
)
@inject
async def update_instance_plan(
    instance_plan: AdminInstancePlanUpdateRequest,
    admin_service: AdminService = Depends(Provide[AppContainer.admin_service])
):
    return await admin_service.update_instance_plan(instance_plan)

@router.delete(
    "/instance-plan/delete",
    response_model=AdminInstancePlanDeleteResponse
)
@inject
async def delete_instance_plan(
    instance_plan: AdminInstancePlanDeleteRequest,
    admin_service: AdminService = Depends(Provide[AppContainer.admin_service])
):
    return await admin_service.delete_instance_plan(instance_plan)



@router.get(
    "/billing-stats",
    response_model=AdminBillingStatsResponse
)
@inject
async def get_billing_stats(
    is_alltime: bool,
    start_date: str = None,
    end_date: str = None,
    admin_service: AdminService = Depends(Provide[AppContainer.admin_service])
):
    return await admin_service.get_billing_stats(
        is_alltime=is_alltime,
        start_date=start_date,
        end_date=end_date
    )

@router.get(
    "/transactions",
    response_model=List[AdminTransactionResponse]
)
@inject
async def get_all_transactions(
    admin_service: AdminService = Depends(Provide[AppContainer.admin_service])
):
    return await admin_service.get_all_transactions()
