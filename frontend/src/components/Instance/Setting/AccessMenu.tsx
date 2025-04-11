import React, { useState } from "react"
import { CommandLineIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline"
import InstanceTerminal from "./InstanceTerminal"
import InstanceConsole from "./InstanceConsole"
import { useParams } from "react-router-dom"
import { useInstanceSetting } from "../../../hooks/Instance/useInstanceSetting"

const AccessMenu: React.FC = () => {
  const instanceName = useParams<{ instanceName: string }>().instanceName || ''
  const { isInstanceRunning } = useInstanceSetting()
  const [accessType, setAccessType] = useState<'terminal' | 'console'>('terminal')

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
      <div className="mb-4 flex border-b border-blue-900/30">
        <button
          className={`py-2 px-4 font-medium flex items-center ${
            accessType === 'terminal' 
              ? 'text-purple-400 border-b-2 border-purple-500' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setAccessType('terminal')}
        >
          <CommandLineIcon className="w-4 h-4 mr-2" />
          Terminal
        </button>
        <button
          className={`py-2 px-4 font-medium flex items-center ${
            accessType === 'console' 
              ? 'text-purple-400 border-b-2 border-purple-500' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setAccessType('console')}
        >
          <ComputerDesktopIcon className="w-4 h-4 mr-2" />
          Console
        </button>
      </div>
      
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
    </>
  )
}

export default AccessMenu
