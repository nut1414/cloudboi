import React from "react"
import { useTestId } from "../../../utils/testUtils"

// OptionButton Props
export interface OptionButtonProps {
  label: string | number
  onClick: () => void
  icon?: React.ReactNode
  isSelected?: boolean
  variant?: 'standard' | 'prominent'  // Renamed from 'default' | 'amount'
  unit?: string
  className?: string
  disabled?: boolean
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  onClick,
  icon,
  isSelected = false,
  variant = 'standard',  // Renamed default value
  unit,
  className = "",
  disabled = false,
  ...restProps
}) => {
  // Define variant styles
  const variantStyles = {
    standard: isSelected  // Renamed from 'default'
      ? 'bg-purple-600 text-white border border-purple-500'
      : 'bg-[#23375F] text-gray-300 border border-blue-800/30 hover:bg-blue-800',
    prominent: isSelected  // Renamed from 'amount'
      ? 'bg-purple-600 font-medium text-white ring-2 ring-purple-600 ring-opacity-50'
      : 'bg-[#2A3F6A] text-gray-200 hover:bg-[#304776]'
  }

  // Base button styles
  const buttonStyles = `
    ${variantStyles[variant]}
    transition-all duration-200
    rounded-lg flex items-center
    ${variant === 'standard' ? 'px-4 py-2' : 'px-4 py-3'}  // Updated reference
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `

  const formattedLabel = typeof label === 'number'
    ? label.toLocaleString()
    : label

  const { dataTestId } = useTestId(restProps)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles}
      data-testid={dataTestId ? `${dataTestId}-option-button` : undefined}
    >
      {icon && (
        <span className={`${isSelected ? 'text-white' : 'text-purple-400'} mr-2`}>
          {icon}
        </span>
      )}
      
      <span className="flex-grow">
        {formattedLabel}{unit && ` ${unit}`}
      </span>
    </button>
  )
}

export default OptionButton