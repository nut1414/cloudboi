from enum import Enum


class TransactionType(str, Enum):
    SUBSCRIPTION_PAYMENT = "subscription_payment"
    TOP_UP = "top_up"
    
class TransactionStatus(str, Enum):
    # Top-up transaction statuses
    PENDING = "pending"
    FAILED = "failed"
    SUCCESS = "success"
    # Subscription payment transaction statuses
    SCHEDULED = "scheduled"
    PAID = "paid"
    OVERDUE = "overdue"
    EXPIRED = "expired"