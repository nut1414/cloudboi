import React from "react"
import { ChartBarIcon, CpuChipIcon, InboxStackIcon, ArrowPathIcon } from "@heroicons/react/24/outline"
import Section from "../../../components/Common/Section"
import Button from "../../../components/Common/Button/Button"
import { formatBytes } from "../../../utils/systemState"

interface MonitorMenuProps {
    instanceState: any
    isLoading: boolean
    getInstanceStateAndUpdate: () => void
}

const MonitorMenu: React.FC<MonitorMenuProps> = ({ 
    instanceState, 
    isLoading,
    getInstanceStateAndUpdate 
}) => {
    const { memory, cpu } = instanceState || { memory: { used: 0, total: 0, percentage: 0 }, cpu: { usage: 0, cores: 0 } }

    const handleRefresh = () => {
        getInstanceStateAndUpdate()
    }

    return (
        <Section
            title="Resource Monitor"
            icon={<ChartBarIcon className="w-5 h-5" />}
            description="Monitor current instance resource usage."
            rightContent={
                <Button
                    onClick={handleRefresh}
                    label=""
                    icon={<ArrowPathIcon className="w-5 h-5 text-gray-400 hover:text-purple-400" />}
                    variant="outline"
                    className="pr-0 pl-2 flex items-center justify-center min-w-[36px] min-h-[36px]"
                    disabled={isLoading}
                />
            }
        >
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#23375F] p-4 rounded-lg border border-blue-800/20">
                    <div className="flex items-center gap-2 mb-3">
                        <CpuChipIcon className="w-5 h-5 text-purple-400" />
                        <p className="text-gray-400">CPU Usage</p>
                    </div>
                    <div className="space-y-2">
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div 
                                className="bg-purple-600 h-2.5 rounded-full" 
                                style={{ width: `${Math.min(cpu.usage, 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white">{cpu.usage.toFixed(1)}%</span>
                            <span className="text-gray-400" data-testid="cpu-cores">{cpu.cores} core{cpu.cores !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#23375F] p-4 rounded-lg border border-blue-800/20">
                    <div className="flex items-center gap-2 mb-3">
                        <InboxStackIcon className="w-5 h-5 text-purple-400" />
                        <p className="text-gray-400">Memory Usage</p>
                    </div>
                    <div className="space-y-2">
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div 
                                className="bg-purple-600 h-2.5 rounded-full" 
                                style={{ width: `${memory.percentage}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white">{memory.percentage.toFixed(1)}%</span>
                            <span className="text-gray-400" data-testid="memory-used">
                                {formatBytes(memory.used)} / {formatBytes(memory.total)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    )
}

export default MonitorMenu 