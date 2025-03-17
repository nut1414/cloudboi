from contextlib import asynccontextmanager
from typing import Callable, List, Optional, Sequence, Type, TypeVar, Union, AsyncContextManager, AsyncGenerator
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

PydanticT = TypeVar("PydanticT", bound=BaseModel)

class BaseOperation:
    def __init__(self, db_session: Callable[[], AsyncContextManager[AsyncSession]]):
        self.db_session = db_session
    
    @asynccontextmanager
    async def session(self) -> AsyncGenerator[AsyncSession, None]:
        """Get a database session with automatic commit/rollback"""
        async with self.db_session() as session:
            yield session
    
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