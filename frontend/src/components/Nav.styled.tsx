import React from "react"

interface ComponentWithChildren {
    children? : React.ReactNode
}

export const NavContainer: React.FC<ComponentWithChildren> = ({ children }) => {
    return <nav className="bg-[#FFFEF9] text-white">{children}</nav>
}