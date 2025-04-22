import React, { useState, useCallback, useMemo } from "react"
import {
  CommandLineIcon, 
  ComputerDesktopIcon, 
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline"
import InstanceTerminal from "./InstanceTerminal"
import InstanceConsole from "./InstanceConsole"
import { useParams } from "react-router-dom"
import { useInstanceSetting } from "../../../hooks/Instance/useInstanceSetting"
import Section from "../../../components/Common/Section"
import Button from "../../../components/Common/Button/Button"
import InputField from "../../../components/Common/InputField"
import RequirementsChecklist from "../../../components/Common/RequirementsChecklist"
import { getPasswordRequirements, isPasswordValid } from '../../../utils/instanceUtils'
import TabNavigation, { TabItem } from "../../../components/Common/Tab/TabNavigation"

const AccessMenu: React.FC = () => {
  const instanceName = useParams<{ instanceName: string }>().instanceName || ''
  const { isInstanceRunning, resetPassword, instance } = useInstanceSetting()
  const [accessType, setAccessType] = useState<'terminal' | 'console'>('terminal')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  // Handle password reset
  const handleResetPassword = useCallback(() => {
    if (isPasswordValid(password) && password) {
      resetPassword(password)
      setPassword('')
    }
  }, [password, resetPassword])

  // Define tabs for TabNavigation
  const accessTabs: TabItem[] = useMemo(() => [
    {
      id: 'terminal',
      label: 'Terminal',
      icon: <CommandLineIcon className="w-4 h-4" />
    },
    {
      id: 'console',
      label: 'Console',
      icon: <ComputerDesktopIcon className="w-4 h-4" />
    }
  ], [])

  const resetRootPasswordSection = useMemo(() => {
    if (!isInstanceRunning) return null

    return (
      <Section
        className="mt-6"
        title="Access Security"
        icon={<KeyIcon className="w-5 h-5" />}
        description="Manage root password and access credentials for your instance."
      >
        <div className="bg-[#23375F] p-4 rounded-lg border border-blue-800/20 mb-4">
          <p className="text-gray-300">Root Password</p>
          <p className="text-gray-400 text-sm mt-2">
            Reset your root password for instance access. Choose a strong password that meets the security requirements.
          </p>
        </div>

        <div className="w-full mb-4">
          <InputField
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={setPassword}
            placeholder="Enter new root password..."
            endIcon={showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            onEndIconClick={togglePasswordVisibility}
            disabled={!isInstanceRunning}
            data-testid="reset-root-password"
          />
        </div>

        <RequirementsChecklist
          className="px-3 mb-2"
          requirements={getPasswordRequirements(password)}
          title="Password requirements"
          icon={<ShieldCheckIcon className="w-4 h-4" />}
          columns={2}
          iconSize="sm"
        />

        <Button
          className="justify-self-end"
          label="Reset Root Password"
          onClick={handleResetPassword}
          variant="outline"
          icon={<KeyIcon className="w-5 h-5" />}
          disabled={!isInstanceRunning || !isPasswordValid(password)}
          data-testid="reset-root-password"
        />
      </Section>
    )
  }, [isInstanceRunning, password, resetPassword, showPassword, togglePasswordVisibility, handleResetPassword])

  return (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-200 flex items-center">
          <CommandLineIcon className="w-5 h-5 mr-2 text-purple-500" />
          Instance Access
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Access your instance via terminal or console. Commands entered here execute directly on your instance with root privileges.
        </p>
      </div>
      
      {/* Access Type Selector */}
      <TabNavigation 
        tabs={accessTabs}
        activeTab={accessType}
        setActiveTab={(id) => setAccessType(id as 'terminal' | 'console')}
        data-testid="instance-access"
      />
      
      <div className="bg-[#12203c] rounded-lg overflow-hidden shadow-lg border border-blue-900/20">
        {accessType === 'terminal' ? (
          <InstanceTerminal
            instanceName={instanceName}
            isRunning={isInstanceRunning || false}
          />
        ) : (
          <InstanceConsole
            instanceName={instanceName}
            isRunning={isInstanceRunning || false}
          />
        )}
      </div>
      {resetRootPasswordSection}
    </>
  )
}

export default AccessMenu
