import React from 'react'

interface TagBadgeProps {
  text: string
  variant?: 'blue' | 'purple' | 'gray'
  className?: string
}

const TagBadge: React.FC<TagBadgeProps> = ({
  text,
  variant = 'blue',
  className = ''
}) => {
  const variantClasses = {
    blue: 'bg-blue-500 text-white',
    purple: 'bg-purple-500 text-white',
    gray: 'bg-gray-500 text-white'
  }

  return (
    <span className={`text-sm px-2 py-1 rounded ${variantClasses[variant]} ${className}`}>
      {text}
    </span>
  )
}

export default React.memo(TagBadge) 