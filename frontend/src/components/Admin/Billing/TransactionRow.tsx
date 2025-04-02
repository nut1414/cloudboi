// TransactionRow.tsx
import React from "react";
import { BillingTransaction } from "../../../tmp/type";

interface TransactionRowProps {
  transaction: BillingTransaction;
  onViewInstance: (transaction: BillingTransaction) => void;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction, onViewInstance }) => {
  return (
    <div className="grid grid-cols-6 text-gray-300 text-md bg-[#23375F] mt-1 py-2 px-4">
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
      <button
        onClick={() => onViewInstance(transaction)}
        className="bg-purple-600 shadow-md text-white py-2 rounded-2xl text-center hover:bg-purple-700 transition-colors duration-300"
      >
        View Instance
      </button>
    </div>
  );
};

export default TransactionRow;
