// components/Instance/Create/ChooseSubscriptionPlanSection.tsx
import React, { useMemo } from "react"
import OptionButton from "../../Common/Button/OptionButton"
import { InstancePlan } from "../../../client"
import { 
  CpuChipIcon, 
  DocumentMagnifyingGlassIcon, 
  ScaleIcon, 
  BanknotesIcon,
  InboxStackIcon, // For RAM
  ServerIcon // For Storage
} from "@heroicons/react/24/outline"
import Section from "../../Common/Section"
import { CURRENCY } from "../../../constant/CurrencyConstant"

interface ChooseSubscriptionPlanSectionProps {
    instancePackages: InstancePlan[]
    selectedInstanceType: InstancePlan | undefined
    onSelect: (instanceType: InstancePlan) => void
}

const ChooseSubscriptionPlanSection: React.FC<ChooseSubscriptionPlanSectionProps> = React.memo(({ 
    instancePackages, 
    selectedInstanceType, 
    onSelect 
}) => {
    // Sort packages by name instead of cost
    const sortedPackages = useMemo(() => {
        return [...instancePackages].sort((a, b) => 
            a.instance_package_name.localeCompare(b.instance_package_name)
        )
    }, [instancePackages])

    return (
        <Section
          title="Choose instance size"
          icon={<CpuChipIcon className="w-5 h-5" />}
          description="Select the appropriate resource allocation for your workload"
        >
            <div className="flex flex-wrap gap-3 mb-6">
                {sortedPackages.map((packageOption) => (
                    <OptionButton 
                        key={packageOption.instance_plan_id} 
                        label={packageOption.instance_package_name}
                        icon={<ScaleIcon className="w-5 h-5" />}
                        isSelected={selectedInstanceType?.instance_plan_id === packageOption.instance_plan_id}
                        onClick={() => onSelect(packageOption)}
                        className="font-medium"
                    />
                ))}
            </div>
            
            {selectedInstanceType && (
                <div className="mt-4 bg-blue-900/20 p-5 rounded-lg border border-blue-800/30 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <DocumentMagnifyingGlassIcon className="w-5 h-5 text-purple-400" />
                        <p className="font-bold text-lg">{selectedInstanceType.instance_package_name}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pl-2">
                        <div className="flex items-center gap-2">
                            <CpuChipIcon className="w-5 h-5 text-purple-400" />
                            <p>{selectedInstanceType.vcpu_amount} vCPUs</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <InboxStackIcon className="w-5 h-5 text-purple-400" />
                            <p>{selectedInstanceType.ram_amount} GB RAM</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <ServerIcon className="w-5 h-5 text-purple-400" />
                            <p>{selectedInstanceType.storage_amount} GB SSD</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <BanknotesIcon className="w-5 h-5 text-purple-400" />
                            <p>{CURRENCY.FORMAT_HOURLY(selectedInstanceType.cost_hour)}</p>
                        </div>
                    </div>
                </div>
            )}
        </Section>
    )
})

export default ChooseSubscriptionPlanSection