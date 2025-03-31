// NetworkingMenu.tsx
import React from "react"
import { WifiIcon } from "@heroicons/react/24/outline"
import Section from "../../../components/Common/Section"
import MenuContainer from "./MenuContainer"
import { useInstanceSetting } from "../../../hooks/Instance/useInstanceSetting"

const NetworkingMenu: React.FC = () => {
    const { instance } = useInstanceSetting()

    // Generate mock network details based on instance ID for demo
    const mockPrivateIP = `10.0.${instance?.instance_id.slice(-2) || '0'}.${instance?.instance_id.slice(-3, -1) || '1'}`
    const networkId = `network-${instance?.instance_id.slice(0, 8) || 'default'}`

    return (
        <MenuContainer>
            <Section
                title="Private Network"
                icon={<WifiIcon className="w-5 h-5" />}
                description="Configure and manage private network settings for secure communication."
            >
                <div className="bg-[#23375F] p-4 rounded-lg border border-blue-800/20 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-400 text-sm">Private IP Address</p>
                            <p className="text-white font-medium">{mockPrivateIP}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Network ID</p>
                            <p className="text-white font-medium">{networkId}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Subnet Mask</p>
                            <p className="text-white font-medium">255.255.255.0</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Gateway</p>
                            <p className="text-white font-medium">10.0.0.1</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-700/30">
                    <p className="text-yellow-300 text-sm">
                        Advanced networking features like public IP assignment and custom networking configurations
                        will be available in a future update.
                    </p>
                </div>
            </Section>
        </MenuContainer>
    )
}

export default NetworkingMenu
