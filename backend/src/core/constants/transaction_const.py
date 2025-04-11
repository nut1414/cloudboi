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

# Mapping of transaction types to their valid statuses
TRANSACTION_TYPE_TO_STATUS = {
    TransactionType.TOP_UP: [
        TransactionStatus.PENDING,
        TransactionStatus.FAILED,
        TransactionStatus.SUCCESS
    ],
    TransactionType.SUBSCRIPTION_PAYMENT: [
        TransactionStatus.SCHEDULED,
        TransactionStatus.PAID,
        TransactionStatus.OVERDUE,
        TransactionStatus.EXPIRED
    ]
}