// src/components/Instance/Create/BillSummary.tsx
import React from "react";
import { InstanceType, OsType } from "../../../tmp/type";

interface BillSummaryProps {
    selectedPackage: InstanceType | undefined;
    selectedOs: OsType | undefined;
    instanceName: string | undefined;
}

const BillSummary: React.FC<BillSummaryProps> = ({ 
    selectedPackage, 
    selectedOs, 
    instanceName 
}) => {
    // Calculate monthly cost (assuming 730 hours per month on average)
    const calculateMonthlyCost = () => {
        if (!selectedPackage) return 0;
        return (selectedPackage.cost_hour * 730).toFixed(2);
    };
    
    return (
        <>
            <p className="text-2xl pt-5 pb-5">Bill Summary</p>
            <div className="bg-gray-100 h-auto min-h-[200px] w-[650px] rounded-2xl flex flex-col p-6 mb-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-3">
                        {selectedPackage ? (
                            <>
                                <p className="font-bold text-lg">${calculateMonthlyCost()}/month</p>
                                <p>{selectedPackage.vcpu_amount} vCPUs</p>
                                <p>{selectedPackage.ram_amount} GB RAM</p>
                                <p>{selectedPackage.storage_amount} GB SSD</p>
                                <p>1 TB transfer included</p>
                            </>
                        ) : (
                            <p className="italic text-gray-500">Select a package to see pricing</p>
                        )}
                    </div>
                    
                    <div>
                        <div className="bg-blue-100 p-6 rounded-2xl h-full">
                            <h3 className="font-bold mb-4">Instance Summary</h3>
                            <p><span className="font-medium">Name:</span> {instanceName || '-'}</p>
                            <p><span className="font-medium">OS:</span> {selectedOs ? `${selectedOs.os_image_name} ${selectedOs.os_image_version}` : '-'}</p>
                            <p><span className="font-medium">Package:</span> {selectedPackage?.instance_package_name || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BillSummary;