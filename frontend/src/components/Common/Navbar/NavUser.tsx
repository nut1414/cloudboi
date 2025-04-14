import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline"
import DropdownButton, { DropdownItemProps } from "../Button/DropdownButton"
import { useTestId } from "../../../utils/testUtils"

// Common interface for the NavUser component
export interface NavUserProps {
    username?: string
    userRole?: string
    logout: () => Promise<void>
    variant?: 'primary' | 'secondary' | 'outline' | 'purple' | 'transparent' | 'none'
    className?: string
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    fullWidth?: boolean
    customMenuItems?: DropdownItemProps[]
}

/**
 * A reusable NavUser component that can be used in both top and side navigation
 */
export const NavUser: React.FC<NavUserProps> = ({
    username = 'User',
    userRole,
    logout,
    variant = 'transparent',
    className = "",
    position = "bottom-right",
    fullWidth = false,
    customMenuItems,
    ...restProps
}) => {
    const navigate = useNavigate()
    const { dataTestId, cleanProps } = useTestId(restProps)

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }


    const userRoleDisplay = userRole === "admin" ? "Administrator Account" : "User Account"

    // Create user avatar with first letter
    const userAvatar = (
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {username?.charAt(0).toUpperCase()}
        </div>
    )

    // User profile button with info
    const userProfileButton = (
        <div className="flex items-center space-x-3">
            {userAvatar}
            <div className="flex flex-col text-left">
                <span className="text-white font-medium">{username}</span>
                <span className="text-gray-400 text-sm">{userRoleDisplay}</span>
            </div>
        </div>
    )

    // Default dropdown items
    const defaultDropdownItems: DropdownItemProps[] = [
        {
            href: `/user/${username}/instance`,
            content: "Dashboard"
        },
        {
            href: `/user/${username}/profile`,
            content: "Profile"
        },
        {
            href: `/user/${username}/setting`,
            content: "Settings"
        },
        {
            divider: true
        },
        {
            content: (
                <div className="flex items-center text-red-400">
                    <ArrowLeftStartOnRectangleIcon className="h-5 w-5 mr-2" />
                    Logout
                </div>
            ),
            onClick: handleLogout,
            className: "text-red-400"
        }
    ]

    // Use custom items if provided, otherwise use default
    const dropdownItems = customMenuItems || defaultDropdownItems

    return (
        <div className={`flex items-center ${className}`}>
            <DropdownButton
                content={userProfileButton}
                variant={variant}
                buttonType="text"
                items={dropdownItems}
                position={position}
                disableHover={true}
                fullWidth={fullWidth}
                data-testid={dataTestId || undefined}
                {...cleanProps}
            />
        </div>
    )
}