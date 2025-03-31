// InstanceSettingPage.tsx
import React, { useState, useEffect } from "react"
import { Cog6ToothIcon, CommandLineIcon, BoltIcon, GlobeAltIcon, TrashIcon } from "@heroicons/react/24/outline"
import InstanceSettingContent from "../../components/Instance/Setting/InstanceSettingContent"
import PageContainer from "../../components/Layout/PageContainer"
import StatusBadge from "../../components/Common/StatusBadge"
import { useInstanceSetting } from "../../hooks/Instance/useInstanceSetting"
import SkeletonLoader from "../../components/Common/SkeletonLoader"

const InstanceSettingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("AccessMenu")
  const { instance, isLoading, formatUptime } = useInstanceSetting()

  // Define tabs with icons for better visual hierarchy
  const tabs = [
    { id: "AccessMenu", label: "Access", icon: <CommandLineIcon className="w-5 h-5" /> },
    { id: "PowersMenu", label: "Power", icon: <BoltIcon className="w-5 h-5" /> },
    { id: "NetworkingMenu", label: "Networking", icon: <GlobeAltIcon className="w-5 h-5" /> },
    { id: "DestroyMenu", label: "Destroy", icon: <TrashIcon className="w-5 h-5" /> },
  ]

  // Status widget for the right side of the header
  const statusWidget = instance && (
    <div className="bg-[#192A51] px-4 py-2 rounded-lg shadow-lg border border-blue-800/20">
      <div className="flex items-center space-x-3 text-gray-300 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-400">Status:</span>
          <StatusBadge status={instance.instance_status.toLowerCase()} size="sm" />
        </div>
        <div className="h-8 w-px bg-blue-800/30"></div>
        <div className="flex flex-col">
          <span className="text-gray-400">Plan:</span>
          <span>{instance.instance_plan.instance_package_name}</span>
        </div>
        <div className="h-8 w-px bg-blue-800/30"></div>
        <div className="flex flex-col">
          <span className="text-gray-400">Uptime:</span>
          <span>{formatUptime(instance.last_updated_at)}</span>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <PageContainer
        title={<SkeletonLoader height="h-7" width="w-64" />}
      >
        {/* Navigation Tabs Skeleton */}
        <div className="border-b border-blue-900/30 mb-6">
          <nav className="flex -mb-px">
            {Array(tabs.length).fill(0).map((_, index) => (
              <div
                key={index}
                className="mr-8 py-3 flex items-center"
              >
                <SkeletonLoader height="h-5" width="w-5" rounded="rounded-md" className="mr-2" />
                <SkeletonLoader height="h-5" width="w-16" />
              </div>
            ))}
          </nav>
        </div>

        {/* Content Area Skeleton */}
        <div className="space-y-6">
          {/* Form Fields Skeleton */}
          <div className="space-y-4">
            <SkeletonLoader height="h-10" rounded="rounded-md" />
            <SkeletonLoader height="h-10" rounded="rounded-md" />
            <SkeletonLoader height="h-10" rounded="rounded-md" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="pt-4 flex space-x-3">
            <SkeletonLoader height="h-10" width="w-32" rounded="rounded-md" />
            <SkeletonLoader height="h-10" width="w-32" rounded="rounded-md" />
          </div>
        </div>
      </PageContainer>
    )
  }

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
      title={instance.instance_name}
      subtitle="Instance Settings"
      subtitleIcon={<Cog6ToothIcon className="w-4 h-4" />}
      rightContent={statusWidget}
    >
      {/* Navigation Tabs with Active Indicator */}
      <div className="border-b border-blue-900/30 mb-6">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                mr-8 py-3 flex items-center border-b-2 transition-colors text-base font-medium
                ${activeTab === tab.id
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"}
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <InstanceSettingContent active={activeTab} />
    </PageContainer>
  )
}

export default React.memo(InstanceSettingPage)
