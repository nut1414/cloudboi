from dataclasses import dataclass
from enum import Enum, auto

class Currency:
    NAME = "CloudBoi Digital Currency"
    SYMBOL = "CBC"
    PRECISION = 4

class TransactionType(str, Enum):
    TOP_UP = "TOP_UP"
    SUBSCRIPTION_PAYMENT = "SUBSCRIPTION_PAYMENT"

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