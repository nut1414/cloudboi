from datetime import datetime
import uuid

from .base_model import BaseModel

class UserSubscription(BaseModel):
    subscription_id: int
    instance_id: uuid.UUID
    next_payment_date: datetime
    next_expire_date: datetime