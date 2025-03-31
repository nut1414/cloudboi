// PowerMenu.tsx
import React from "react"
import { PowerIcon, ArrowPathIcon } from "@heroicons/react/24/outline"
import Section from "../../../components/Common/Section"
import Button from "../../../components/Common/Button"
import MenuContainer from "./MenuContainer"
import { useInstanceSetting } from "../../../hooks/Instance/useInstanceSetting"
import { InstanceStatus } from "../../../constant/InstanceConstant"

const PowerMenu: React.FC = () => {
    const {
        instance,
        isInstanceRunning,
        isInstanceStopped,
        startInstance,
        stopInstance,
        restartInstance
    } = useInstanceSetting()

    return (
        <MenuContainer>
            <Section
                title="Power Management"
                icon={<PowerIcon className="w-5 h-5" />}
                description="Control the power state of your instance. Changes will take effect immediately."
            >
                <div className="bg-[#23375F] p-4 rounded-lg border border-blue-800/20 mb-4">
                    <p className="text-gray-300">Current Status: <span className="font-medium text-white">{instance?.instance_status}</span></p>
                    <p className="text-gray-400 text-sm mt-2">
                        {isInstanceRunning
                            ? "Your instance is currently running and consuming resources. You can stop it to save costs when not in use."
                            : "Your instance is currently stopped. No compute charges are being incurred while stopped."}
                    </p>
                </div>

                <div className="flex space-x-4">
                    {isInstanceStopped ? (
                        <Button
                            label="Start Instance"
                            onClick={startInstance}
                            variant="primary"
                            icon={<PowerIcon className="w-5 h-5" />}
                        />
                    ) : (
                        <Button
                            label="Stop Instance"
                            onClick={stopInstance}
                            variant="primary"
                            icon={<PowerIcon className="w-5 h-5" />}
                        />
                    )}

                    <Button
                        label="Restart Instance"
                        onClick={restartInstance}
                        variant="outline"
                        icon={<ArrowPathIcon className="w-5 h-5" />}
                        disabled={!isInstanceRunning}
                    />
                </div>
            </Section>
        </MenuContainer>
    )
}

export default PowerMenu
