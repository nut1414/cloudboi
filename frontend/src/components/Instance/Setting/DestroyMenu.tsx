import React, { useState } from "react"
import { ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/24/outline"
import Section from "../../../components/Common/Section"
import Button from "../../../components/Common/Button"
import MenuContainer from "./MenuContainer"


const DestroyMenu: React.FC = () => {
    const [confirmText, setConfirmText] = useState("")
    const instanceName = "cloud-instance-name" // This should come from your state/props

    const handleDeleteInstance = () => {
        // Handle delete instance
    }

    const isDeleteConfirmed = confirmText === instanceName

    return (
        <MenuContainer>
            <Section
                title="Danger Zone"
                icon={<ExclamationTriangleIcon className="w-5 h-5" />}
                description="Permanently delete this instance, removing all associated data, configurations, and resources."
            >
                <div className="bg-red-900/20 p-4 rounded-lg border border-red-800/30 mb-4">
                    <div className="flex items-start">
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-red-400 font-medium">Warning: This action cannot be undone</p>
                            <p className="text-gray-300 mt-2">
                                Destroying this instance will permanently delete all associated data, including:
                            </p>
                            <ul className="list-disc list-inside mt-2 text-gray-400 space-y-1">
                                <li>All stored data on attached volumes</li>
                                <li>All instance configurations and settings</li>
                                <li>All network configurations for this instance</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 mb-2 text-sm">
                        To confirm, type the instance name: <span className="font-bold">{instanceName}</span>
                    </label>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="bg-[#23375F] border border-blue-800/30 text-white px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder={`Type ${instanceName} to confirm`}
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        label="Destroy this Instance"
                        onClick={handleDeleteInstance}
                        icon={<TrashIcon className="w-5 h-5" />}
                        variant="purple" // Using purple for destructive action as per your color scheme
                        disabled={!isDeleteConfirmed}
                    />
                </div>
            </Section>
        </MenuContainer>
    )
}

export default DestroyMenu
