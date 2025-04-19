import React, { useState, useMemo, useCallback } from "react"
import { PlusCircleIcon, CreditCardIcon } from "@heroicons/react/24/outline"
import Button from "../../Common/Button/Button"
import Section from "../../Common/Section"
import InputField from "../../Common/InputField"
import OptionButton from "../../Common/Button/OptionButton" // Import the new component
import { useUserBilling } from "../../../hooks/User/useUserBilling"
import { CURRENCY } from "../../../constant/CurrencyConstant"

const TopUpMenu: React.FC = () => {
  const [creditValue, setCreditValue] = useState<number | "">("")
  const {
    userWallet,
    isLoading,
    handleTopUp,
    sanitizeNumericInput
  } = useUserBilling()

  // Memoize predefined amounts to prevent recreation on each render
  const predefinedAmounts = useMemo(() => [100, 200, 500, 1000, 2000, 5000, 10000], [])

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    const rawValue = sanitizeNumericInput(value)
    setCreditValue(rawValue === "" ? "" : Number(rawValue))
  }, [sanitizeNumericInput])

  // Process top-up request
  const processTopUp = useCallback(async () => {
    const success = await handleTopUp(creditValue)
    if (success) {
      setCreditValue("")
    }
  }, [creditValue, handleTopUp])

  // Memoize the entire top-up content to avoid unnecessary re-renders
  const TopUpContent = useMemo(() => {
    return (
      <div className="space-y-8">
        {/* Current Balance */}
        <div className="bg-[#23375F] rounded-lg shadow border border-blue-800/30 p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Current Balance</p>
            <p className="text-2xl font-bold text-white mt-1">
              {userWallet ? `${userWallet.balance} ${CURRENCY.SYMBOL}` : "Loading..."}
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
                endIcon={<span className="text-gray-400">{CURRENCY.SYMBOL}</span>}
                sanitizeValue={sanitizeNumericInput}
              />
            </div>

            <Button
              variant="purple"
              label={isLoading ? "Processing..." : "Add Credit"}
              className="py-3 px-6 self-end" // aligned to bottom to match input field position
              onClick={processTopUp}
              disabled={isLoading || creditValue === "" || Number(creditValue) <= 0}
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
              <OptionButton
                key={amount}
                label={amount}
                unit={CURRENCY.SYMBOL}
                variant="prominent"
                isSelected={creditValue === amount}
                onClick={() => setCreditValue(amount)}
              />
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-[#23375F]/70 rounded-lg border border-blue-800/30 p-4">
          <div className="flex justify-between items-center text-gray-300 mb-2">
            <p>Selected Amount</p>
            <p>{creditValue ? `${Number(creditValue).toLocaleString()} ${CURRENCY.SYMBOL}` : '-'}</p>
          </div>
          <div className="flex justify-between items-center text-gray-300 mb-4">
            <p>Processing Fee</p>
            <p>{creditValue ? `0 ${CURRENCY.SYMBOL}` : '-'}</p>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-blue-800/30">
            <p className="font-medium text-white">Total</p>
            <p className="font-bold text-white">{creditValue ? `${Number(creditValue).toLocaleString()} ${CURRENCY.SYMBOL}` : '-'}</p>
          </div>
        </div>
      </div>
    )
  }, [
    creditValue,
    userWallet,
    isLoading,
    predefinedAmounts,
    processTopUp,
    handleInputChange,
    sanitizeNumericInput
  ])

  return (
    <Section
      title="Add Credit to Your Account"
      icon={<PlusCircleIcon className="w-5 h-5" />}
      description="Top up your account balance to continue using our services."
    >
      {TopUpContent}
    </Section>
  )
}

export default React.memo(TopUpMenu)