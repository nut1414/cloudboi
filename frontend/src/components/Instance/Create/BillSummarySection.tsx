// components/Instance/Create/BillSummarySection.tsx
import React, { useMemo } from "react"
import { InstancePlan, OsType } from "../../../client"
import { 
  CurrencyDollarIcon, 
  CpuChipIcon, 
  ServerIcon, 
  GlobeAltIcon,
  TagIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  ReceiptRefundIcon,
  InboxStackIcon
} from "@heroicons/react/24/outline"
import Section from "../../Common/Section"

interface BillSummarySectionProps {
    selectedPackage: InstancePlan | undefined
    selectedOs: OsType | undefined
    instanceName: string | undefined
}

const BillSummarySection: React.FC<BillSummarySectionProps> = React.memo(({ 
    selectedPackage, 
    selectedOs, 
    instanceName 
}) => {
    // Calculate monthly cost with useMemo to avoid recalculating on every render
    const { monthlyPrice, hourlyPrice } = useMemo(() => {
        const hourly = selectedPackage?.cost_hour.toFixed(6) || '0.000000'
        const monthly = selectedPackage ? (selectedPackage.cost_hour * 730).toFixed(2) : '0.00'
        
        return { monthlyPrice: monthly, hourlyPrice: hourly }
    }, [selectedPackage])
    
    return (
        <Section
          title="Cost Summary"
          icon={<ReceiptRefundIcon className="w-5 h-5" />}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-900/20 rounded-xl p-5 border border-blue-800/30">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-white">Estimated Cost</h3>
                        <span className="text-sm text-gray-400">730 hours/month</span>
                    </div>
                    
                    <div className="mb-4">
                        <p className="text-3xl font-bold text-white flex items-center gap-2">
                            <CurrencyDollarIcon className="h-6 w-6 text-purple-400" />
                            {monthlyPrice} <span className="text-sm font-normal text-gray-300">CBC/month</span>
                        </p>
                        <p className="text-sm text-gray-400 ml-7 mt-1">
                            {hourlyPrice} CBC/hour
                        </p>
                    </div>
                    
                    <div className="space-y-2 text-gray-300 mt-6">
                        {selectedPackage && (
                            <>
                                <div className="flex items-center gap-2">
                                    <CpuChipIcon className="w-5 h-5 text-purple-400" />
                                    <p>{selectedPackage.vcpu_amount} vCPUs</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <InboxStackIcon className="w-5 h-5 text-purple-400" />
                                    <p>{selectedPackage.ram_amount} GB RAM</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ServerIcon className="w-5 h-5 text-purple-400" />
                                    <p>{selectedPackage.storage_amount} GB SSD</p>
                                </div>
                                {/* <div className="flex items-center gap-2">
                                    <GlobeAltIcon className="w-5 h-5 text-purple-400" />
                                    <p>1 TB transfer included</p>
                                </div> */}
                            </>
                        )}
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/40 rounded-xl p-5 border border-purple-500/20">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-purple-400" />
                        Instance Summary
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <TagIcon className="w-5 h-5 text-purple-400 mt-1" />
                            <div>
                                <p className="text-gray-400 text-sm">Hostname</p>
                                <p className="text-white font-medium">{instanceName || '-'}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <ComputerDesktopIcon className="w-5 h-5 text-purple-400 mt-1" />
                            <div>
                                <p className="text-gray-400 text-sm">Operating System</p>
                                <p className="text-white font-medium">
                                    {selectedOs ? `${selectedOs.os_image_name} ${selectedOs.os_image_version}` : '-'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <DocumentTextIcon className="w-5 h-5 text-purple-400 mt-1" />
                            <div>
                                <p className="text-gray-400 text-sm">Package</p>
                                <p className="text-white font-medium">{selectedPackage?.instance_package_name || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    )
})

export default BillSummarySection
