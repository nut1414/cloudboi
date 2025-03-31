import React from "react"

interface MenuContainerProps {
  children: React.ReactNode
}

const MenuContainer: React.FC<MenuContainerProps> = ({ children }) => {
  return (
    <div className="p-6 bg-[#12203c] rounded-lg border border-blue-900/20">
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}

export default MenuContainer