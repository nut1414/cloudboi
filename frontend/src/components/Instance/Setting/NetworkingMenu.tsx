import React from "react";
import { WifiIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import Section from "../../../components/Common/Section";
import Button from "../../../components/Common/Button";
import MenuContainer from "./MenuContainer";

const NetworkingMenu: React.FC = () => {
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
                            <p className="text-white font-medium">10.0.0.15</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Network ID</p>
                            <p className="text-white font-medium">network-b8u23fd</p>
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
            </Section>
        </MenuContainer>
    );
};

export default NetworkingMenu;
