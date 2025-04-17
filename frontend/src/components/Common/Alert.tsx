import React from 'react'
import { 
  InformationCircleIcon, 
  ExclamationCircleIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

type AlertType = 'success' | 'error' | 'info' | 'warning'

interface AlertProps {
  type: AlertType
  message: string | React.ReactNode
  className?: string
}

const Alert: React.FC<AlertProps> = ({ type, message, className = '' }) => {
  const getAlertStyles = (): string => {
    switch (type) {
      case 'success':
        return 'bg-green-900/30 border-green-500 text-green-300'
      case 'error':
        return 'bg-red-900/30 border-red-500 text-red-300'
      case 'warning':
        return 'bg-yellow-900/30 border-yellow-500 text-yellow-300'
      case 'info':
      default:
        return 'bg-blue-900/30 border-blue-500 text-blue-300'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 mr-2" />
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 mr-2" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
      case 'info':
      default:
        return <InformationCircleIcon className="h-5 w-5 mr-2" />
    }
  }

  return (
    <div className={`p-3 border-l-4 rounded flex items-center ${getAlertStyles()} ${className}`} data-testid={`alert-${type}`}>
      {getIcon()}
      <p>{message}</p>
    </div>
  )
}

export default Alert 