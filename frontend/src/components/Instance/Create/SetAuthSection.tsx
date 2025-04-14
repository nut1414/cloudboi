// components/Instance/Create/SetAuthSection.tsx
import React, { useState, useCallback } from "react"
import {
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    ShieldCheckIcon
} from "@heroicons/react/24/outline"
import Section from "../../Common/Section"
import InputField from "../../Common/InputField"
import RequirementsChecklist from "../../Common/RequirementsChecklist"
import { getPasswordRequirements } from "../../../utils/instanceUtils"

interface SetAuthSectionProps {
    password: string
    onPasswordChange: (password: string) => void
}

const SetAuthSection: React.FC<SetAuthSectionProps> = React.memo(({
    password,
    onPasswordChange
}) => {
    const [showPassword, setShowPassword] = useState(false)

    // Toggle password visibility with useCallback
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev)
    }, [])

    // Handle password change
    const handleChange = useCallback((newPassword: string) => {
        onPasswordChange(newPassword)
    }, [onPasswordChange])

    return (
        <Section
            title="Set Authentication"
            icon={<LockClosedIcon className="w-5 h-5" />}
            description="Choose a secure root password to access and manage your instance"
        >
            <div className="w-full mb-6">
                <InputField
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handleChange}
                    placeholder="Enter secure password..."
                    endIcon={showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    onEndIconClick={togglePasswordVisibility}
                />
            </div>

            <RequirementsChecklist
                className="px-3"
                requirements={getPasswordRequirements(password)}
                title="Password requirements"
                icon={<ShieldCheckIcon className="w-5 h-5" />}
                columns={2}
                iconSize="md"
            />
        </Section>
    )
})

export default SetAuthSection
