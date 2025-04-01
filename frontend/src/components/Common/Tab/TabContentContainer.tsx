import React from "react"

interface TabContentContainerProps {
  children: React.ReactNode
}

const TabContentContainer: React.FC<TabContentContainerProps> = ({ children }) => {
  return (
    <div className="p-6 bg-[#12203c] rounded-lg border border-blue-900/20">
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}

export default TabContentContainer