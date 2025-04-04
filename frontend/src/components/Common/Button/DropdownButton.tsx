import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// DropdownItem type
export interface DropdownItemProps {
    href?: string;
    label?: React.ReactNode; // Changed from string to ReactNode
    icon?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    divider?: boolean;
}

// Dropdown Button props
export interface DropdownButtonProps {
    label: React.ReactNode; // Changed from string to ReactNode
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    dropdownClassName?: string;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'purple' | 'transparent' | 'none';
    hasBorder?: boolean;
    disabled?: boolean;
    disableHover?: boolean;
    items: DropdownItemProps[];
    position?: 'bottom-left' | 'bottom-right';
    size?: 'sm' | 'md' | 'lg';
    buttonType?: 'default' | 'text' | 'icon' | 'none';
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
    label,
    onClick,
    className = "",
    dropdownClassName = "",
    icon,
    variant = 'primary',
    hasBorder = false,
    disabled = false,
    disableHover = false,
    items,
    position = 'bottom-left',
    size = 'md',
    buttonType = 'default'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Define variant styles
    const variantStyles = {
        primary: `bg-blue-800 text-white ${!disableHover ? 'hover:bg-blue-700' : ''}`,
        secondary: `bg-gray-600 text-white ${!disableHover ? 'hover:bg-gray-500' : ''}`,
        purple: `bg-purple-600 text-white ${!disableHover ? 'hover:bg-purple-700' : ''}`,
        outline: `bg-transparent border-2 border-blue-800/30 text-gray-300 ${!disableHover ? 'hover:bg-blue-800/20' : ''}`,
        transparent: `bg-transparent text-gray-300 ${!disableHover ? 'hover:bg-blue-800/20' : ''}`,
        none: ''
    };

    // Define size styles
    const sizeStyles = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2",
        lg: "px-5 py-3 text-lg"
    };

    // Position styles
    const positionStyles = {
        'bottom-left': "left-0",
        'bottom-right': "right-0"
    };

    // Button type styles
    const buttonTypeStyles = {
        default: `${sizeStyles[size]} rounded-lg`,
        text: "px-2 py-1",
        icon: "p-1",
        none: ""
    };

    // Base button styles
    const buttonStyles = `
    ${variantStyles[variant]}
    ${buttonTypeStyles[buttonType]}
    transition-colors duration-200 
    flex items-center gap-2
    ${hasBorder ? 'border-blue-700 border-2' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

    // Handle dropdown toggle
    const handleToggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        setIsOpen(!isOpen);
        if (onClick) onClick(e);
    };

    return (
        <div ref={dropdownRef} className="relative inline-block">
            <button
                type="button"
                onClick={handleToggleDropdown}
                disabled={disabled}
                className={buttonStyles}
            >
                {icon && <span>{icon}</span>}
                {(buttonType !== 'icon' || !icon) && <span>{label}</span>}
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute mt-1 ${positionStyles[position]} ${dropdownClassName} z-50 min-w-[220px] bg-[#23375F] rounded-lg shadow-lg border border-blue-800/30 overflow-hidden`}>
                    {items.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.divider && <div className="border-t border-blue-800/30 my-1"></div>}

                            {!item.divider && item.href ? (
                                <Link
                                    to={item.href}
                                    className={`block w-full text-left px-4 py-2 text-gray-300 hover:bg-blue-800 hover:text-white transition-colors ${item.className || ''}`}
                                    onClick={() => {
                                        setIsOpen(false);
                                        if (item.onClick) item.onClick();
                                    }}
                                >
                                    <div className="flex items-center">
                                        {item.icon && <span className="mr-2">{item.icon}</span>}
                                        {item.label}
                                    </div>
                                </Link>
                            ) : !item.divider ? (
                                <button
                                    className={`block w-full text-left px-4 py-2 text-gray-300 hover:bg-blue-800 hover:text-white transition-colors ${item.className || ''}`}
                                    onClick={() => {
                                        setIsOpen(false);
                                        if (item.onClick) item.onClick();
                                    }}
                                >
                                    <div className="flex items-center">
                                        {item.icon && <span className="mr-2">{item.icon}</span>}
                                        {item.label}
                                    </div>
                                </button>
                            ) : null}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownButton;