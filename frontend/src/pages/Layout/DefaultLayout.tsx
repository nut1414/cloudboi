import React from "react"
import { Outlet } from "react-router-dom"
import SideNavbar from "../../components/Navbar/SideNavbar"

const DefaultLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen">
            {/* Navbar takes fixed width */}
            <SideNavbar />
            
            {/* Main content area with left margin equal to navbar width */}
            <main className="flex-1 ml-10 p-6">
                <Outlet />
            </main>
        </div>
    )
}

export default DefaultLayout