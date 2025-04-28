import React from 'react'
import Alert from './Alert'

type AlertType = 'success' | 'error' | 'info' | 'warning'

interface PageAlertProps {
  type: AlertType
  title?: string
  message: string | React.ReactNode
  className?: string
  onClose?: () => void
}

/**
 * PageAlert - Used for important in-page notifications that should remain visible
 * until explicitly dismissed or the page changes. Unlike toast notifications,
 * these alerts are meant to be part of the page layout.
 */
const PageAlert: React.FC<PageAlertProps> = ({
  type,
  title,
  message,
  className = '',
  onClose
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {title && (
        <h3 className="font-semibold mb-1 text-lg">
          {title}
        </h3>
      )}
      <Alert 
        type={type} 
        message={
          <div className="flex justify-between w-full items-center">
            <div>{message}</div>
            {onClose && (
              <button 
                onClick={onClose}
                className="ml-4 text-sm hover:underline"
              >
                Dismiss
              </button>
            )}
          </div>
        } 
      />
    </div>
  )
}

export default PageAlert 