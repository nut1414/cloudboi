import React from 'react'
import { InstanceStatus } from '../../constant/InstanceConstant'

// Create a type from the InstanceStatus values
export type InstanceStatusType = typeof InstanceStatus[keyof typeof InstanceStatus]

// Updated interface to use InstanceStatus directly
interface StatusBadgeProps {
    status: InstanceStatusType
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
    // Normalize status to lowercase for matching
    const normalizedStatus = status.toLowerCase()

    // Define status styles map
    const statusConfig = {
        [InstanceStatus.RUNNING.toLowerCase()]: {
            bg: 'bg-green-700',
            text: 'text-green-100',
            dotColor: 'bg-green-500',
            textOnly: 'text-green-500',
        },
        [InstanceStatus.STOPPED.toLowerCase()]: {
            bg: 'bg-red-700',
            text: 'text-red-100',
            dotColor: 'bg-red-500',
            textOnly: 'text-red-500',
        },
        [InstanceStatus.FROZEN.toLowerCase()]: {
            bg: 'bg-blue-700',
            text: 'text-blue-100',
            dotColor: 'bg-blue-500',
            textOnly: 'text-blue-500',
        },
        [InstanceStatus.ERROR.toLowerCase()]: {
            bg: 'bg-red-700',
            text: 'text-red-100',
            dotColor: 'bg-red-500',
            textOnly: 'text-red-500',
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
            {status}
        </span>
    )
}

export default StatusBadge