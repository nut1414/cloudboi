import React, { useState } from "react";
import { Cog6ToothIcon, CommandLineIcon, BoltIcon, GlobeAltIcon, TrashIcon } from "@heroicons/react/24/outline";
import InstanceSettingContent from "../../components/Instance/Setting/InstanceSettingContent";
import PageContainer from "../../components/Layout/PageContainer";
import StatusBadge from "../../components/Common/StatusBadge";

const InstanceSettingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("AccessMenu");

  // Define tabs with icons for better visual hierarchy
  const tabs = [
    { id: "AccessMenu", label: "Access", icon: <CommandLineIcon className="w-5 h-5" /> },
    { id: "PowersMenu", label: "Power", icon: <BoltIcon className="w-5 h-5" /> },
    { id: "NetworkingMenu", label: "Networking", icon: <GlobeAltIcon className="w-5 h-5" /> },
    { id: "DestroyMenu", label: "Destroy", icon: <TrashIcon className="w-5 h-5" /> },
  ];

  // Status widget for the right side of the header
  const statusWidget = (
    <div className="bg-[#192A51] px-4 py-2 rounded-lg shadow-lg border border-blue-800/20">
      <div className="flex items-center space-x-3 text-gray-300 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-400">Status:</span>
          <StatusBadge status="running" size="sm" />
        </div>
        <div className="h-8 w-px bg-blue-800/30"></div>
        <div className="flex flex-col">
          <span className="text-gray-400">IP:</span>
          <span>192.168.1.100</span>
        </div>
        <div className="h-8 w-px bg-blue-800/30"></div>
        <div className="flex flex-col">
          <span className="text-gray-400">Uptime:</span>
          <span>10d 4h 30m</span>
        </div>
      </div>
    </div>
  );

  return (
    <PageContainer 
      title="Cloud Instance Name"
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
      
      {/* Content Area - no longer needs the redundant container since MenuContainer handles it */}
      <InstanceSettingContent active={activeTab} />
    </PageContainer>
  );
};

export default React.memo(InstanceSettingPage);