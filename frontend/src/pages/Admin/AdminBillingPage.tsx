import React, { useState } from "react"
import TopNavbar from "../../components/Common/Navbar/TopNavbar"
import PageContainer from "../../components/Layout/PageContainer"
import { BanknotesIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import Table from "../../components/Common/Table"
import { TableColumn } from "../../components/Common/Table"
import InputField from "../../components/Common/InputField"
import Button from "../../components/Common/Button/Button"
import { useAdminBilling } from "../../hooks/Admin/useAdminBilling"
import StatusBadge from "../../components/Common/StatusBadge"
import { Transaction } from "../../client/types.gen"
import { formatDateTime } from "../../utils/dateTime"
import Section from "../../components/Common/Section"
import TransactionAmount from "../../components/Common/TransactionAmount"

// SearchBar component
interface SearchBarProps {
    placeholder?: string
    onSearch?: (query: string) => void
    className?: string
    initialValue?: string
    width?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search transactions...",
    onSearch = () => { },
    className = "",
    initialValue = "",
    width = "w-64",
}) => {
    const [query, setQuery] = useState(initialValue)

    const handleInputChange = (newQuery: string) => {
        setQuery(newQuery)
        onSearch(newQuery)
    }

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
}

const AdminBillingPage: React.FC = () => {
    const {
        adminBillingStats,
        allTransactions,
        isLoading,
        error,
        handleSearch,
        isAllTime,
        dateRange,
        toggleTimeRange,
        updateDateRange,
        fetchBillingStats
    } = useAdminBilling()

    // Define columns for the transactions table
    const columns: TableColumn<Transaction>[] = [
        {
            key: 'date',
            label: 'Date',
            render: (transaction) => formatDateTime(transaction.last_updated_at)
        },
        {
            key: 'user_id',
            label: 'Username'
        },
        {
            key: 'transaction_type',
            label: 'Type',
            render: (transaction) => {
                const type = transaction.transaction_type
                return type === 'TOP_UP' ? 'Top-up' : 'Subscription'
            }
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
            label: 'Actions',
            render: (transaction) => (
                <div className="flex space-x-2">
                    <Button
                        label="View"
                        variant="secondary"
                        onClick={() => console.log('View transaction', transaction.transaction_id)}
                        size="small"
                    />
                </div>
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
                label="Refresh Data"
                variant="outline"
                onClick={() => fetchBillingStats()}
                className="mr-2"
            />
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
                
                {/* Transactions Table Section */}
                <Section 
                    title="All Transactions" 
                    icon={<BanknotesIcon className="w-5 h-5" />}
                >
                    <Table
                        columns={columns}
                        data={allTransactions || []}
                        isLoading={isLoading && !allTransactions?.length}
                        emptyStateMessage="No transactions found"
                        keyExtractor={(transaction) => transaction.transaction_id || transaction.reference_id}
                        unit="transaction"
                    />
                </Section>
            </PageContainer>
        </>
    )
}

export default AdminBillingPage
