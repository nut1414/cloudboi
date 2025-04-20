import React, { useCallback } from "react"
import {
    ServerStackIcon,
    TagIcon
} from "@heroicons/react/24/outline"
import Section from "../../Common/Section"
import InputField from "../../Common/InputField" // Import the new component

interface SetHostnameSectionProps {
    hostname: string
    onHostnameChange: (hostname: string) => void
}

const SetHostnameSection: React.FC<SetHostnameSectionProps> = React.memo(({
    hostname,
    onHostnameChange
}) => {
    // Sanitize hostname with useCallback
    const sanitizeHostname = useCallback((value: string) => {
        // Remove spaces and special characters except hyphens
        return value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()
    }, [])

    return (
        <Section
            title="Finalize Instance Details"
            icon={<ServerStackIcon className="w-5 h-5" />}
            description="Assign a unique hostname to help identify this instance"
        >
            <div className="w-full">
                <InputField
                    value={hostname}
                    onChange={onHostnameChange}
                    icon={<TagIcon className="w-6 h-6 text-purple-400" />}
                    placeholder="Enter hostname (e.g. web-server)"
                    sanitizeValue={sanitizeHostname}
                    helperText="Hostname can only contain lowercase letters, numbers, and hyphens. Special characters and spaces will be automatically removed."
                    data-testid={`hostname-input`}
                />
            </div>
        </Section>
    )
})

export default SetHostnameSection