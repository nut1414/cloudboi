from datetime import datetime
from typing import Optional
import uuid
from .base_model import BaseModel

from ..constants.transaction_const import TransactionType, TransactionStatus

class Transaction(BaseModel):
    transaction_id: Optional[uuid.UUID] = None
    user_id: uuid.UUID
    reference_id: str
    transaction_type: TransactionType
    transaction_status: TransactionStatus
    amount: float
    created_at: Optional[datetime] = None
    last_updated_at: datetime