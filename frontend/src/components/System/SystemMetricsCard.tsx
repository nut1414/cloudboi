import React, { useMemo } from "react"
import { formatBytes, formatResourceUsage } from "../../utils/systemState"

interface SystemMetricsCardProps {
  title: string
  status: string
  roles: string[]
  groups: string[]
  ramUsage: {
    total: number
    free: number
    percentage: number
  }
  cpuUsage: {
    loadOne: number
    loadFive: number
    loadFifteen: number
    percentage: number
    logicalCpus: number
  }
  storage: {
    total: number
    used: number
    percentage: number
  }
  isLeader?: boolean
}

export const SystemMetricsCard: React.FC<SystemMetricsCardProps> = ({
  title,
  status,
  groups,
  ramUsage,
  cpuUsage,
  storage,
  isLeader = false,
}) => {
  // Check if any group contains 'resource'
  const isResource = useMemo(() => {
    return groups.some(group => /resource/i.test(group))
  }, [groups])

  // Memoize formatted values
  const formattedValues = useMemo(() => {
    const cpuText = `${cpuUsage.percentage.toFixed(1)}% (${
      cpuUsage.logicalCpus
    } CPU${cpuUsage.logicalCpus > 1 ? "s" : ""})`

    const ramText = `${formatResourceUsage(
      ramUsage.total - ramUsage.free,
      ramUsage.total
    )} (${formatBytes(ramUsage.total - ramUsage.free)} / ${formatBytes(
      ramUsage.total
    )})`
    const storageText = `${formatResourceUsage(
      storage.used,
      storage.total
    )} (${formatBytes(storage.used)} / ${formatBytes(storage.total)})`

    return {
      cpuText,
      ramText,
      storageText,
    }
  }, [cpuUsage, ramUsage, storage])

  return (
    <div className="bg-[#192A51] rounded-xl border border-blue-900/50 p-6 min-w-[300px] h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-xl font-semibold">{title}</h3>
        <div className="flex gap-2">
          {isResource && (
            <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded">
              Resource
            </span>
          )}
          {isLeader && (
            <span className="bg-purple-500 text-white text-sm px-2 py-1 rounded">
              Web Service
            </span>
          )}
        </div>
      </div>

      <span
        className={`inline-block px-2 py-1 rounded text-sm mb-4 ${
          status === "Online"
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
        }`}
      >
        {status}
      </span>

      <div className="flex flex-wrap gap-2 mb-4">
        {groups.map((group) => (
          <span
            key={group}
            className="border border-blue-500/50 text-blue-400 text-sm px-2 py-1 rounded"
          >
            {group}
          </span>
        ))}
      </div>

      {/* RAM Usage */}
      <div className="mb-4">
        <h4 className="text-gray-300 text-sm font-medium mb-2">RAM Usage</h4>
        <div className="h-2 bg-blue-900/20 rounded overflow-hidden mb-2">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${ramUsage.percentage}%` }}
          />
        </div>
        <p className="text-gray-400 text-sm">{formattedValues.ramText}</p>
      </div>

      {/* CPU Usage */}
      <div className="mb-4">
        <h4 className="text-gray-300 text-sm font-medium mb-2">CPU Usage</h4>
        <div className="h-2 bg-blue-900/20 rounded overflow-hidden mb-2">
          <div
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${cpuUsage.percentage}%` }}
          />
        </div>
        <p className="text-gray-400 text-sm">
          {formattedValues.cpuText}
        </p>
      </div>

      {/* Storage Usage */}
      <div>
        <h4 className="text-gray-300 text-sm font-medium mb-2">
          Storage Usage
        </h4>
        <div className="h-2 bg-blue-900/20 rounded overflow-hidden mb-2">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${storage.percentage}%` }}
          />
        </div>
        <p className="text-gray-400 text-sm">{formattedValues.storageText}</p>
      </div>
    </div>
  )
}
