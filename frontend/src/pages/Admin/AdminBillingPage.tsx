import React, { useState, useCallback } from "react"
import TopNavbar from "../../components/Common/Navbar/TopNavbar"
import PageContainer from "../../components/Layout/PageContainer"
import { BanknotesIcon, MagnifyingGlassIcon, ChartBarIcon } from "@heroicons/react/24/outline"
import Table from "../../components/Common/Table"
import { TableColumn } from "../../components/Common/Table"
import Button from "../../components/Common/Button/Button"
import { useAdminBilling } from "../../hooks/Admin/useAdminBilling"
import StatusBadge from "../../components/Common/StatusBadge"
import { AdminTransactionResponse } from "../../client/types.gen"
import { formatStandardDate } from "../../utils/dateTime"
import Section from "../../components/Common/Section"
import TransactionAmount from "../../components/Common/TransactionAmount"
import { TransactionType } from "../../constant/TransactionConstant"
import BillingStatsVisualizer from "../../components/Admin/BillingStatsVisualizer"
import DateRangePicker from "../../components/Common/RangePicker/DateRangePicker"
import SearchBar from "../../components/Common/SearchBar"

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
            render: (transaction) => formatStandardDate(transaction.last_updated_at, "N/A")
        },
        {
            key: 'username',
            label: 'Username',
            render: (transaction) => transaction.username
        },
        {
            key: 'instance_name',
            label: 'Instance Name',
            render: (transaction) => transaction.instance_name === "Deleted Instance" ? 
                <span className="text-red-500 font-medium">{transaction.instance_name}</span> : 
                (transaction.instance_name ?? '-')
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
                (
                    transaction.transaction_type === TransactionType.SUBSCRIPTION_PAYMENT
                    && transaction.instance_name !== "Deleted Instance"
                ) ?
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

    return (
        <>
            <TopNavbar
                leftSection={leftSection}
                variant="default"
                stickyTop={true}
            />
            <PageContainer
                title="Billing"
                subtitle="Manage billing and transactions"
                subtitleIcon={<BanknotesIcon className="w-4 h-4" />}
            >
                
                {/* Billing Stats Visualization */}
                <Section 
                    title="Billing Statistics" 
                    icon={<ChartBarIcon className="w-5 h-5" />}
                    description="Filter and view transaction values by time period, type, and status"
                    className="bg-[#12203c] border-blue-900/20 mb-6"
                >
                    <DateRangePicker 
                        isAllTime={isAllTime}
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                        onToggleTimeRange={toggleTimeRange}
                        onDateRangeChange={updateDateRange}
                        onApplyFilter={fetchBillingStats}
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
                        data-testid="transactions-table"
                    />
                </Section>
            </PageContainer>
        </>
    )
}

export default AdminBillingPage
