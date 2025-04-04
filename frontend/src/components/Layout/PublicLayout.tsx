import React, { ReactNode } from "react"
import { Outlet } from "react-router-dom"
import PublicNavbar from "../Public/PublicNavbar"
import PublicFooter from "../Public/PublicFooter"

interface PublicLayoutProps {
  children?: ReactNode
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <PublicFooter />
    </div>
  )
}

export default PublicLayout
