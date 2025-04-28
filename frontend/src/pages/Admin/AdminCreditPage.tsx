import React, { useMemo } from "react"
import { CurrencyDollarIcon, PlusCircleIcon } from "@heroicons/react/24/outline"
import Button from "../../components/Common/Button/Button"
import InputField from "../../components/Common/InputField"
import OptionButton from "../../components/Common/Button/OptionButton"
import { CURRENCY } from "../../constant/CurrencyConstant"
import { useAdminCredit } from "../../hooks/Admin/useAdminCredit"
import PageContainer from "../../components/Layout/PageContainer"
import Dropdown from "../../components/Common/Dropdown"
import Section from "../../components/Common/Section"

const AdminCreditPage: React.FC = () => {
  const {
    username,
    creditValue,
    isLoading,
    error,
    successMessage,
    predefinedAmounts,
    searchQuery,
    users,
    handleInputChange,
    processCredit,
    handleSearch,
    handleSelectUser
  } = useAdminCredit()

  const userOptions = useMemo(() => {
    return users.map(user => ({
      value: user.user_id,
      label: user.username,
      sublabel: user.email
    }))
  }, [users])

  const CreditContent = useMemo(() => {
    return (
      <Section
        title="Add Credit to User Account"
        icon={<PlusCircleIcon className="w-5 h-5" />}
        description="Add credit to user accounts"
        className="space-y-8"
      >
        {/* User Search Dropdown */}
        <div className="space-y-4">
          <Dropdown
            options={userOptions}
            value={username}
            onChange={(userId) => {
              const selectedUser = users.find(u => u.user_id === userId)
              if (selectedUser) {
                handleSelectUser(selectedUser)
              }
            }}
            onSearch={handleSearch}
            placeholder="Select a user"
            searchPlaceholder="Search users by username or email"
          />
          {username && (
            <div className="bg-[#23375F] rounded-lg p-4 border border-blue-800/30">
              <p className="text-gray-400">Selected User</p>
              <p className="text-white font-medium">{username}</p>
            </div>
          )}
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
              />
            </div>

            <Button
              variant="purple"
              label={isLoading ? "Processing..." : "Add Credit"}
              className="py-3 px-6 self-end"
              onClick={processCredit}
              disabled={isLoading || creditValue === "" || Number(creditValue) <= 0 || !username.trim()}
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
                onClick={() => handleInputChange(amount.toString())}
              />
            ))}
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-900/20 border border-green-800/30 p-4 rounded-lg text-green-400">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-800/30 p-4 rounded-lg text-red-400">
            {error}
          </div>
        )}
      </Section>
    )
  }, [username, creditValue, isLoading, error, successMessage, predefinedAmounts, userOptions, handleSearch, handleSelectUser, handleInputChange, processCredit])

  return (
    <PageContainer
      title="Credit Management"
      subtitle="Manage users credits"
      subtitleIcon={<CurrencyDollarIcon className="w-6 h-6" />}
    >
      {CreditContent}
    </PageContainer>
  )
}

export default React.memo(AdminCreditPage) 