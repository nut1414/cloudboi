import React from 'react'
import { useTestId } from '../../utils/testUtils'

interface ProgressBarProps {
  percentage: number
  color?: 'blue' | 'purple'
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = 'blue',
  className = '',
  ...restProps
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  }

  const { dataTestId } = useTestId(restProps)

  return (
    <div className={`h-2 bg-gray-400/20 rounded overflow-hidden ${className}`}
      data-testid={dataTestId ? `${dataTestId}-progress-bar` : undefined}
    >
      <div
        className={`h-full ${colorClasses[color]} transition-all duration-300`}
        style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
      />
    </div>
  )
}

export default React.memo(ProgressBar) 