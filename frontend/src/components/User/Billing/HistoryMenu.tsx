// components/User/Billing/HistoryMenu/HistoryMenu.tsx
import React from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import Table from "../../Common/Table";
import { TransactionStatusType } from "../../Common/StatusBadge";
import { TransactionStatus } from "../../../constant/TransactionConstant";
import StatusBadge from "../../Common/StatusBadge";

interface Transaction {
    id: string;
    date: string;
    type: string;
    amount: number;
    status: TransactionStatusType;
}

const HistoryMenu: React.FC = () => {
    const transactions: Transaction[] = [
        { id: "tx-001", date: "2023-05-15", type: "Top Up", amount: 500, status: TransactionStatus.SUCCESS },
        { id: "tx-002", date: "2023-05-01", type: "Usage", amount: -120, status: TransactionStatus.PAID },
        { id: "tx-003", date: "2023-04-15", type: "Top Up", amount: 1000, status: TransactionStatus.SUCCESS },
        { id: "tx-004", date: "2023-04-10", type: "Top Up", amount: 200, status: TransactionStatus.PENDING },
        { id: "tx-005", date: "2023-03-20", type: "Subscription", amount: -250, status: TransactionStatus.SCHEDULED },
        { id: "tx-006", date: "2023-03-15", type: "Top Up", amount: 100, status: TransactionStatus.FAILED }
    ];

    const columns = [
        { key: "date", label: "Date" },
        { key: "type", label: "Transaction Type" },
        {
            key: "amount",
            label: "Amount",
            render: (item: Transaction) => (
                <span className={item.amount > 0 ? "text-green-400" : "text-red-400"}>
                    {item.amount > 0 ? "+" : ""}{item.amount} CBC
                </span>
            )
        },
        {
            key: "status",
            label: "Status",
            render: (item: Transaction) => (
                <StatusBadge status={item.status} />
            )
        },
    ];

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
                data={transactions}
                emptyStateMessage="No transactions found"
                unit="transaction"
            />
        </>
    );
};

export default HistoryMenu;
