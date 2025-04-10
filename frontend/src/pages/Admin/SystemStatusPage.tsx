import React, { useEffect } from "react"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { useClusterState } from "../../hooks/Admin/useClusterState"
import { SystemMetricsCard } from "../../components/System/SystemMetricsCard"
import Button from "../../components/Common/Button/Button"
import SystemMetricsCardSkeleton from "../../components/System/SystemMetricsCardSkeleton"

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
      <div className="container mx-auto px-4">
        <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mt-6">
          Error loading system status: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-white text-3xl font-bold">System Status</h1>
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
      </div>

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
              <SystemMetricsCard
                title={member.server_name}
                status={member.status}
                roles={member.roles}
                groups={member.groups}
                ramUsage={{
                  total: member.total_ram,
                  free: member.free_ram,
                  percentage: member.percentage_ram,
                }}
                cpuUsage={{
                  loadOne: member.load_one,
                  loadFive: member.load_five,
                  loadFifteen: member.load_fifteen,
                  percentage: member.percentage_cpu,
                  logicalCpus: member.logical_cpus,
                }}
                storage={{
                  total: member.local_space_total,
                  used: member.local_space_used,
                  percentage: member.local_space_percentage,
                }}
                isLeader={member.is_leader}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SystemStatusPage
