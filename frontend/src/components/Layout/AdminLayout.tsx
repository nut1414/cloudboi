import React, { ReactNode } from "react"
import { Outlet } from "react-router-dom"
import SideNavbar, { NavItemProps } from "../Common/Navbar/SideNavbar"
import { ComputerDesktopIcon, UserGroupIcon, CreditCardIcon } from "@heroicons/react/24/outline"

interface AdminLayoutProps {
  children?: ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
}) => {
    const adminNavItems: NavItemProps[] = [
        {
            path: "system",
            label: "System",
            icon: <ComputerDesktopIcon className="h-5 w-5" />
        },
        {
            path: "users",
            label: "Users",
            icon: <UserGroupIcon className="h-5 w-5" />
        },
        {
            path: "plans",
            label: "Plans",
            icon: <CreditCardIcon className="h-5 w-5" />
        },
        {
            path: "billing",
            label: "Billing",
            icon: <CreditCardIcon className="h-5 w-5" />
        },
        {
            path: "credits",
            label: "Credits",
            icon: <CreditCardIcon className="h-5 w-5" />
        },
    ]

    return (
        <div className="flex w-screen h-screen">
            <SideNavbar navItems={adminNavItems} />
            <main className="flex-grow overflow-auto transition-all duration-300">
                {children || <Outlet />}
            </main>
        </div>
    )
}

export default AdminLayout
