// NetworkingMenu.tsx
import React from "react"
import { WifiIcon } from "@heroicons/react/24/outline"
import Section from "../../../components/Common/Section"

interface NetworkingMenuProps {
    instanceState: any
    isLoading: boolean
}

const NetworkingMenu: React.FC<NetworkingMenuProps> = ({ instanceState, isLoading }) => {
    const networkInfo = instanceState?.network?.main || { ipv4: '-', ipv6: '-' }

    return (
        <>
            <Section
                title="Private Network"
                icon={<WifiIcon className="w-5 h-5" />}
                description="Manage private network settings for secure communication."
            >
                <div className="bg-[#23375F] p-4 rounded-lg border border-blue-800/20 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-400 text-sm">IPv4 Address</p>
                            <p className="text-white font-medium">{networkInfo.ipv4}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">IPv6 Address</p>
                            <p className="text-white font-medium">{networkInfo.ipv6}</p>
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
        </>
    )
}

export default NetworkingMenu
