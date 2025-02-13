from typing import Any, AsyncIterator
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import (
    AsyncConnection,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from ..config import DatabaseConfig
from .tables.base import Base
from .tables import *


# Reference: https://github.com/ThomasAitken/demo-fastapi-async-sqlalchemy/blob/main/backend/app/database.py
class DatabaseSessionManager:
    def __init__(self, host: str, engine_kwargs: dict[str, Any] = {}):
        self._engine = create_async_engine(host, **engine_kwargs)
        self._sessionmaker = async_sessionmaker(autocommit=False, bind=self._engine, expire_on_commit=False)

    async def close(self):
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")
        await self._engine.dispose()
        self._engine = None
        self._sessionmaker = None

    @asynccontextmanager
    async def connect(self) -> AsyncIterator[AsyncConnection]:
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")

        async with self._engine.begin() as connection:
            try:
                yield connection
            except Exception:
                await connection.rollback()
                raise

    @asynccontextmanager
    async def session(self) -> AsyncIterator[AsyncSession]:
        if self._sessionmaker is None:
            raise Exception("DatabaseSessionManager is not initialized")

        session = self._sessionmaker()
        try:
            yield session
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

session_manager = DatabaseSessionManager(DatabaseConfig.DB_URL, DatabaseConfig.DB_CONFIG)

async def get_db_session():
    async with session_manager.session() as session:
        yield session