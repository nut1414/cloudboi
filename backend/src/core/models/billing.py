import uuid
from .base_model import BaseModel

class UpcomingPayment(BaseModel):
    sum_amount: float
    total_subscription: int
    earliest_due_date: str

class AllTimePayment(BaseModel):
    sum_amount: float
    total_cycle: int
    last_payment_date: str

class UserBillingOverview(BaseModel):
    upcoming_payment: UpcomingPayment
    all_time_payment: AllTimePayment

class UserBillingOverviewResponse(UserBillingOverview):
    username: str

class UserTopUpRequest(BaseModel):
    amount: float

class UserTopUpResponse(BaseModel):
    transaction_id: uuid.UUID
    transaction_type: str
    transaction_status: str
    amount: float
    created_at: str
    last_updated_at: str