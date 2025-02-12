from typing import List, Sequence, Type, TypeVar
from fastapi import Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db_session

PydanticT = TypeVar("PydanticT", bound=BaseModel)

class BaseOperation:
    def __init__(self, db: AsyncSession = Depends(get_db_session)):
        self.db = db
    
    def to_pydantic(self, pydantic_model: Type[PydanticT], orm_objects: Sequence) -> List[PydanticT]:
        return [pydantic_model.model_validate(obj) for obj in orm_objects]