// TransactionTable.tsx
import React from "react";
import TransactionRow from "./TransactionRow";
import { BillingTransaction } from "../../../tmp/type";

interface TransactionTableProps {
  instances: BillingTransaction[];
  onViewInstance: (transaction: BillingTransaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ instances, onViewInstance }) => (
  <div className="mt-[5vh] pb-16 mb-10 shadow-md justify-center w-[900px] bg-[#192A51] rounded-2xl">
    <div className="ml-16 justify-center grid grid-cols-6 text-white text-lg pt-4 pb-6 font-semibold">
      <span>Date</span>
      <span>Username</span>
      <span>Type</span>
      <span>Status</span>
      <span>Amount</span>
      <span></span>
    </div>
    <div className="max-h-[600px] overflow-y-auto">
      {instances.length > 0 ? (
        instances.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} onViewInstance={onViewInstance} />
        ))
      ) : (
        <p className="text-center text-gray-500 mt-4">No matching results found.</p>
      )}
    </div>
  </div>
);

export default TransactionTable;
