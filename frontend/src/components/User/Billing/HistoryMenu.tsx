// components/User/Billing/HistoryMenu/HistoryMenu.tsx
import React, { useEffect } from "react"
import { ClockIcon } from "@heroicons/react/24/outline"
import Table, { TableColumn } from "../../Common/Table"
import { UserTransactionResponse } from "../../../client"
import StatusBadge from "../../Common/StatusBadge"
import { useUserBilling } from "../../../hooks/User/useUserBilling"
import TransactionAmount from "../../Common/TransactionAmount"

const HistoryMenu: React.FC = () => {
    const {
        userTransactions,
        formatTransactionType
    } = useUserBilling()

    const columns: TableColumn<UserTransactionResponse>[] = [
        {
            key: "created_at",
            label: "Date",
            render: (item) => item.created_at
        },
        {
            key: "transaction_type",
            label: "Transaction Type",
            render: (item) => formatTransactionType(item.transaction_type)
        },
        {
            key: "amount",
            label: "Amount",
            render: (item) => (
                <TransactionAmount 
                    amount={item.amount} 
                    transactionType={item.transaction_type} 
                />
            )
        },
        {
            key: "transaction_status",
            label: "Status",
            render: (item) => (
                <StatusBadge status={item.transaction_status} />
            )
        },
    ]

    return (
        <>
            <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-200 flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-purple-500" />
                    Transaction History
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                    View your recent transactions and billing history.
                </p>
            </div>

            <Table
                columns={columns}
                data={userTransactions || []}
                emptyStateMessage="No transactions found"
                unit="transaction"
                data-testid="history-menu"
            />
        </>
    )
}

export default React.memo(HistoryMenu)