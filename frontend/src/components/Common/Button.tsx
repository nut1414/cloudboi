import React from "react"
import { Link } from "react-router-dom"

// Unified Button Props
export interface ButtonProps {
  label: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  to?: string 
  className?: string
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'purple'
  hasBorder?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  to,
  className = "",
  icon,
  variant = 'primary',
  hasBorder = false
}) => {
  // Define variant styles
  const variantStyles = {
    primary: "bg-blue-800 text-white hover:bg-blue-700",
    secondary: "bg-purple-600 text-white hover:bg-purple-500",
    purple: "bg-purple-600 hover:bg-purple-700 text-white", // From ActionButton
    outline: "bg-transparent border-2 border-blue-800/30 text-gray-300 hover:bg-blue-800/20"
  }

  // Base button styles
  const buttonStyles = `
    ${variantStyles[variant]} 
    px-4 py-2 
    rounded-lg
    transition-colors duration-200 
    flex items-center gap-2
    ${hasBorder ? 'border-blue-700 border-2' : ''}
    ${className}
  `

  // The actual button element
  const ButtonElement = (
    <button
      onClick={onClick}
      className={buttonStyles}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  )

  // If "to" prop is provided, wrap in Link component
  if (to) {
    return (
      <Link to={to} className="inline-block">
        {ButtonElement}
      </Link>
    )
  }

  // Otherwise, return the button directly
  return ButtonElement
}

export default Button