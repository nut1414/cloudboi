// components/User/Billing/TopUpMenu/TopUpMenu.tsx
import React, { useState, useMemo } from "react";
import { PlusCircleIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import Button from "../../Common/Button";
import Section from "../../Common/Section";

const TopUpMenu: React.FC = () => {
  const [creditValue, setCreditValue] = useState<number | "">("");
  
  // Consolidate predefined amounts into a single array with categories
  const predefinedAmounts = useMemo(() => [
    { value: 100, category: "standard" },
    { value: 200, category: "standard" },
    { value: 500, category: "standard" },
    { value: 1000, category: "standard" },
    { value: 2000, category: "premium" },
    { value: 5000, category: "premium" },
    { value: 10000, category: "premium" },
  ], []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setCreditValue(rawValue === "" ? "" : Number(rawValue));
  };

  const TopUpContent = useMemo(() => {
    return (
      <div className="space-y-8">
        {/* Current Balance */}
        <div className="bg-[#23375F] rounded-lg shadow border border-blue-800/30 p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Current Balance</p>
            <p className="text-2xl font-bold text-white mt-1">1000 CBC</p>
          </div>
          <CreditCardIcon className="w-8 h-8 text-purple-500" />
        </div>
        
        {/* Input and Add Credit Button */}
        <div className="space-y-4">
          <label className="text-gray-300 text-sm font-medium">Enter Amount</label>
          <div className="flex space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={creditValue}
                onChange={handleInputChange}
                placeholder="Enter custom amount"
                className="w-full bg-[#23375F] border border-blue-800/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <span className="absolute right-4 top-3 text-gray-400">CBC</span>
            </div>
            
            <Button
              variant="purple"
              label="Add Credit"
              className="py-3 px-6"
              onClick={() => console.log("Top-up clicked with amount:", creditValue)}
            />
          </div>
        </div>
        
        {/* Quick Selection */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-gray-300 text-sm font-medium">Quick Selection</h4>
            <div className="h-px flex-grow bg-blue-800/30 ml-4"></div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount.value}
                onClick={() => setCreditValue(amount.value)}
                className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                  creditValue === amount.value 
                    ? "bg-purple-600 text-white ring-2 ring-purple-600 ring-opacity-50" 
                    : amount.category === "premium"
                      ? "bg-[#2A3F6A] text-gray-200 hover:bg-[#304776]"
                      : "bg-[#23375F] text-gray-300 hover:bg-[#2A3F6A]"
                }`}
              >
                {amount.value.toLocaleString()} CBC
              </button>
            ))}
          </div>
        </div>
        
        {/* Payment Summary */}
        <div className="bg-[#23375F]/70 rounded-lg border border-blue-800/30 p-4">
          <div className="flex justify-between items-center text-gray-300 mb-2">
            <p>Selected Amount</p>
            <p>{creditValue ? `${Number(creditValue).toLocaleString()} CBC` : '-'}</p>
          </div>
          <div className="flex justify-between items-center text-gray-300 mb-4">
            <p>Processing Fee</p>
            <p>{creditValue ? '0 CBC' : '-'}</p>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-blue-800/30">
            <p className="font-medium text-white">Total</p>
            <p className="font-bold text-white">{creditValue ? `${Number(creditValue).toLocaleString()} CBC` : '-'}</p>
          </div>
        </div>
      </div>
    );
  }, [creditValue, predefinedAmounts]);

  return (
    <Section 
      title="Add Credit to Your Account"
      icon={<PlusCircleIcon className="w-5 h-5" />}
      description="Top up your account balance to continue using our services."
    >
      {TopUpContent}
    </Section>
  );
};

export default TopUpMenu;