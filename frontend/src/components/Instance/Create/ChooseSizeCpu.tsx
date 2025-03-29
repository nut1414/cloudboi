// src/components/Instance/Create/ChooseSizeCpu.tsx
import React from "react";
import OptionButton from "./OptionButton";
import { InstanceType } from "../../../tmp/type";

interface ChooseSizeCpuProps {
    instancePackages: InstanceType[];
    selectedInstanceType: InstanceType | undefined;
    onSelect: (instanceType: InstanceType) => void;
}

const ChooseSizeCpu: React.FC<ChooseSizeCpuProps> = ({ 
    instancePackages, 
    selectedInstanceType, 
    onSelect 
}) => {
    return (
        <>
            <p className="text-white text-2xl pt-10">Choose Size</p>
            <p className="text-white pt-2 pb-4">CPU options</p>
            <div className="flex gap-4">
                {instancePackages.map((packageOption, index) => (
                    <OptionButton 
                        key={packageOption.instance_type_id} 
                        label={packageOption.instance_package_name} 
                        isSelected={selectedInstanceType?.instance_type_id === packageOption.instance_type_id}
                        onClick={() => onSelect(packageOption)} 
                    />
                ))}
            </div>
            
            {selectedInstanceType && (
                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                    <p className="font-bold">{selectedInstanceType.instance_package_name} Details:</p>
                    <p>vCPUs: {selectedInstanceType.vcpu_amount}</p>
                    <p>RAM: {selectedInstanceType.ram_amount} GB</p>
                    <p>Storage: {selectedInstanceType.storage_amount} GB</p>
                    <p>Cost: ${selectedInstanceType.cost_hour.toFixed(4)}/hour</p>
                </div>
            )}
        </>
    );
};

export default ChooseSizeCpu;