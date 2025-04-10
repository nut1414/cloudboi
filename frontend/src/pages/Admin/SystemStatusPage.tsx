import React, { useEffect } from "react"
import { ArrowPathIcon, ServerStackIcon } from "@heroicons/react/24/outline"
import { useClusterState } from "../../hooks/Admin/useClusterState"
import Button from "../../components/Common/Button/Button"
import SystemMetricsCardSkeleton from "../../components/System/SystemMetricsCardSkeleton"
import SystemMetricsCard from "../../components/System/SystemMetricsCard"
import PageContainer from "../../components/Layout/PageContainer"

const SystemStatusPage: React.FC = () => {
  const {
    clusterMembers,
    updateClusterState,
    isLoading,
    error,
  } = useClusterState()

  useEffect(() => {
    // Initial fetch
    updateClusterState()
  }, [updateClusterState])

  if (error) {
    return (
      <PageContainer title="System Status">
        <div className="bg-red-500/20 text-red-400 p-4 rounded-lg">
          Error loading system status: {error}
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="System Status"
      subtitle="Monitor system resources and server status"
      subtitleIcon={<ServerStackIcon className="w-4 h-4" />}
      rightContent={
        <Button
          onClick={updateClusterState}
          disabled={isLoading}
          label=""
          icon={
            <ArrowPathIcon
              className={`w-5 h-5 text-gray-400 hover:text-purple-400 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
          }
          variant="outline"
          className="pr-0 pl-2 flex items-center justify-center min-w-[36px] min-h-[36px]"
        />
      }
    >
      {/* Machine Usage */}
      <div>
        <h2 className="text-white text-2xl font-semibold mb-4">
          Machine Usage
        </h2>
        <div className="flex flex-wrap gap-6">
          {isLoading && clusterMembers.length === 0 && (
            <>
              <SystemMetricsCardSkeleton />
            </>
          )}
          {clusterMembers.map((member) => (
            <div key={member.server_name} className="col-span-1">
              <SystemMetricsCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}

export default SystemStatusPage
