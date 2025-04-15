import React, { useMemo } from "react"
import { CurrencyDollarIcon, PlusCircleIcon } from "@heroicons/react/24/outline"
import Button from "../../components/Common/Button/Button"
import InputField from "../../components/Common/InputField"
import OptionButton from "../../components/Common/Button/OptionButton"
import { CURRENCY } from "../../constant/CurrencyConstant"
import { useAdminCredit } from "../../hooks/Admin/useAdminCredit"
import PageContainer from "../../components/Layout/PageContainer"
import SearchBar from "../../components/Common/SearchBar"
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

  const CreditContent = useMemo(() => {
    return (
      <Section
        title="Add Credit to User Account"
        icon={<PlusCircleIcon className="w-5 h-5" />}
        description="Add credit to user accounts"
        className="space-y-8"
      >
        {/* User Search */}
        <div className="space-y-4">
          <div className="relative">
            <SearchBar
              initialValue={searchQuery}
              onSearch={handleSearch}
              placeholder="Search users by username or email"
            />
            {users.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-[#1B2B4E] rounded-lg border border-blue-800/30 shadow-lg">
                <ul className="py-2">
                  {users.map((user) => (
                    <li
                      key={user.user_id}
                      className="px-4 py-2 hover:bg-blue-800/20 cursor-pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="flex flex-col">
                        <span className="text-white">{user.username}</span>
                        <span className="text-gray-400 text-sm">{user.email}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
  }, [username, creditValue, isLoading, error, successMessage, predefinedAmounts, searchQuery, users, handleSearch, handleSelectUser, handleInputChange, processCredit])

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