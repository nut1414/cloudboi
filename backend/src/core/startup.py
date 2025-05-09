from fastapi import FastAPI
from contextlib import asynccontextmanager

from .sql.init_data import initialize_data
from .utils.logging import logger
from .container import AppContainer
from .config import APP_ENV

class AppStartupManager:
    """
    Manages the startup and shutdown of application components.
    """
    def __init__(self, container: AppContainer):
        self.container = container
    
    async def initialize_database(self):
        """Initialize the database schema and seed data."""
        try:
            db_manager = self.container.db_manager()

            # In test mode, clean up the database on startup
            # This ensures tests don't affect each other
            if APP_ENV == "test":
                try:
                    logger.info("Test mode detected: Cleaning up database on startup")
                    await db_manager.drop_all()
                    logger.info("Test database cleaned up")
                except Exception as e:
                    logger.error(f"Failed to clean up test database: {str(e)}")
            
            await db_manager.create_all()
            await initialize_data()
            logger.info("Database initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize database: {str(e)}")
    
    def initialize_lxd_manager(self):
        """Initialize the LXD container manager."""
        try:
            self.container.lxd_manager().initialize()
            logger.info("LXD Manager initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize LXD Manager: {str(e)}")
    
    async def start_billing_worker(self):
        """Initialize and start the billing worker."""
        try:
            billing_worker = self.container.billing_worker()
            billing_worker.start()
            logger.info("Billing worker started successfully")
        except Exception as e:
            logger.error(f"Failed to start billing worker: {str(e)}")
    
    async def startup(self):
        """Initialize all required components."""
        await self.initialize_database()
        self.initialize_lxd_manager()
        
        # In test mode, we will trigger the subscription action manually
        if APP_ENV != "test":
            await self.start_billing_worker()
    
    async def shutdown(self):
        """Clean up resources and stop services."""
        # Stop the billing worker
        billing_worker = self.container.billing_worker()
        if billing_worker.is_running:
            billing_worker.stop()
            logger.info("Billing worker stopped")
        
        # Close database connections
        try:
            db_manager = self.container.db_manager()
            await db_manager.close()
            logger.info("Database connection closed")
        except Exception as e:
            logger.error(f"Failed to close database connection: {str(e)}")


# Create the application lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    startup_manager = AppStartupManager(app.state.container)
    
    # Perform startup
    await startup_manager.startup()
    
    yield
    
    # Perform shutdown
    await startup_manager.shutdown()