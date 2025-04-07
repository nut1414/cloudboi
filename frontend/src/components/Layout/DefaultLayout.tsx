import React, { ReactNode } from "react"
import { Outlet, useParams } from "react-router-dom"
import SideNavbar from "../Common/Navbar/SideNavbar"

interface DefaultLayoutProps {
  children?: ReactNode // Optional children instead of using Outlet
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  children,
}) => {
  const { userName } = useParams<{ userName: string }>()

  return (
    <div className="flex w-screen h-screen">
      <SideNavbar username={userName} />
      <main className="flex-grow overflow-auto transition-all duration-300">
        {children || <Outlet />}
      </main>
    </div>
  )
}

export default DefaultLayout
