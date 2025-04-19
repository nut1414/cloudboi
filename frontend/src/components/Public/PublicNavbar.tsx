import React from "react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import DropdownButton, { DropdownItemProps } from "../Common/Button/DropdownButton"
import TopNavbar, { TopNavItemProps } from "../Common/Navbar/TopNavbar"
import { NavLogo } from "../Common/Navbar/NavLogo"
import { NavUser } from "../Common/Navbar/NavUser"
import { useUser } from "../../contexts/userContext"
import { useAuth } from "../../hooks/User/useAuth"
import {
  UserIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  PuzzlePieceIcon
} from "@heroicons/react/24/outline"
import { CloudIcon as CloudIconSolid } from "@heroicons/react/24/solid"
import Button from "../Common/Button/Button"
import SkeletonLoader from "../Common/SkeletonLoader"

const PublicNavbar = () => {
  const { user, isAuthenticated, isLoading } = useUser()
  const { logout } = useAuth()

  // Logo component
  const Logo = (
    <CloudIconSolid className="h-9 w-9 bg-purple-500 p-1.5 rounded-md text-white" />
  )

  // About dropdown items
  const aboutDropdownItems: DropdownItemProps[] = [
    { href: "/about-company", content: "About Company" },
    { href: "/about-team", content: "Our Team" },
    { href: "/about-mission", content: "Our Mission" }
  ]

  const navItems: TopNavItemProps[] = [
    {
      href: "/",
      label: "Home",
      icon: <CloudIconSolid className="w-5 h-5" />
    },
    {
      label: (
        <DropdownButton
          content={
            <>
              <InformationCircleIcon className="w-5 h-5 mr-3" />
              <span>About Us</span>
            </>
          }
          variant="none"
          buttonType="none"
          dropdownClassName="mt-3"
          items={aboutDropdownItems}
        />
      ),
      isActive: window.location.pathname.includes("/about")
    },
    {
      href: "/pricing",
      label: "Pricing",
      icon: <CurrencyDollarIcon className="w-5 h-5" />
    },
    {
      href: "/use-cases",
      label: "Use Cases",
      icon: <PuzzlePieceIcon className="w-5 h-5" />
    }
  ]

  // Right section with auth controls
  const rightSection = (() => {
    const wrapperClasses = "ml-2 pl-4 border-l border-blue-800/30"

    if (isLoading) {
      return <div className={wrapperClasses}>
        <SkeletonLoader height="h-10" width="w-24" />
      </div>
    }

    if (isAuthenticated && user) {
      return (
        <div className={wrapperClasses}>
          <NavUser
            username={user.username ?? undefined}
            logout={logout}
            userRole={user.role ?? undefined}
            data-testid="public-navbar-user-menu"
          />
        </div>
      )
    } else {
      return (
        <div className={wrapperClasses}>
          <Button
            label="Sign In"
            href="/login"
            variant="purple"
            icon={<UserIcon className="w-5 h-5" />}
            data-testid="public-navbar-sign-in"
          />
        </div>
      )
    }
  })()

  return (
    <TopNavbar
      leftSection={<NavLogo logo={Logo} logoText="CloudBoi" />}
      navItems={navItems}
      rightSection={rightSection}
      navAlignment="end"
      variant="default"
      stickyTop={true}
    />
  )
}

export default PublicNavbar