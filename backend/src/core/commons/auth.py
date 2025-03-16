from dependency_injector.wiring import Provide, inject
from fastapi import Depends

from ..container import AppContainer

@inject
def current_user():
    return Depends(Provide[AppContainer.current_user])

@inject
def admin_user():
    return Depends(Provide[AppContainer.admin_user])