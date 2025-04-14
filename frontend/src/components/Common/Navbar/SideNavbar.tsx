import React, { useState } from "react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../hooks/User/useAuth"
import { ArrowLeftStartOnRectangleIcon, Bars3BottomLeftIcon, Cog6ToothIcon, CreditCardIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import { CloudIcon } from "@heroicons/react/24/solid"
import { useUserBilling } from "../../../hooks/User/useUserBilling"
import SkeletonLoader from "../SkeletonLoader"
import { DropdownItemProps } from "../Button/DropdownButton"
import { useUser } from "../../../contexts/userContext"
import { NavLogo } from "./NavLogo"
import { NavUser } from "./NavUser"
import { CURRENCY } from "../../../constant/CurrencyConstant"

// Define proper types
export interface NavItemProps {
  path: string
  label: string
  username?: string
  isHovering?: boolean
  icon?: React.ReactNode
}

interface SideNavbarProps {
  navItems?: { path: string; label: string; icon?: React.ReactNode }[]
  creditCurrency?: string
  logoText?: string
  logoIcon?: React.ReactNode
  onLogout?: () => void
  userRole?: string
  username?: string
  showCreditSection?: boolean
}

// NavItem component with better relative styling
const NavItem: React.FC<NavItemProps> = ({
  path,
  label,
  username,
  isHovering,
  icon
}) => {
  const { pathname } = useLocation()
  const currentPath = pathname.split("/").pop() || ""
  const isActive = currentPath === path
  const isAdminPath = pathname.startsWith('/admin')

  return (
    <li className={`
      relative rounded-md transition-all duration-200
      ${isActive && !isHovering ? "bg-blue-800" : ""}
      ${isHovering ? "hover:bg-blue-800" : ""}
    `}>
      <Link
        to={isAdminPath ? `/admin/${path}` : `/user/${username}/${path}`}
        className={`
          flex items-center py-3 px-5 text-lg font-medium
          transition-all duration-200 w-full
          ${isActive ? "text-white" : "text-gray-300 hover:text-white"}
        `}
      >
        {icon && <span className="mr-3">{icon}</span>}
        {label}
      </Link>
    </li>
  )
}

// Restyled Credit card component to match the theme in TopUpMenu
const CreditCard: React.FC<{ balance?: number; currency?: string; isLoading?: boolean }> = ({
  balance,
  currency = CURRENCY.SYMBOL,
  isLoading = false
}) => (
  <div className="mx-4 my-4">
    <div className="
      bg-[#23375F] 
      rounded-lg shadow-md overflow-hidden
      flex justify-between items-center p-5
      border border-blue-800/30
      transition-all duration-200
      hover:bg-[#2A3F6A]
    ">
      <div className="flex flex-col">
        <span className="text-sm text-gray-400 font-medium">
          Current Balance:
        </span>
        <span className="text-white text-2xl font-bold mt-1">
          {isLoading ? <SkeletonLoader variant="light" width="w-24" height="h-7" /> : balance !== undefined ? `${balance} ${currency}` : "Not available"}
        </span>
      </div>
      <CreditCardIcon className="w-8 h-8 text-purple-500" />
    </div>
  </div>
)

const SideNavbar: React.FC<SideNavbarProps> = ({
  navItems: customNavItems,
  creditCurrency = CURRENCY.SYMBOL,
  logoText = "CloudBoi",
  logoIcon = <CloudIcon className="bg-purple-500 w-8 h-8 rounded-md flex items-center justify-center" />,
  username,
  showCreditSection = true,
}) => {
  const { user } = useUser()
  const { userWallet, isLoading } = useUserBilling()
  const { logout } = useAuth()
  const [isHovering, setIsHovering] = useState<boolean>(false)

  // Default navigation items - can be overridden via props
  const defaultNavItems: NavItemProps[] = [
    { path: "instance", label: "Manage", icon: <Bars3BottomLeftIcon className="h-5 w-5" /> },
    { path: "billing", label: "Billing", icon: <CreditCardIcon className="h-5 w-5" /> },
    { path: "support", label: "Support", icon: <UserGroupIcon className="h-5 w-5" /> },
    { path: "setting", label: "Setting", icon: <Cog6ToothIcon className="h-5 w-5" /> },
  ]

  // Use provided navItems or fall back to defaults
  const navItems = customNavItems || defaultNavItems

  // User menu dropdown items for sidebar specifically
  const userMenuItems: DropdownItemProps[] = [
    {
      content: "View Profile",
      href: `/user/${username}/profile`
    },
    {
      content: "Preferences",
      href: `/user/${username}/preferences`
    },
    { divider: true },
    {
      content: (
        <div className="flex items-center text-red-400">
          <ArrowLeftStartOnRectangleIcon className="h-5 w-5 mr-2" />
          Logout
        </div>
      ),
      onClick: logout
    }
  ]

  return (
    <nav className="
      h-screen min-h-screen w-72 
      bg-[#192A51]
      flex flex-col
      shadow-xl
      border-r border-blue-900/50
      flex-shrink-0 
    ">
      {/* Logo Section - Using the common NavLogo component */}
      <div className="p-6 border-b border-blue-800/30">
        <NavLogo
          logo={logoIcon}
          logoText={logoText}
          variant="default"
          className="text-3xl"
        />
      </div>

      {/* Credit Card - Updated to use actual user wallet data */}
      {showCreditSection && (
        <CreditCard
          balance={userWallet?.balance}
          currency={creditCurrency}
          isLoading={isLoading}
        />
      )}

      {/* Navigation Items */}
      <div className="mt-6 mb-3 px-5 text-gray-400 text-sm uppercase tracking-wider font-medium">
        Main Navigation
      </div>

      <ul
        className="flex-grow px-4 space-y-2 mb-8"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            path={item.path}
            label={item.label}
            username={username}
            isHovering={isHovering}
            icon={item.icon}
          />
        ))}
      </ul>

      {/* User Profile Section with UserMenu component */}
      <div className="mt-auto border-t border-blue-800/30 p-4">
        <NavUser
          username={user?.username || undefined}
          userRole={user?.role || undefined}
          logout={logout}
          variant="none"
          position="top-left"
          fullWidth={true}
          className="p-0"
          customMenuItems={userMenuItems}
          data-testid="side-navbar-user-menu"
        />
      </div>
    </nav>
  )
}

export default SideNavbar