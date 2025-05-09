from datetime import datetime
from typing import Callable, List, Optional, Tuple, AsyncContextManager
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert as pg_insert
import uuid

from .base import BaseOperation
from ..tables.user import User
from ..tables.user_wallet import UserWallet
from ..tables.user_subscription import UserSubscription
from ..tables.transaction import Transaction
from ..tables.user_instance import UserInstance
from ...models.user import UserInDB as UserModel, UserWallet as UserWalletModel
from ...models.transaction import Transaction as TransactionModel
from ...constants.transaction_const import TransactionStatus, TransactionType


class TransactionOperation(BaseOperation):
    async def upsert_transaction(self, transaction: TransactionModel) -> TransactionModel:
        async with self.session() as db:
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
            result = (await db.execute(stmt)).scalar()
            return self.to_pydantic(TransactionModel, result)
    
    async def update_transaction_and_user_wallet(
            self,
            transaction: TransactionModel,
            update_balance_func: Callable[[UserWalletModel, TransactionModel], Tuple[UserWalletModel, TransactionModel]]
    ) -> Tuple[UserWalletModel, TransactionModel]:
        async with self.session() as db, db.begin():
            wallet_stmt = select(UserWallet).where(UserWallet.user_id == transaction.user_id).with_for_update()
            wallet = (await db.execute(wallet_stmt)).scalar_one()

            updated_wallet, updated_transaction = update_balance_func(
                self.to_pydantic(UserWalletModel, wallet),
                transaction
            )

            # Update wallet directly in the current session
            wallet_update = update(UserWallet).where(
                UserWallet.user_id == updated_wallet.user_id
            ).values(
                balance=updated_wallet.balance,
                last_updated_at=updated_wallet.last_updated_at
            ).returning(UserWallet)
            result_wallet = (await db.execute(wallet_update)).scalar_one()
            
            # Update transaction directly in the current session
            transaction_update = update(Transaction).where(
                Transaction.transaction_id == updated_transaction.transaction_id
            ).values(
                transaction_status=updated_transaction.transaction_status,
                last_updated_at=updated_transaction.last_updated_at
            ).returning(Transaction)
            result_transaction = (await db.execute(transaction_update)).scalar_one()
            
            return (
                self.to_pydantic(UserWalletModel, result_wallet),
                self.to_pydantic(TransactionModel, result_transaction)
            )
    
    async def delete_subscription_transaction(self, subscription_id: int) -> Optional[TransactionModel]:
        async with self.session() as db:
            reference_id = f"subscription_{subscription_id}"
            stmt = delete(Transaction).where(
                Transaction.reference_id == reference_id,
                Transaction.transaction_status == TransactionStatus.SCHEDULED,
                Transaction.transaction_type == TransactionType.SUBSCRIPTION_PAYMENT
            ).returning(Transaction)
            result = (await db.execute(stmt)).scalar_one_or_none()
            return self.to_pydantic(TransactionModel, result)
    
    async def get_all_user_transactions(self, username: str) -> List[TransactionModel]:
        async with self.session() as db:
            stmt = select(Transaction).join(User).where(User.username == username)
            result = (await db.execute(stmt)).scalars().all()
            return self.to_pydantic(TransactionModel, result)
    
    async def get_all_transactions(self) -> List[TransactionModel]:
        async with self.session() as db:
            stmt = select(Transaction)
            result = (await db.execute(stmt)).scalars().all()
            return self.to_pydantic(TransactionModel, result)
    
    async def get_all_transactions_with_details(self) -> List[Tuple[Transaction, User, Optional[UserInstance]]]:
        async with self.session() as db:
            # Join with User to get username
            stmt = select(Transaction, User).join(User, Transaction.user_id == User.user_id)
            result = (await db.execute(stmt)).all()
            
            # Process each transaction to fetch related instance info if needed
            detailed_transactions = []
            for transaction, user in result:
                instance = None
                # Only for subscription payments, extract subscription_id and find the instance
                if transaction.transaction_type == TransactionType.SUBSCRIPTION_PAYMENT:
                    # Extract subscription ID from reference_id (format: "subscription_{subscription_id}")
                    if transaction.reference_id.startswith("subscription_"):
                        subscription_id = int(transaction.reference_id.split("_")[1])
                        # Get the subscription and related instance
                        subscription_stmt = select(UserSubscription, UserInstance).join(
                            UserInstance, 
                            UserSubscription.instance_id == UserInstance.instance_id
                        ).where(UserSubscription.subscription_id == subscription_id)
                        subscription_result = (await db.execute(subscription_stmt)).first()
                        if subscription_result:
                            _, instance = subscription_result
                
                detailed_transactions.append((transaction, user, instance))
            
            return detailed_transactions
    
    async def get_transactions_by_reference_ids(
        self,
        reference_ids: List[str],
        transaction_type: Optional[List[TransactionType]] = None,
        transaction_status: Optional[List[TransactionStatus]] = None
    ) -> List[TransactionModel]:
        async with self.session() as db:
            stmt = select(Transaction).where(Transaction.reference_id.in_(reference_ids))
            if transaction_type is not None:
                stmt = stmt.where(Transaction.transaction_type.in_(transaction_type))
            if transaction_status is not None:
                stmt = stmt.where(Transaction.transaction_status.in_(transaction_status))
            result = (await db.execute(stmt)).scalars().all()
            return self.to_pydantic(TransactionModel, result)