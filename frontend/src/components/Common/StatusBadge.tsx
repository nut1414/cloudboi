// components/Common/StatusBadge.tsx
import React from 'react'
import { InstanceStatus } from '../../constant/InstanceConstant'
import { TransactionStatus } from '../../constant/TransactionConstant'

export type InstanceStatusType = typeof InstanceStatus[keyof typeof InstanceStatus]
export type TransactionStatusType = typeof TransactionStatus[keyof typeof TransactionStatus]

export type StatusType = InstanceStatusType | TransactionStatusType

interface StatusBadgeProps {
    status: StatusType
    showDot?: boolean
    showBackground?: boolean
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'table-status'
    className?: string
    children?: React.ReactNode
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    showDot = true,
    showBackground = true,
    size = 'md',
    variant = 'default',
    className = '',
    children,
}) => {
    // Normalize status to lowercase for matching
    const normalizedStatus = typeof status === 'string' ? status : ''

    // Define status styles map for Instance statuses
    const instanceStatusConfig = {
        [InstanceStatus.RUNNING]: {
            bg: 'bg-green-700',
            text: 'text-green-100',
            dotColor: 'bg-green-500',
            textOnly: 'text-green-500',
            tableBg: 'bg-green-500/20',
            tableText: 'text-green-300',
        },
        [InstanceStatus.STOPPED]: {
            bg: 'bg-red-700',
            text: 'text-red-100',
            dotColor: 'bg-red-500',
            textOnly: 'text-red-500',
            tableBg: 'bg-gray-500/20',
            tableText: 'text-gray-300',
        },
        [InstanceStatus.FROZEN]: {
            bg: 'bg-blue-700',
            text: 'text-blue-100',
            dotColor: 'bg-blue-500',
            textOnly: 'text-blue-500',
            tableBg: 'bg-blue-500/20',
            tableText: 'text-blue-300',
        },
        [InstanceStatus.ERROR]: {
            bg: 'bg-red-700',
            text: 'text-red-100',
            dotColor: 'bg-red-500',
            textOnly: 'text-red-500',
            tableBg: 'bg-red-500/20',
            tableText: 'text-red-300',
        },
    }

    // Define status styles map for Transaction statuses
    const transactionStatusConfig = {
        [TransactionStatus.SUCCESS]: {
            bg: 'bg-green-700',
            text: 'text-green-100',
            dotColor: 'bg-green-500',
            textOnly: 'text-green-500',
            tableBg: 'bg-green-500/20',
            tableText: 'text-green-300',
        },
        [TransactionStatus.PAID]: {
            bg: 'bg-green-700',
            text: 'text-green-100',
            dotColor: 'bg-green-500',
            textOnly: 'text-green-500',
            tableBg: 'bg-green-500/20',
            tableText: 'text-green-300',
        },
        [TransactionStatus.PENDING]: {
            bg: 'bg-blue-700',
            text: 'text-blue-100',
            dotColor: 'bg-blue-500',
            textOnly: 'text-blue-500',
            tableBg: 'bg-blue-500/20',
            tableText: 'text-blue-300',
        },
        [TransactionStatus.SCHEDULED]: {
            bg: 'bg-blue-700',
            text: 'text-blue-100',
            dotColor: 'bg-blue-500',
            textOnly: 'text-blue-500',
            tableBg: 'bg-blue-500/20',
            tableText: 'text-blue-300',
        },
        [TransactionStatus.FAILED]: {
            bg: 'bg-red-700',
            text: 'text-red-100',
            dotColor: 'bg-red-500',
            textOnly: 'text-red-500',
            tableBg: 'bg-red-500/20',
            tableText: 'text-red-300',
        },
        [TransactionStatus.OVERDUE]: {
            bg: 'bg-red-700',
            text: 'text-red-100',
            dotColor: 'bg-red-500',
            textOnly: 'text-red-500',
            tableBg: 'bg-red-500/20',
            tableText: 'text-red-300',
        },
        [TransactionStatus.EXPIRED]: {
            bg: 'bg-red-700',
            text: 'text-red-100',
            dotColor: 'bg-red-500',
            textOnly: 'text-red-500',
            tableBg: 'bg-red-500/20',
            tableText: 'text-red-300',
        },
    }

    // Merge both config objects
    const mergedConfig = { ...instanceStatusConfig, ...transactionStatusConfig }

    // Get styles based on status or default to gray if not found
    const styles = mergedConfig[normalizedStatus] || {
        bg: 'bg-gray-700',
        text: 'text-gray-100',
        dotColor: 'bg-gray-500',
        textOnly: 'text-gray-500',
        tableBg: 'bg-gray-500/20',
        tableText: 'text-gray-300',
    }

    // Size variations for default variant
    const sizeClasses = {
        sm: 'text-xs px-1.5 py-0.5 rounded',
        md: 'text-xs px-2 py-1 rounded-full',
        lg: 'text-sm px-3 py-1.5 rounded-full',
    }

    // Table variant is always rounded and text-xs
    const tableClass = 'text-xs px-1.5 py-0.5 rounded'

    // Dot size based on badge size
    const dotSize = {
        sm: 'h-1.5 w-1.5',
        md: 'h-2 w-2',
        lg: 'h-2.5 w-2.5',
    }

    // Determine styling based on variant
    let badgeClass
    let textColor

    if (variant === 'table-status') {
        badgeClass = tableClass
        textColor = styles.tableText
        showBackground = true // Always show background for table-status
    } else {
        badgeClass = showBackground ? sizeClasses[size] : ''
        textColor = showBackground ? styles.text : styles.textOnly
    }

    const bgColor = variant === 'table-status' 
        ? styles.tableBg 
        : (showBackground ? styles.bg : '')

    return (
        <span
            className={`capitalize font-medium inline-flex items-center ${bgColor} ${textColor} ${badgeClass} ${className}`}
            data-testid={`status-badge-${status}`}
        >
            {showDot && (
                <span className={`${styles.dotColor} ${dotSize[size]} rounded-full ${!showBackground ? 'mr-1.5' : 'mr-1.5'}`}></span>
            )}
            {children ? (
                <>
                    <span className="mr-1">{children}</span>
                    {status.toLowerCase()}
                </>
            ) : (
                status.toLowerCase()
            )}
        </span>
    )
}

export default StatusBadge