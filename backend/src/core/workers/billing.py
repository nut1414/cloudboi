from fastapi import Depends
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from ..service.subscription import SubscriptionService
from ..utils.logging import logger
from ..config import BillingConfig
from ..utils.permission import worker_context


class BillingWorker:
    def __init__(
        self,
        subscription_service: SubscriptionService
    ):
        self.subscription_service = subscription_service
        self.scheduler = AsyncIOScheduler()
        self._is_running = False
    
    @property
    def is_running(self):
        return self._is_running

    async def overdue_subscriptions_job(self):
        """Process all overdue subscriptions by attempting to bill them again."""
        try:
            # Use worker context to bypass normal authentication
            with worker_context():
                overdues = await self.subscription_service.get_overdue_subscriptions()
                if not overdues:
                    logger.info("No overdue subscriptions found")
                    return
                await self.subscription_service.process_overdue_subscriptions(overdues)
                logger.info("Finished processing overdue subscriptions")
        except Exception as e:
            logger.error(f"Error processing overdue subscriptions: {str(e)}")

    async def expired_subscriptions_job(self):
        """Process all expired subscriptions by applying penalties."""
        try:
            logger.info("Processing expired subscriptions")
            # Use worker context to bypass normal authentication
            with worker_context():
                expireds = await self.subscription_service.get_expired_subscriptions()
                if not expireds:
                    logger.info("No expired subscriptions found")
                    return
                await self.subscription_service.process_expired_subscriptions(expired_subscriptions=expireds)
                logger.info("Finished processing expired subscriptions")
        except Exception as e:
            logger.error(f"Error processing expired subscriptions: {str(e)}")

    def start(self):
        """Start the billing worker with scheduled jobs."""
        if self._is_running:
            logger.warning("Billing worker is already running")
            return

        try:
            # Schedule job to process overdue subscriptions
            self.scheduler.add_job(
                self.overdue_subscriptions_job,
                trigger=IntervalTrigger(minutes=BillingConfig.OVERDUE_CHECK_INTERVAL_MINUTES),
                id="overdue_subscriptions_job",
                misfire_grace_time=5,
                max_instances=BillingConfig.OVERDUE_MAX_INSTANCES,
                replace_existing=True
            )

            # Schedule job to process expired subscriptions
            self.scheduler.add_job(
                self.expired_subscriptions_job,
                trigger=IntervalTrigger(minutes=BillingConfig.EXPIRE_CHECK_INTERVAL_MINUTES),
                id="expired_subscriptions_job",
                misfire_grace_time=5,
                max_instances=BillingConfig.EXPIRE_MAX_INSTANCES,
                replace_existing=True
            )

            # Start the scheduler
            self.scheduler.start()
            self._is_running = True
            logger.info("Billing worker started successfully")
        except Exception as e:
            logger.error(f"Failed to start billing worker: {str(e)}")

    def stop(self):
        """Stop the billing worker."""
        if not self._is_running:
            logger.warning("Billing worker is not running")
            return

        try:
            self.scheduler.shutdown()
            self._is_running = False
            logger.info("Billing worker stopped successfully")
        except Exception as e:
            logger.error(f"Failed to stop billing worker: {str(e)}")