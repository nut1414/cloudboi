import React, { useState, useCallback } from "react"
import TopNavbar from "../../components/Common/Navbar/TopNavbar"
import PageContainer from "../../components/Layout/PageContainer"
import { BanknotesIcon, MagnifyingGlassIcon, ChartBarIcon } from "@heroicons/react/24/outline"
import Table from "../../components/Common/Table"
import { TableColumn } from "../../components/Common/Table"
import InputField from "../../components/Common/InputField"
import Button from "../../components/Common/Button/Button"
import { useAdminBilling } from "../../hooks/Admin/useAdminBilling"
import StatusBadge from "../../components/Common/StatusBadge"
import { AdminTransactionResponse } from "../../client/types.gen"
import { formatDateTimeSimple } from "../../utils/dateTime"
import Section from "../../components/Common/Section"
import TransactionAmount from "../../components/Common/TransactionAmount"
import { TransactionType } from "../../constant/TransactionConstant"
import BillingStatsVisualizer from "../../components/Admin/BillingStatsVisualizer"
import DateRangePicker from "../../components/Common/DateRangePicker"

// SearchBar component
interface SearchBarProps {
    placeholder?: string
    onSearch?: (query: string) => void
    className?: string
    initialValue?: string
    width?: string
}

const SearchBar: React.FC<SearchBarProps> = React.memo(({
    placeholder = "Search transactions...",
    onSearch = () => { },
    className = "",
    initialValue = "",
    width = "w-64",
}) => {
    const [query, setQuery] = useState(initialValue)

    const handleInputChange = useCallback((newQuery: string) => {
        setQuery(newQuery)
        onSearch(newQuery)
    }, [onSearch])

    return (
        <div className={`${className} ${width}`}>
            <InputField
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder}
                endIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
            />
        </div>
    )
})

const AdminBillingPage: React.FC = () => {
    const {
        adminBillingStats,
        allTransactions,
        isLoading,
        handleSearch,
        handleViewInstance,
        isAllTime,
        dateRange,
        toggleTimeRange,
        updateDateRange,
        fetchBillingStats
    } = useAdminBilling()

    // Define columns for the transactions table
    const columns: TableColumn<AdminTransactionResponse>[] = [
        {
            key: 'date',
            label: 'Date',
            render: (transaction) => formatDateTimeSimple(transaction.last_updated_at)
        },
        {
            key: 'username',
            label: 'Username',
            render: (transaction) => transaction.username
        },
        {
            key: 'instance_name',
            label: 'Instance Name',
            render: (transaction) => transaction.instance_name ?? '-'
        },
        {
            key: 'transaction_type',
            label: 'Type',
            render: (transaction) => transaction.transaction_type === 'TOP_UP' ? 'Top-up' : 'Subscription'
        },
        {
            key: 'transaction_status',
            label: 'Status',
            render: (transaction) => <StatusBadge status={transaction.transaction_status} />
        },
        {
            key: 'amount',
            label: 'Amount',
            render: (transaction) => (
                <TransactionAmount 
                    amount={transaction.amount}
                    transactionType={transaction.transaction_type}
                />
            )
        },
        {
            key: 'actions',
            label: '',
            render: (transaction) => (
                transaction.transaction_type === TransactionType.SUBSCRIPTION_PAYMENT ?
                    <Button
                        label="View Instance"
                        variant="secondary"
                        onClick={() => handleViewInstance(transaction.username, transaction.instance_name || '')}
                        size="small"
                    /> : <></>
            )
        }
    ]

    // Define navbar sections
    const leftSection = (
        <SearchBar
            onSearch={handleSearch}
            width="w-56 md:w-64 lg:w-80"
            placeholder="Search by username, type, status..."
        />
    )

    const rightSection = (
        <div className="flex items-center gap-3">
            <Button
                label="Export Data"
                variant="secondary"
                onClick={() => console.log('Export data')}
            />
        </div>
    )


    return (
        <>
            <TopNavbar
                leftSection={leftSection}
                rightSection={rightSection}
                variant="default"
                stickyTop={true}
            />
            <PageContainer
                title="Billing"
                subtitle="Manage billing and transactions"
                subtitleIcon={<BanknotesIcon className="w-4 h-4" />}
                maxWidth="max-w-[1400px]"
            >
                
                {/* Billing Stats Visualization */}
                <Section 
                    title="Billing Statistics" 
                    icon={<ChartBarIcon className="w-5 h-5" />}
                    description="Overview of transaction values by type and status"
                    className="bg-[#12203c] border-blue-900/20 mb-6"
                >
                    <DateRangePicker 
                        isAllTime={isAllTime}
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                        onToggleTimeRange={toggleTimeRange}
                        onDateRangeChange={updateDateRange}
                        onApplyFilter={fetchBillingStats}
                        className="mb-6"
                    />
                    <BillingStatsVisualizer 
                        billingStats={adminBillingStats}
                        isLoading={isLoading}
                    />
                </Section>
                
                {/* Transactions Table Section */}
                <Section 
                    title="All Transactions" 
                    icon={<BanknotesIcon className="w-5 h-5" />}
                    description="View all transactions and billing history"
                    className="bg-[#12203c] border-blue-900/20"
                >
                    <Table
                        columns={columns}
                        data={allTransactions || []}
                        isLoading={isLoading && !allTransactions?.length}
                        emptyStateMessage="No transactions found"
                        keyExtractor={(transaction) => transaction.transaction_id}
                        unit="transaction"
                    />
                </Section>
            </PageContainer>
        </>
    )
}

export default AdminBillingPage
