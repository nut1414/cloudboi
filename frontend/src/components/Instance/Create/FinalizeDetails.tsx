// src/components/Instance/Create/FinalizeDetails.tsx
import React from "react";

interface FinalizeDetailsProps {
    hostname: string;
    onHostnameChange: (hostname: string) => void;
}

const FinalizeDetails: React.FC<FinalizeDetailsProps> = ({ 
    hostname, 
    onHostnameChange 
}) => {
    const validateHostname = (value: string) => {
        // Remove spaces and special characters except hyphens
        const sanitizedValue = value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
        onHostnameChange(sanitizedValue);
    };
    
    return (
        <>
            <p className="text-2xl pt-5 pb-5">Finalize Details</p>
            <div className="bg-gray-100 h-auto min-h-[200px] w-[650px] rounded-2xl flex flex-col justify-start items-start p-6">
                <p className="text-xl font-bold">Hostname</p>
                <p className="mt-2 text-gray-600">Assign a unique hostname to help identify this instance</p>
                
                <div className="w-full mt-4">
                    <input
                        type="text"
                        value={hostname}
                        onChange={(e) => validateHostname(e.target.value)}
                        placeholder="Enter hostname (e.g. my-web-server)"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <p className="mt-2 text-sm text-gray-500">
                        Hostname can only contain lowercase letters, numbers, and hyphens.
                    </p>
                </div>
            </div>
        </>
    );
};

export default FinalizeDetails;