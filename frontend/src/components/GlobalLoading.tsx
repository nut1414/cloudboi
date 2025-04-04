import React from "react"
import { CloudIcon } from "@heroicons/react/24/solid"
import SkeletonLoader from "./Common/SkeletonLoader"

const GlobalLoading: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center bg-[#0F1C3A] p-6">
      <div className="flex flex-col items-center max-w-md w-full">
        {/* Logo and app name */}
        <div className="flex items-center mb-8">
          <CloudIcon className="bg-purple-500 w-10 h-10 rounded-md mr-2" />
          <span className="text-white text-2xl font-bold">CloudBoi</span>
        </div>
        
        {/* Skeleton loaders for content */}
        <div className="bg-[#192A51] p-6 rounded-xl border border-blue-900/50 w-full space-y-4">
          <SkeletonLoader height="h-6" width="w-3/4" />
          <SkeletonLoader height="h-24" />
          <div className="grid grid-cols-2 gap-4">
            <SkeletonLoader height="h-10" />
            <SkeletonLoader height="h-10" />
          </div>
          <SkeletonLoader height="h-12" />
        </div>
      </div>
    </div>
  )
}

export default GlobalLoading