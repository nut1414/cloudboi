import React, { ReactNode } from "react"
import { Outlet } from "react-router-dom"
import SideNavbar from "../Navbar/SideNavbar"

interface DefaultLayoutProps {
  children?: ReactNode // Optional children instead of using Outlet
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  children,
}) => {
  return (
    <div className="flex w-screen h-screen">
      <SideNavbar />
      <main className="flex-grow overflow-auto transition-all duration-300">
        {children || <Outlet />}
      </main>
    </div>
  )
}

export default DefaultLayout
