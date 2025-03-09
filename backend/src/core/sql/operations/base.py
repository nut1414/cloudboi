from typing import List, Optional, Sequence, Type, TypeVar, Union
from fastapi import Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db_session

PydanticT = TypeVar("PydanticT", bound=BaseModel)

class BaseOperation():
    def __init__(self, db: AsyncSession = Depends(get_db_session)):
        self.db = db
    
    def to_pydantic(self, pydantic_model: Type[PydanticT], orm_objects: Union[Sequence, object, None]) -> Union[List[PydanticT], Optional[PydanticT]]:
        if orm_objects is None:
            return None
        
        # Convert SQLAlchemy model to dict if needed
        if hasattr(orm_objects, '__table__'):  # Check if it's a SQLAlchemy model
            orm_objects = {c.name: getattr(orm_objects, c.name) for c in orm_objects.__table__.columns}
            
        if isinstance(orm_objects, Sequence) and not isinstance(orm_objects, (str, bytes)):
            return [pydantic_model.model_validate(obj) for obj in orm_objects]
        else:
            return pydantic_model.model_validate(orm_objects)