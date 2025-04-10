import React from 'react'

interface ProgressBarProps {
  percentage: number
  color?: 'blue' | 'purple'
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = 'blue',
  className = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  }

  return (
    <div className={`h-2 bg-gray-400/20 rounded overflow-hidden ${className}   `}>
      <div
        className={`h-full ${colorClasses[color]} transition-all duration-300`}
        style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
      />
    </div>
  )
}

export default React.memo(ProgressBar) 