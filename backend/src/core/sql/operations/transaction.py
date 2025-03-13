from datetime import datetime
from typing import List, Optional
from sqlalchemy import select, insert
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert as pg_insert
import uuid

from .base import BaseOperation
from ..tables.user import User
from ..tables.user_wallet import UserWallet
from ..tables.user_subscription import UserSubscription
from ..tables.transaction import Transaction
from ...models.user import UserInDB as UserModel, UserWallet as UserWalletModel
from ...models.transaction import Transaction as TransactionModel
from ...utils.datetime import DateTimeUtils
from ...constants.transaction_const import TransactionStatus, TransactionType

class TransactionOperation(BaseOperation):
    async def upsert_transaction(self, transaction: TransactionModel) -> TransactionModel:
        if transaction.transaction_id is None:
            transaction.transaction_id = uuid.uuid4()

        stmt = pg_insert(Transaction).values(
            transaction_id=transaction.transaction_id,
            user_id=transaction.user_id,
            reference_id=transaction.reference_id,
            transaction_type=transaction.transaction_type,
            transaction_status=transaction.transaction_status,
            amount=transaction.amount,
            created_at=transaction.created_at,
            last_updated_at=transaction.last_updated_at
        ).on_conflict_do_update(
            index_elements=['transaction_id'],
            set_={
                'user_id': transaction.user_id,
                'reference_id': transaction.reference_id,
                'transaction_type': transaction.transaction_type,
                'transaction_status': transaction.transaction_status,
                'amount': transaction.amount,
                'created_at': transaction.created_at,
                'last_updated_at': transaction.last_updated_at
            }
        ).returning(Transaction)
        result = (await self.db.execute(stmt)).scalar()
        return self.to_pydantic(TransactionModel, result)
    
    async def get_all_user_transactions(self, username: str) -> List[TransactionModel]:
        stmt = select(Transaction).join(User).where(User.username == username)
        result = (await self.db.execute(stmt)).scalars().all()
        return self.to_pydantic(TransactionModel, result)
    
    async def get_transactions_by_reference_ids(
        self,
        reference_ids: List[str],
        transaction_type: Optional[List[TransactionType]] = None,
        transaction_status: Optional[List[TransactionStatus]] = None
    ) -> List[TransactionModel]:
        stmt = select(Transaction).where(Transaction.reference_id.in_(reference_ids))
        if transaction_type is not None:
            stmt = stmt.where(Transaction.transaction_type.in_(transaction_type))
        if transaction_status is not None:
            stmt = stmt.where(Transaction.transaction_status.in_(transaction_status))
        result = (await self.db.execute(stmt)).scalars().all()
        return self.to_pydantic(TransactionModel, result)