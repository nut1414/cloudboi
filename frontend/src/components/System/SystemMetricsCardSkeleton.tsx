import React from "react"
import SkeletonLoader from "../Common/SkeletonLoader"

const SystemMetricsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#192A51] rounded-xl border border-blue-900/50 p-6 min-w-[300px] h-fit">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <SkeletonLoader width="w-1/2" height="h-7" variant="dark" />
        <SkeletonLoader width="w-24" height="h-6" variant="purple" />
      </div>

      {/* Status */}
      <SkeletonLoader width="w-20" height="h-6" className="mb-4" variant="dark" />

      {/* Groups */}
      <div className="flex flex-wrap gap-2 mb-4">
        <SkeletonLoader width="w-20" height="h-6" variant="blue" />
        <SkeletonLoader width="w-24" height="h-6" variant="blue" />
        <SkeletonLoader width="w-16" height="h-6" variant="blue" />
      </div>

      {/* RAM Usage */}
      <div className="mb-4">
        <SkeletonLoader width="w-24" height="h-5" className="mb-2" variant="dark" />
        <SkeletonLoader width="w-full" height="h-2" className="mb-2" variant="blue" />
        <SkeletonLoader width="w-40" height="h-5" variant="dark" />
      </div>

      {/* CPU Usage */}
      <div className="mb-4">
        <SkeletonLoader width="w-24" height="h-5" className="mb-2" variant="dark" />
        <SkeletonLoader width="w-full" height="h-2" className="mb-2" variant="purple" />
        <SkeletonLoader width="w-32" height="h-5" variant="dark" />
      </div>

      {/* Storage Usage */}
      <div>
        <SkeletonLoader width="w-24" height="h-5" className="mb-2" variant="dark" />
        <SkeletonLoader width="w-full" height="h-2" className="mb-2" variant="blue" />
        <SkeletonLoader width="w-48" height="h-5" variant="dark" />
      </div>
    </div>
  )
}

export default SystemMetricsCardSkeleton 