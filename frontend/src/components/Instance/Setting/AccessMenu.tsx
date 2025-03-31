import React from "react"
import { CommandLineIcon } from "@heroicons/react/24/outline"
import InstanceTerminal from "../InstanceTerminal"
import { useParams } from "react-router-dom"
import MenuContainer from "./MenuContainer"

const AccessMenu: React.FC = () => {
  const instanceName = useParams<{ instanceName: string }>().instanceName || ''

  return (
    <MenuContainer>
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-200 flex items-center">
          <CommandLineIcon className="w-5 h-5 mr-2 text-purple-500" />
          Instance Terminal
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Direct terminal access to your instance. Commands entered here execute directly on your instance with root privileges.
        </p>
      </div>
      
      <div className="bg-[#12203c] rounded-lg overflow-hidden shadow-lg border border-blue-900/20">
        <InstanceTerminal
          instanceName={instanceName}
        />
      </div>
    </MenuContainer>
  )
}

export default AccessMenu
