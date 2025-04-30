import React, { useMemo, useState } from "react"
import { ClusterMemberStateInfo, formatBytes, formatResourceUsage } from "../../utils/systemState"
import ItemCard from "../Common/ItemCard"
import ProgressBar from "../Common/ProgressBar"
import TagBadge from "../Common/TagBadge"
import StatusBadge from "../Common/StatusBadge"
import { InstanceStatus } from "../../constant/InstanceConstant"

// Create a separate component for the system metrics card
const SystemMetricsCard = React.memo(({ member }: { member: ClusterMemberStateInfo }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const formattedValues = useMemo(() => {
    const cpuText = `${member.percentage_cpu.toFixed(1)}% (${
      member.logical_cpus
    } CPU${member.logical_cpus > 1 ? "s" : ""})`

    const ramText = `${formatResourceUsage(
      member.total_ram - member.free_ram,
      member.total_ram
    )} (${formatBytes(member.total_ram - member.free_ram)} / ${formatBytes(
      member.total_ram
    )})`

    const storageText = `${formatResourceUsage(
      member.local_space_used,
      member.local_space_total
    )} (${formatBytes(member.local_space_used)} / ${formatBytes(member.local_space_total)})`

    return {
      cpuText,
      ramText,
      storageText,
    }
  }, [member])

  // Check if any group contains 'resource'
  const isResource = useMemo(() => 
    member.groups.some(group => /resource/i.test(group))
  , [member.groups])

  return (
    <ItemCard
      title={member.server_name}
      data-testid={`system-metrics-card-${member.server_name}`}
      isCollapsible={true}
      isCollapsed={isCollapsed}
      onCollapseToggle={() => setIsCollapsed(!isCollapsed)}
      rightHeader={
        <div className="flex gap-2">
          {isResource && (
            <TagBadge text="Resource" variant="blue" />
          )}
          {member.is_leader && (
            <TagBadge text="Web Service" variant="purple" />
          )}
          <StatusBadge
            status={member.status === "Online" ? InstanceStatus.RUNNING : InstanceStatus.STOPPED} 
            showDot={true}
            size="sm"
          />
        </div>
      }
      detailItems={[
        {
          label: "Groups",
          value: (
            <div className="flex flex-wrap gap-2">
              {member.groups.map((group: string) => (
                <TagBadge
                  key={group}
                  text={group}
                  variant="gray"
                  className="border border-blue-500/50 bg-transparent text-blue-400"
                />
              ))}
            </div>
          )
        },
        {
          label: "RAM Usage",
          value: (
            <div>
              <ProgressBar 
                percentage={member.percentage_ram} 
                color="blue"
                className="mb-2"
              />
              <p className="text-gray-400 text-sm">{formattedValues.ramText}</p>
            </div>
          )
        },
        {
          label: "CPU Usage",
          value: (
            <div>
              <ProgressBar 
                percentage={member.percentage_cpu} 
                color="purple"
                className="mb-2"
              />
              <p className="text-gray-400 text-sm">{formattedValues.cpuText}</p>
            </div>
          )
        },
        {
          label: "Storage Usage",
          value: (
            <div>
              <ProgressBar 
                percentage={member.local_space_percentage} 
                color="blue"
                className="mb-2"
              />
              <p className="text-gray-400 text-sm">{formattedValues.storageText}</p>
            </div>
          )
        }
      ]}
      className="min-w-[300px]"
    />
  )
})

export default SystemMetricsCard