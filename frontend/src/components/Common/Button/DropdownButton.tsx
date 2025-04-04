import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

// DropdownItem type
export interface DropdownItemProps {
    href?: string
    content?: React.ReactNode // Combined icon and label into content
    onClick?: () => void
    className?: string
    divider?: boolean
}

// Dropdown Button props
export interface DropdownButtonProps {
    content: React.ReactNode // Combined icon and label into content
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    className?: string
    dropdownClassName?: string
    variant?: 'primary' | 'secondary' | 'outline' | 'purple' | 'transparent' | 'none'
    hasBorder?: boolean
    disabled?: boolean
    disableHover?: boolean
    items: DropdownItemProps[]
    position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
    size?: 'sm' | 'md' | 'lg'
    buttonType?: 'default' | 'text' | 'icon' | 'none'
    fullWidth?: boolean
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
    content,
    onClick,
    className = "",
    dropdownClassName = "",
    variant = 'primary',
    hasBorder = false,
    disabled = false,
    disableHover = false,
    items,
    position = 'bottom-left',
    size = 'md',
    buttonType = 'default',
    fullWidth = false,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    // Define variant styles
    const variantStyles = {
        primary: `bg-blue-800 text-white ${!disableHover ? 'hover:bg-blue-700' : ''}`,
        secondary: `bg-gray-600 text-white ${!disableHover ? 'hover:bg-gray-500' : ''}`,
        purple: `bg-purple-600 text-white ${!disableHover ? 'hover:bg-purple-700' : ''}`,
        outline: `bg-transparent border-2 border-blue-800/30 text-gray-300 ${!disableHover ? 'hover:bg-blue-800/20' : ''}`,
        transparent: `bg-transparent text-gray-300 ${!disableHover ? 'hover:bg-blue-800/20' : ''}`,
        none: ''
    }

    // Define size styles
    const sizeStyles = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2",
        lg: "px-5 py-3 text-lg"
    }

    // Position styles
    const positionStyles = {
        'bottom-left': "left-0 top-full mt-1",
        'bottom-right': "right-0 top-full mt-1",
        'top-left': "left-0 bottom-full mb-1",
        'top-right': "right-0 bottom-full mb-1"
    }

    // Button type styles
    const buttonTypeStyles = {
        default: `${sizeStyles[size]} rounded-lg`,
        text: "px-2 py-1",
        icon: "p-1",
        none: ""
    }

    // Base button styles
    const buttonStyles = `
    ${variantStyles[variant]}
    ${buttonTypeStyles[buttonType]}
    transition-colors duration-200 
    flex items-center justify-between 
    ${hasBorder ? 'border-blue-700 border-2' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `

    // Handle dropdown toggle
    const handleToggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return
        setIsOpen(!isOpen)
        if (onClick) onClick(e)
    }

    return (
        <div ref={dropdownRef} className={`relative ${fullWidth ? 'w-full' : 'inline-block'}`}>
            <button
                type="button"
                onClick={handleToggleDropdown}
                disabled={disabled}
                className={buttonStyles}
            >
                <div className="flex-grow flex items-center">
                    {content}
                </div>
                <ChevronDownIcon className={`h-4 w-4 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute ${positionStyles[position]} ${fullWidth ? 'w-full' : 'min-w-[220px]'} ${dropdownClassName} z-50 bg-[#23375F] rounded-lg shadow-lg border border-blue-800/30 overflow-hidden`}>
                    {items.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.divider && <div className="border-t border-blue-800/30 my-1"></div>}

                            {!item.divider && item.href ? (
                                <Link
                                    to={item.href}
                                    className={`block w-full text-left px-4 py-2 text-gray-300 hover:bg-blue-800 hover:text-white transition-colors ${item.className || ''}`}
                                    onClick={() => {
                                        setIsOpen(false)
                                        if (item.onClick) item.onClick()
                                    }}
                                >
                                    {item.content}
                                </Link>
                            ) : !item.divider ? (
                                <button
                                    className={`block w-full text-left px-4 py-2 text-gray-300 hover:bg-blue-800 hover:text-white transition-colors ${item.className || ''}`}
                                    onClick={() => {
                                        setIsOpen(false)
                                        if (item.onClick) item.onClick()
                                    }}
                                >
                                    {item.content}
                                </button>
                            ) : null}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DropdownButton