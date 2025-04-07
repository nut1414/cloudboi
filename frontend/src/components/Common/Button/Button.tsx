// components/Common/Button.tsx
import React from "react"
import { Link } from "react-router-dom"

// Unified Button Props
export interface ButtonProps {
  label: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  href?: string
  className?: string
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'purple' | 'table-action' | 'text-link'
  hasBorder?: boolean
  disabled?: boolean
  size?: 'default' | 'small' | 'xs'
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  href,
  className = "",
  icon,
  variant = 'primary',
  hasBorder = false,
  disabled = false,
  size = 'default'
}) => {
  // Define variant styles
  const variantStyles = {
    primary: "bg-blue-800 text-white hover:bg-blue-700",
    secondary: "bg-purple-600 text-white hover:bg-purple-500",
    purple: "bg-purple-600 hover:bg-purple-700 text-white",
    outline: "bg-transparent border-2 border-blue-800/30 text-gray-300 hover:bg-blue-800/20",
    'table-action': "bg-green-500/20 text-green-300 hover:bg-green-500/30 rounded-full whitespace-nowrap text-sm py-1 px-3",
    'text-link': "bg-transparent text-blue-300 hover:text-blue-100 hover:underline text-sm"
  }

  // Size styles
  const sizeStyles = {
    default: "px-4 py-2",
    small: "px-3.5 py-1.5 text-sm",
    xs: "px-2 py-0.5 text-xs"
  }

  // Base button styles that apply to all variants except table-action and text-link
  let buttonStyles = "";
  
  if (variant === 'table-action') {
    buttonStyles = `
      ${variantStyles[variant]} 
      transition-colors duration-200 
      flex items-center gap-2
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `;
  } else if (variant === 'text-link') {
    buttonStyles = `
      ${variantStyles[variant]} 
      transition-colors duration-200
      flex items-center gap-2
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `;
  } else {
    buttonStyles = `
      ${variantStyles[variant]} 
      ${sizeStyles[size]}
      rounded-lg
      transition-colors duration-200 
      flex items-center gap-2
      ${hasBorder ? 'border-blue-700 border-2' : ''}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `;
  }

  // The actual button element
  const ButtonElement = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles}
    >
      {icon && <span>{icon}</span>}
      <span className="flex-grow">{label}</span>
    </button>
  )

  // If "to" prop is provided, wrap in Link component
  if (href) {
    return (
      <Link to={href} className="inline-block">
        {ButtonElement}
      </Link>
    )
  }

  // Otherwise, return the button directly
  return ButtonElement
}

export default Button
