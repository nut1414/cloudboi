import React, { useState, useMemo, useCallback } from "react";
import { PlusCircleIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import Button from "../../../components/Common/Button";
import Section from "../../../components/Common/Section";
import InputField from "../../../components/Common/InputField";

// 🧪 Mock hook + email list
const useAddCreditUser = () => {
  return {
    userWallet: { balance: 1234 },
    isLoading: false,
    error: null,
    handleTopUp: async (amount: number | "", email?: string) => {
      console.log("💳 Top-up requested:", { amount, email });
      return true;
    },
    sanitizeNumericInput: (value: string) => value.replace(/\D/g, "")
  };
};

const AddCredit: React.FC = () => {
  const [creditValue, setCreditValue] = useState<number | "">("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");


  const emailList = useMemo(() => [
    "user1@example.com",
    "user2@example.com",
    "admin@cloudboi.com"
  ], []);

  const {
    userWallet,
    isLoading,
    error,
    handleTopUp,
    sanitizeNumericInput
  } = useAddCreditUser();

  const predefinedAmounts = useMemo(() => [
    { value: 100, category: "standard" },
    { value: 200, category: "standard" },
    { value: 500, category: "standard" },
    { value: 1000, category: "standard" },
    { value: 2000, category: "premium" },
    { value: 5000, category: "premium" },
    { value: 10000, category: "premium" },
  ], []);

  const handleInputChange = useCallback((value: string) => {
    const rawValue = sanitizeNumericInput(value);
    setCreditValue(rawValue === "" ? "" : Number(rawValue));
  }, [sanitizeNumericInput]);

  const processTopUp = useCallback(async () => {
    const success = await handleTopUp(creditValue, selectedUserEmail);
    if (success) {
      setCreditValue("");
    }
  }, [creditValue, selectedUserEmail, handleTopUp]);

  const AmountButton = useCallback(({ amount }: { amount: { value: number; category: string } }) => (
    <button
      key={amount.value}
      onClick={() => setCreditValue(amount.value)}
      className={`px-4 py-3 rounded-lg transition-all duration-200 ${creditValue === amount.value
        ? "bg-purple-600 text-white ring-2 ring-purple-600 ring-opacity-50"
        : amount.category === "premium"
          ? "bg-[#2A3F6A] text-gray-200 hover:bg-[#304776]"
          : "bg-[#23375F] text-gray-300 hover:bg-[#2A3F6A]"
        }`}
    >
      {amount.value.toLocaleString()} CBC
    </button>
  ), [creditValue]);

  const TopUpContent = useMemo(() => {
    return (
      <div className="space-y-8">

        {/* Select User Email */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Select User Email</label>
          <select
            className="w-full bg-[#23375F] text-white border border-blue-800/30 rounded-lg p-2"
            value={selectedUserEmail}
            onChange={(e) => setSelectedUserEmail(e.target.value)}
          >
            <option value="" disabled hidden>Select a user email</option>
            {emailList.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>

        </div>

        {/* Current Balance */}
        <div className="bg-[#23375F] rounded-lg shadow border border-blue-800/30 p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Current Balance</p>
            <p className="text-2xl font-bold text-white mt-1">
              {userWallet ? `${userWallet.balance} CBC` : "Loading..."}
            </p>
          </div>
          <CreditCardIcon className="w-8 h-8 text-purple-500" />
        </div>

        {/* Input and Add Credit Button */}
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="relative flex-grow">
              <InputField
                label="Enter Amount"
                value={creditValue.toString()}
                onChange={handleInputChange}
                placeholder="Enter custom amount"
                endIcon={<span className="text-gray-400">CBC</span>}
                sanitizeValue={sanitizeNumericInput}
              />
            </div>

            <Button
              variant="purple"
              label={isLoading ? "Processing..." : "Add Credit"}
              className="py-3 px-6 self-end"
              onClick={processTopUp}
              disabled={
                isLoading ||
                creditValue === "" ||
                Number(creditValue) <= 0 ||
                selectedUserEmail === ""
              }
              
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
              <AmountButton key={amount.value} amount={amount} />
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

        {/* Display error if present */}
        {error && (
          <div className="bg-red-900/20 border border-red-800/30 p-4 rounded-lg text-red-400">
            {error}
          </div>
        )}
      </div>
    );
  }, [
    creditValue,
    selectedUserEmail,
    userWallet,
    isLoading,
    error,
    predefinedAmounts,
    processTopUp,
    handleInputChange,
    sanitizeNumericInput,
    AmountButton,
    emailList
  ]);

  return (
    <Section
      title="Add Credit for a User"
      icon={<PlusCircleIcon className="w-5 h-5" />}
      description="As an administrator, you can top up credit for users in the system."
    >
      {TopUpContent}
    </Section>
  );
};

export default React.memo(AddCredit);
