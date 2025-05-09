// components/Common/TabNavigation.tsx
import React from "react"
import { useTestId } from "../../../utils/testUtils"

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabNavigationProps {
  tabs: TabItem[]
  activeTab: string
  setActiveTab: (id: string) => void
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  tabs, 
  activeTab, 
  setActiveTab,
  ...restProps
}) => {
  const { dataTestId, cleanProps } = useTestId(restProps)

  return (
    <div className="border-b border-blue-900/30 mb-6"
      data-testid={dataTestId ? `${dataTestId}-tab-navigation` : undefined}
      {...cleanProps}
    >
      <nav className="flex -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              mr-8 py-3 flex items-center border-b-2 transition-colors text-base font-medium
              ${activeTab === tab.id
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"}
            `}
            data-testid={dataTestId ? `${dataTestId}-tab-button-${tab.id}` : undefined}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default TabNavigation
