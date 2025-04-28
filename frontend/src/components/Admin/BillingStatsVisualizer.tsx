import React, { useMemo, useCallback } from 'react'
import { AdminBillingStatsResponse } from '../../client/types.gen'
import ItemCard from '../Common/ItemCard'
import { BanknotesIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/react/24/outline'
import StatusBadge from '../Common/StatusBadge'
import { TransactionType, TransactionStatusRelations } from '../../constant/TransactionConstant'
import { CURRENCY } from '../../constant/CurrencyConstant'

interface BillingStatsVisualizerProps {
  billingStats: AdminBillingStatsResponse | null
  isLoading: boolean
}

const BillingStatsVisualizer: React.FC<BillingStatsVisualizerProps> = React.memo(({
  billingStats,
  isLoading
}) => {
  // Get transaction icons (memoized to avoid recreation)
  const transactionIcons = useMemo(() => ({
    [TransactionType.TOP_UP]: <ArrowUpCircleIcon className="w-5 h-5 text-green-400" />,
    [TransactionType.SUBSCRIPTION_PAYMENT]: <ArrowDownCircleIcon className="w-5 h-5 text-blue-400" />
  }), [])

  // Get transaction titles (memoized)
  const transactionTitles = useMemo(() => ({
    [TransactionType.TOP_UP]: 'Top-Up Transactions',
    [TransactionType.SUBSCRIPTION_PAYMENT]: 'Subscription Payments'
  }), [])
  
  // Create a status item with badge and amount (memoized function)
  const createStatusItem = useCallback((status: string, amount: number) => ({
    label: status,
    value: (
      <div className="flex items-center justify-between" data-testid={`billing-stats-visualizer-status-item-${status}`}>
        <StatusBadge status={status} />
        <span className="font-semibold">{CURRENCY.FORMAT(amount)}</span>
      </div>
    )
  }), [])

  // Create detail items for each transaction type
  const getDetailItems = useMemo(() => {
    if (!billingStats?.stats?.length) return []

    return billingStats.stats.map(typeStats => {
      // Calculate total amount for this transaction type
      const totalAmount = typeStats.stats.reduce((sum, statusStat) => sum + statusStat.amount, 0)
      
      // Create detail items for each status
      const statusItems = typeStats.stats.map(statusStat => 
        createStatusItem(statusStat.status, statusStat.amount)
      )

      return {
        type: typeStats.type,
        title: transactionTitles[typeStats.type],
        icon: transactionIcons[typeStats.type],
        totalAmount,
        detailItems: statusItems
      }
    })
  }, [billingStats, createStatusItem, transactionIcons, transactionTitles])

  // Create realistic placeholder items based on transaction types and their related statuses
  const placeholderItems = useMemo(() => {
    // Create placeholders for each transaction type
    return Object.keys(TransactionType).map(typeKey => {
      const type = TransactionType[typeKey as keyof typeof TransactionType]
      
      return {
        type,
        title: transactionTitles[type],
        detailItems: TransactionStatusRelations[type].map(status => 
          createStatusItem(status, 0)
        ),
        rightHeader: (
          <div className="flex items-center gap-2">
            {transactionIcons[type]}
            <span className="font-bold text-white">{CURRENCY.FORMAT(0)}</span>
          </div>
        )
      }
    })
  }, [createStatusItem, transactionIcons, transactionTitles])

  // Memoize the empty state component
  const emptyState = useMemo(() => (
    <div className="text-center py-8 bg-[#192A51] rounded-lg border border-blue-900/30">
      <BanknotesIcon className="w-12 h-12 mx-auto text-gray-500 mb-2" />
      <p className="text-gray-400">No billing statistics available for the selected period</p>
    </div>
  ), [])

  // Memoize the rendered items when loading
  const renderSkeletonItems = useMemo(() => {
    // Find the maximum number of detail items across all transaction types
    const maxDetailItemCount = Math.max(
      ...placeholderItems.map(item => item.detailItems.length)
    )
    
    // Create a simple placeholder with no details
    const emptyDetailItems = Array(maxDetailItemCount).fill(0).map(() => ({
      label: "",
      value: ""
    }))
    
    return placeholderItems.map((item, index) => (
      <ItemCard
        key={`skeleton-${index}`}
        title={item.title}
        rightHeader={item.rightHeader}
        detailItems={emptyDetailItems}
        className="h-full"
        isLoading={true}
      />
    ))
  }, [placeholderItems])

  // Memoize the rendered items when loaded
  const renderDetailItems = useMemo(() => 
    getDetailItems.map((statItem, index) => (
      <ItemCard
        key={index}
        title={statItem.title}
        rightHeader={
          <div className="flex items-center gap-2" data-testid={`billing-stats-visualizer-right-header-${statItem.type}`}>
            {statItem.icon}
            <span className="font-bold text-white">{CURRENCY.FORMAT(statItem.totalAmount)}</span>
          </div>
        }
        detailItems={statItem.detailItems}
        className="h-full"
        data-testid={`billing-stats-visualizer-item-${statItem.type}`}
      />
    ))
  , [getDetailItems, CURRENCY.FORMAT])

  // Show empty state if no data and not loading
  if (!billingStats?.stats?.length && !isLoading) {
    return emptyState
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {isLoading ? renderSkeletonItems : renderDetailItems}
    </div>
  )
})

export default BillingStatsVisualizer 