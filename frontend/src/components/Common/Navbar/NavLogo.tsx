import { Link } from "react-router-dom"

// Interface for the NavLogo component
export interface NavLogoProps {
  logo?: React.ReactNode
  logoText?: string
  variant?: 'default' | 'light' | 'dark'
  href?: string
  className?: string
}

/**
 * A reusable NavLogo component for both top and side navigation
 */
export const NavLogo: React.FC<NavLogoProps> = ({
  logo,
  logoText,
  variant = 'default',
  href = "/",
  className = ""
}) => {
  const variantStyles = {
    default: "text-white",
    light: "text-gray-900",
    dark: "text-white"
  }

  return (
    <Link to={href} className={`flex items-center gap-3 ${className}`}>
      {logo}
      {logoText && (
        <span className={`${variantStyles[variant]} font-bold`}
          style={{ fontSize: className.includes("text-") ? undefined : "1.5rem" }}>
          {logoText}
        </span>
      )}
    </Link>
  )
}