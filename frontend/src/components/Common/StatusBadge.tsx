// components/Common/StatusBadge.tsx
import React from 'react';
import { InstanceStatus } from '../../constant/InstanceConstant';
import { TransactionStatus } from '../../constant/TransactionConstant';

export type InstanceStatusType = typeof InstanceStatus[keyof typeof InstanceStatus];
export type TransactionStatusType = typeof TransactionStatus[keyof typeof TransactionStatus];

export type StatusType = InstanceStatusType | TransactionStatusType;

interface StatusBadgeProps {
    status: StatusType;
    showDot?: boolean;
    showBackground?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    showDot = true,
    showBackground = true,
    size = 'md',
    className = '',
}) => {
    // Normalize status to lowercase for matching
    const normalizedStatus = typeof status === 'string' ? status : '';

    // Define status styles map for Instance statuses
    const instanceStatusConfig = {
        [InstanceStatus.RUNNING]: {
            bg: 'bg-green-700',
            text: 'text-green-100',
            dotColor: 'bg-green-500',
            textOnly: 'text-green-500',
        },
        [InstanceStatus.STOPPED]: {
            bg: 'bg-red-700',
            text: 'text-red-100',
            dotColor: 'bg-red-500',
            textOnly: 'text-red-500',
        },
        [InstanceStatus.FROZEN]: {
            bg: 'bg-blue-700',
            text: 'text-blue-100',
            dotColor: 'bg-blue-500',
            textOnly: 'text-blue-500',
        },
        [InstanceStatus.ERROR]: {
            bg: 'bg-red-700',
            text: 'text-red-100',
            dotColor: 'bg-red-500',
            textOnly: 'text-red-500',
        },
    };

    // Define status styles map for Transaction statuses
    const transactionStatusConfig = {
        [TransactionStatus.SUCCESS]: {
            bg: 'bg-green-700',
            text: 'text-green-100',
            dotColor: 'bg-green-500',
            textOnly: 'text-green-500',
        },
        [TransactionStatus.PAID]: {
            bg: 'bg-green-700',
            text: 'text-green-100',
            dotColor: 'bg-green-500',
            textOnly: 'text-green-500',
        },
        [TransactionStatus.PENDING]: {
            bg: 'bg-blue-700',
            text: 'text-blue-100',
            dotColor: 'bg-blue-500',
            textOnly: 'text-blue-500',
        },
        [TransactionStatus.SCHEDULED]: {
            bg: 'bg-blue-700',
            text: 'text-blue-100',
            dotColor: 'bg-blue-500',
            textOnly: 'text-blue-500',
        },
        [TransactionStatus.FAILED]: {
            bg: 'bg-red-700',
            text: 'text-red-100',
            dotColor: 'bg-red-500',
            textOnly: 'text-red-500',
        },
        [TransactionStatus.OVERDUE]: {
            bg: 'bg-red-700',
            text: 'text-red-100',
            dotColor: 'bg-red-500',
            textOnly: 'text-red-500',
        },
        [TransactionStatus.EXPIRED]: {
            bg: 'bg-red-700',
            text: 'text-red-100',
            dotColor: 'bg-red-500',
            textOnly: 'text-red-500',
        },
    };

    // Merge both config objects
    const mergedConfig = { ...instanceStatusConfig, ...transactionStatusConfig };

    // Get styles based on status or default to gray if not found
    const styles = mergedConfig[normalizedStatus] || {
        bg: 'bg-gray-700',
        text: 'text-gray-100',
        dotColor: 'bg-gray-500',
        textOnly: 'text-gray-500',
    };

    // Size variations
    const sizeClasses = {
        sm: 'text-xs px-1.5 py-0.5 rounded',
        md: 'text-xs px-2 py-1 rounded-full',
        lg: 'text-sm px-3 py-1.5 rounded-full',
    };

    // Dot size based on badge size
    const dotSize = {
        sm: 'h-1.5 w-1.5',
        md: 'h-2 w-2',
        lg: 'h-2.5 w-2.5',
    };

    // Determine text color based on the background setting
    const textColor = showBackground ? styles.text : styles.textOnly;

    return (
        <span
            className={`capitalize font-medium inline-flex items-center ${showBackground ? styles.bg : ''} ${textColor} ${showBackground ? sizeClasses[size] : ''} ${className}`}
        >
            {showDot && (
                <span className={`${styles.dotColor} ${dotSize[size]} rounded-full ${!showBackground ? 'mr-1.5' : 'mr-1.5'}`}></span>
            )}
            {status.toLowerCase()}
        </span>
    );
};

export default StatusBadge;