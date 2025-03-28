// components/Instance/Create/SetHostnameSection.tsx
import React, { useCallback } from "react";
import {
  ServerStackIcon,
  TagIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import Section from "../../Common/Section";

interface SetHostnameSectionProps {
    hostname: string;
    onHostnameChange: (hostname: string) => void;
}

const SetHostnameSection: React.FC<SetHostnameSectionProps> = React.memo(({ 
    hostname, 
    onHostnameChange 
}) => {
    // Sanitize hostname with useCallback
    const validateHostname = useCallback((value: string) => {
        // Remove spaces and special characters except hyphens
        const sanitizedValue = value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
        onHostnameChange(sanitizedValue);
    }, [onHostnameChange]);
    
    return (
        <Section
          title="Finalize Instance Details"
          icon={<ServerStackIcon className="w-5 h-5" />}
          description="Assign a unique hostname to help identify this instance"
        >
            <div className="w-full">
                <div className="flex items-center">
                    <TagIcon className="mr-2 w-6 h-6 text-purple-400" />
                    <input
                        type="text"
                        value={hostname}
                        onChange={(e) => validateHostname(e.target.value)}
                        placeholder="Enter hostname (e.g. web-server)"
                        className="flex-grow p-3 rounded-lg bg-[#23375F] border border-blue-800/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                </div>
                
                <div className="mt-4 ml-1 flex items-start gap-2 text-gray-400">
                    <InformationCircleIcon className="w-5 h-5" />
                    <p className="text-sm">
                        Hostname can only contain lowercase letters, numbers, and hyphens. Special characters and spaces will be automatically removed.
                    </p>
                </div>

                {/* {hostname && (
                    <div className="mt-4 bg-blue-900/20 p-3 rounded-lg border border-blue-800/30 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-purple-400" />
                        <p className="text-white">Your instance will be accessible at: <span className="font-mono bg-[#23375F] px-2 py-1 rounded">{hostname}.cloudboi.com</span></p>
                    </div>
                )} */}
            </div>
        </Section>
    );
});

export default SetHostnameSection;
