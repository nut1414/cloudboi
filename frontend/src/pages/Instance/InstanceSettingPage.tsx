// InstanceSettingPage.tsx
import React, { useState } from "react"
import { Cog6ToothIcon, CommandLineIcon, BoltIcon, GlobeAltIcon, TrashIcon, ChartBarIcon } from "@heroicons/react/24/outline"
import InstanceSettingContent from "../../components/Instance/Setting/InstanceSettingContent"
import PageContainer from "../../components/Layout/PageContainer"
import StatusBadge from "../../components/Common/StatusBadge"
import { useInstanceSetting } from "../../hooks/Instance/useInstanceSetting"
import SkeletonLoader from "../../components/Common/SkeletonLoader"
import TabNavigation, { TabItem } from "../../components/Common/Tab/TabNavigation"
import TabSkeletonLoader from "../../components/Common/Tab/TabSkeletonLoader"

const InstanceSettingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("AccessMenu")
  const { instance, isLoading, getFormattedUptime } = useInstanceSetting()

  // Define tabs with icons for better visual hierarchy
  const tabs: TabItem[] = [
    { id: "AccessMenu", label: "Access", icon: <CommandLineIcon className="w-5 h-5" /> },
    { id: "PowersMenu", label: "Power", icon: <BoltIcon className="w-5 h-5" /> },
    { id: "NetworkingMenu", label: "Networking", icon: <GlobeAltIcon className="w-5 h-5" /> },
    { id: "MonitorMenu", label: "Monitor", icon: <ChartBarIcon className="w-5 h-5" /> },
    { id: "DestroyMenu", label: "Destroy", icon: <TrashIcon className="w-5 h-5" /> },
  ]

  // Status widget for the right side of the header
  const statusWidget = instance && (
    <div className="bg-[#192A51] px-4 py-2 rounded-lg shadow-lg border border-blue-800/20">
      <div className="flex items-center space-x-3 text-gray-300 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-400">Status:</span>
          <StatusBadge status={instance.instance_status} size="sm" />
        </div>
        <div className="h-8 w-px bg-blue-800/30"></div>
        <div className="flex flex-col">
          <span className="text-gray-400">Plan:</span>
          <span>{instance.instance_plan.instance_package_name}</span>
        </div>
        <div className="h-8 w-px bg-blue-800/30"></div>
        <div className="flex flex-col">
          <span className="text-gray-400">Uptime:</span>
          <span>{getFormattedUptime(instance.last_updated_at)}</span>
        </div>
      </div>
    </div>
  )

  if (!instance) {
    return (
      <PageContainer title="Instance Not Found" subtitle="Error loading instance">
        <div className="bg-red-900/20 p-4 rounded-lg border border-red-800/30">
          <p className="text-red-400">The requested instance could not be found or you don't have access to it.</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={isLoading ? <SkeletonLoader height="h-7" width="w-64" /> : instance.instance_name}
      subtitle="Instance Settings"
      subtitleIcon={<Cog6ToothIcon className="w-4 h-4" />}
      rightContent={isLoading ? <></> : statusWidget}
    >
      {isLoading ? (
          <TabSkeletonLoader count={tabs.length} />
        ) : (
          <>
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              data-testid="instance-setting"
            />
            <InstanceSettingContent active={activeTab} />
          </>
        )}
    </PageContainer>
  )
}

export default React.memo(InstanceSettingPage)
