from enum import Enum


class TransactionType(str, Enum):
    SUBSCRIPTION_PAYMENT = "SUBSCRIPTION_PAYMENT"
    TOP_UP = "TOP_UP"
    
class TransactionStatus(str, Enum):
    # Top-up transaction statuses
    PENDING = "PENDING"
    FAILED = "FAILED"
    SUCCESS = "SUCCESS"
    # Subscription payment transaction statuses
    SCHEDULED = "SCHEDULED"
    PAID = "PAID"
    OVERDUE = "OVERDUE"
    EXPIRED = "EXPIRED"