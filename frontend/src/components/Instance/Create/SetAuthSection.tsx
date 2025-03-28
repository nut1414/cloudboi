import React, { useState, useCallback, useMemo } from "react"
import {
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    ShieldCheckIcon,
    CheckCircleIcon,
    XCircleIcon
} from "@heroicons/react/24/outline"
import Section from "../../Common/Section"

interface SetAuthSectionProps {
    password: string
    onPasswordChange: (password: string) => void
}

// Requirements configuration for easier maintenance
const PASSWORD_REQUIREMENTS = [
    { key: 'length', label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
    { key: 'uppercase', label: 'Uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { key: 'lowercase', label: 'Lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
    { key: 'number', label: 'Number', test: (pwd: string) => /[0-9]/.test(pwd) },
    { key: 'special', label: 'Special character', test: (pwd: string) => /[!@#$%^&*()_+\-=\[\]{}':"\\|,.<>\/?]/.test(pwd) }
]

const SetAuthSection: React.FC<SetAuthSectionProps> = React.memo(({
    password,
    onPasswordChange
}) => {
    const [showPassword, setShowPassword] = useState(false)

    // Password requirements check with useMemo
    const passwordChecks = useMemo(() => {
        return PASSWORD_REQUIREMENTS.reduce((acc, { key, test }) => ({
            ...acc,
            [key]: test(password)
        }), {} as Record<string, boolean>)
    }, [password])

    // Toggle password visibility with useCallback
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev)
    }, [])

    return (
        <Section
          title="Set Authentication"
          icon={<LockClosedIcon className="w-5 h-5" />}
          description="Choose a secure root password to access and manage your instance"
        >
            <div className="w-full relative mb-6">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder="Enter secure password..."
                    className="w-full p-3 rounded-lg bg-[#23375F] border border-blue-800/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                />
                <button
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-purple-400 focus:outline-none"
                    type="button"
                >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
            </div>

            <div className="w-full">
                <p className="text-lg text-white font-medium mb-3 flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-purple-400" />
                    Password requirements
                </p>
                <div className="grid grid-cols-2 gap-y-2 pl-2">
                    {PASSWORD_REQUIREMENTS.map(({ key, label }) => {
                        const passed = passwordChecks[key]
                        return (
                            <div key={key} className={`flex items-center ${passed ? 'text-green-400' : 'text-gray-400'}`}>
                                {passed ? <CheckCircleIcon className="w-5 h-5" /> : <XCircleIcon className="w-5 h-5" />}
                                <span className="ml-2">{label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Section>
    )
})

export default SetAuthSection