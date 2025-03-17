import React from "react";

interface PaymentSummaryProps {
  title: string;
  amount: number;
  label: string;
  textColorClass: string;
}

const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-US").format(amount);
  };

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ title, amount, label, textColorClass }) => (
  <div className={`flex flex-col ${textColorClass}`}>
    <p className="ml-2 text-xs self-start font-bold">{title}</p>
    <div className="mt-4 flex items-center">
      <p className="ml-6 text-3xl">{formatAmount(amount)}</p>
      <p className="mt-3 text-sm">{label}</p>
    </div>
  </div>
);

export default PaymentSummary;
