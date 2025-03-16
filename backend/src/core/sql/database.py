from typing import Any, AsyncIterator, Dict, List, Optional, Type
from contextlib import asynccontextmanager
from sqlalchemy import select
from sqlalchemy.ext.asyncio import (
    AsyncConnection,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from ..config import DatabaseConfig
from .tables.base import Base
from .tables import *
from ..commons.exception import create_exception_class
from ..utils.logging import logger

DatabaseException = create_exception_class("PostgresDatabase")

# Reference: https://github.com/ThomasAitken/demo-fastapi-async-sqlalchemy/blob/main/backend/app/database.py
class DatabaseSessionManager:
    _instance: Optional["DatabaseSessionManager"] = None

    def __init__(self, host: str, engine_kwargs: dict[str, Any] = {}):
        self._engine = create_async_engine(host, **engine_kwargs)
        self._sessionmaker = async_sessionmaker(autocommit=False, bind=self._engine, expire_on_commit=False)

    @classmethod
    def get_instance(cls) -> "DatabaseSessionManager":
        """Get the singleton instance of DatabaseSessionManager"""
        if cls._instance is None:
            cls._instance = cls(
                host=DatabaseConfig.DB_URL, 
                engine_kwargs=DatabaseConfig.DB_CONFIG
            )
        return cls._instance

    async def close(self):
        if self._engine is None:
            raise DatabaseException("DatabaseSessionManager is not initialized")
        await self._engine.dispose()
        self._engine = None
        self._sessionmaker = None

    @asynccontextmanager
    async def connect(self) -> AsyncIterator[AsyncConnection]:
        if self._engine is None:
            raise DatabaseException("DatabaseSessionManager is not initialized")

        async with self._engine.begin() as connection:
            try:
                yield connection
            except Exception as e:
                await connection.rollback()
                raise DatabaseException(f"Error connecting to database: {str(e)}")

    @asynccontextmanager
    async def session(self) -> AsyncIterator[AsyncSession]:
        if self._sessionmaker is None:
            raise DatabaseException("DatabaseSessionManager is not initialized")

        session = self._sessionmaker()
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

    async def create_all(self):
        async with self.connect() as connection:
            await connection.run_sync(Base.metadata.create_all)

    async def drop_all(self):
        async with self.connect() as connection:
            await connection.run_sync(Base.metadata.drop_all)

def get_db_manager() -> DatabaseSessionManager:
    return DatabaseSessionManager.get_instance()

async def get_db_session():
    db_manager = get_db_manager()
    async with db_manager.session() as session:
        yield session

class DataInitializer:
    def __init__(self):
        self.initial_data = {}
        self.unique_keys = {}
    
    def register(self, model: Type[Base], data: List[Dict[str, Any]], unique_keys: List[str]):
        """
        Register a table and its initial data with unique keys for checking existence.
        
        Args:
            model: The SQLAlchemy model class
            data: List of dictionaries containing the data to insert (without primary keys)
            unique_keys: List of column names to use for checking if a record exists
        """
        self.initial_data[model] = data
        self.unique_keys[model] = unique_keys
    
    async def execute(self):
        """Execute all registered data initializations with conditional insertion"""
        async with get_db_manager().session() as session:
            try:
                for model, data_list in self.initial_data.items():
                    unique_keys = self.unique_keys[model]
                    if not unique_keys:
                        raise ValueError(f"No unique keys defined for {model.__name__}")
                    
                    inserted_count = 0
                    for data in data_list:
                        # Build a query to check if this record exists
                        query = select(model)
                        for key in unique_keys:
                            if key in data:
                                # Add condition for each unique key
                                column = getattr(model, key)
                                query = query.where(column == data[key])
                            else:
                                raise ValueError(f"Unique key '{key}' not found in data for {model.__name__}")
                        
                        # Check if record exists
                        result = await session.execute(query)
                        existing_record = result.scalar_one_or_none()
                        
                        if existing_record is None:
                            # Record doesn't exist, create it
                            instance = model(**data)
                            session.add(instance)
                            inserted_count += 1
                    
                    if inserted_count > 0:
                        logger.info(f"{model.__name__} table initialized with {inserted_count} new records.")
                    else:
                        logger.info(f"No new records inserted for {model.__name__}.")
                
                # Commit all changes
                await session.commit()
                logger.info("Database initialization completed successfully.")  
            except Exception as e:
                await session.rollback()
                raise DatabaseException(f"Error initializing database: {str(e)}")