import React from 'react'

export type StatusType =
    | 'running'
    | 'stopped'
    | 'pending'
    | 'failed'
    | 'completed'
    | 'processing'
    | 'cancelled'
    | 'warning'
    | 'info'

interface StatusBadgeProps {
    status: StatusType | string
    showDot?: boolean
    showBackground?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    showDot = true,
    showBackground = true,
    size = 'md',
    className = '',
}) => {
    // Normalize status to lowercase to ensure consistent matching
    const normalizedStatus = status.toLowerCase() as StatusType

    // Define status styles map
    const statusConfig = {
        running: {
            bg: 'bg-green-700',
            text: 'text-green-100',
            dotColor: 'bg-green-500',
            textOnly: 'text-green-500',
        },
        stopped: {
            bg: 'bg-red-700',
            text: 'text-red-100',
            dotColor: 'bg-red-500',
            textOnly: 'text-red-500',
        },
        pending: {
            bg: 'bg-yellow-700',
            text: 'text-yellow-100',
            dotColor: 'bg-yellow-500',
            textOnly: 'text-yellow-500',
        },
        failed: {
            bg: 'bg-gray-700',
            text: 'text-gray-100',
            dotColor: 'bg-gray-500',
            textOnly: 'text-gray-500',
        },
        completed: {
            bg: 'bg-green-700',
            text: 'text-green-100',
            dotColor: 'bg-green-500',
            textOnly: 'text-green-500',
        },
        processing: {
            bg: 'bg-blue-700',
            text: 'text-blue-100',
            dotColor: 'bg-blue-500',
            textOnly: 'text-blue-500',
        },
        cancelled: {
            bg: 'bg-red-700',
            text: 'text-red-100',
            dotColor: 'bg-red-500',
            textOnly: 'text-red-500',
        },
        warning: {
            bg: 'bg-orange-700',
            text: 'text-orange-100',
            dotColor: 'bg-orange-500',
            textOnly: 'text-orange-500',
        },
        info: {
            bg: 'bg-indigo-700',
            text: 'text-indigo-100',
            dotColor: 'bg-indigo-500',
            textOnly: 'text-indigo-500',
        },
    }

    // Get styles based on status or default to gray if not found
    const styles = statusConfig[normalizedStatus] || {
        bg: 'bg-gray-700',
        text: 'text-gray-100',
        dotColor: 'bg-gray-500',
        textOnly: 'text-gray-500',
    }

    // Size variations
    const sizeClasses = {
        sm: 'text-xs px-1.5 py-0.5 rounded',
        md: 'text-xs px-2 py-1 rounded-full',
        lg: 'text-sm px-3 py-1.5 rounded-full',
    }

    // Dot size based on badge size
    const dotSize = {
        sm: 'h-1.5 w-1.5',
        md: 'h-2 w-2',
        lg: 'h-2.5 w-2.5',
    }

    // Determine text color based on the background setting
    const textColor = showBackground ? styles.text : styles.textOnly

    return (
        <span
            className={`font-medium inline-flex items-center ${showBackground ? styles.bg : ''} ${textColor} ${showBackground ? sizeClasses[size] : ''} ${className}`}
        >
            {showDot && (
                <span className={`${styles.dotColor} ${dotSize[size]} rounded-full ${!showBackground ? 'mr-1.5' : 'mr-1.5'}`}></span>
            )}
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </span>
    )
}

export default StatusBadge