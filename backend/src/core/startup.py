from typing import Optional
from fastapi import FastAPI
from contextlib import asynccontextmanager

from .sql.database import session_manager
from .sql.init_data import initialize_data
from .utils.logging import logger
from ..infra.managers.lxd import LXDManager
from .workers.billing import BillingWorker


class AppStartupManager:
    """
    Manages the startup and shutdown of application components.
    """
    def __init__(self):
        self.billing_worker: Optional[BillingWorker] = None
    
    async def initialize_database(self):
        """Initialize the database schema and seed data."""
        try:
            await session_manager.create_all()
            await initialize_data()
            logger.info("Database initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize database: {str(e)}")
    
    def initialize_lxd_manager(self):
        """Initialize the LXD container manager."""
        try:
            LXDManager.initialize()
            logger.info("LXD Manager initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize LXD Manager: {str(e)}")
    
    def start_billing_worker(self):
        """Initialize and start the billing worker."""
        try:
            self.billing_worker = BillingWorker()
            self.billing_worker.start()
            logger.info("Billing worker started successfully")
        except Exception as e:
            logger.error(f"Failed to start billing worker: {str(e)}")
    
    async def startup(self):
        """Initialize all required components."""
        await self.initialize_database()
        self.initialize_lxd_manager()
        self.start_billing_worker()
    
    async def shutdown(self):
        """Clean up resources and stop services."""
        # Stop the billing worker
        if self.billing_worker:
            self.billing_worker.stop()
            logger.info("Billing worker stopped")
        
        # Close database connections
        if session_manager._engine is not None:
            await session_manager.close()
            logger.info("Database connections closed")


# Create the application lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    startup_manager = AppStartupManager()
    
    # Perform startup
    await startup_manager.startup()
    
    yield
    
    # Perform shutdown
    await startup_manager.shutdown()