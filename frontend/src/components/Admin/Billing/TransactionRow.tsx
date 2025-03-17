// src/components/admin/Billing/TransactionRow.tsx
import React from "react";
import { BillingTransaction } from "../../../tmp/type";

interface TransactionRowProps {
  transaction: BillingTransaction;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => (
  <div className="grid grid-cols-6 text-black text-md bg-red-300 mt-1 border-b py-2 px-4">
    <span className="text-center">{transaction.date}</span>
    <span className="text-center">{transaction.username}</span>
    <span className="text-center">{transaction.type}</span>
    <span
      className={`ml-8 text-center font-semibold ${
        transaction.status === "success"
          ? "text-green-600"
          : transaction.status === "cancel"
          ? "text-red-700"
          : "text-gray-600"
      }`}
    >
      {transaction.status}
    </span>
    <span className="text-center">
      {transaction.amount} CBCs
    </span>
    <button className="bg-[#D5C6E0] shadow-md text-black py-2 rounded-2xl">
      View Instance
    </button>
  </div>
);

export default TransactionRow;
