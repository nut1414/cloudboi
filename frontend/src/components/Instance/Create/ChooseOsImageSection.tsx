import React, { useCallback } from "react"
import OptionButton from "../../Common/OptionButton"
import SelectDropdown from "./SelectDropdown"
import { OsType } from "../../../client"
import { 
  ComputerDesktopIcon, 
  CheckCircleIcon,
  CodeBracketIcon // For fallback
} from "@heroicons/react/24/outline"
import Section from "../../Common/Section"

// Image from https://www.dropbox.com/s/uhl8sz1gwse2zd6/distro_icons.zip?dl=0
import ubuntuImg from "../../../assets/icons/128_ubuntu.png"
import debianImg from "../../../assets/icons/128_debian.png"
import centosImg from "../../../assets/icons/128_centos_blue.png"
import fedoraImg from "../../../assets/icons/128_fedora_newlogo.png"

interface ChooseOsImageSectionProps {
    osImages: OsType[]
    selectedOsType: OsType | undefined
    selectedImageName: string
    selectedVersion: string
    uniqueImageNames: string[]
    availableVersions: string[]
    onImageNameSelect: (imageName: string) => void
    onVersionSelect: (version: string) => void
}

const ChooseOsImageSection: React.FC<ChooseOsImageSectionProps> = React.memo(({ 
    osImages,
    selectedOsType,
    selectedImageName,
    selectedVersion,
    uniqueImageNames,
    availableVersions,
    onImageNameSelect,
    onVersionSelect
}) => {
    // OS icon mapping function remains the same
    const getOsIcon = useCallback((osName: string) => {
        const name = osName.toLowerCase()
        const imgClasses = "w-5 h-5 object-contain rounded-sm filter brightness-95"
        
        // Map OS names to their corresponding image sources
        const osImageMap: Record<string, string> = {
            ubuntu: ubuntuImg,
            debian: debianImg,
            centos: centosImg,
            fedora: fedoraImg
        }
        
        // Find the matching image source
        const imgSrc = Object.keys(osImageMap).find(key => name.includes(key))
            ? osImageMap[Object.keys(osImageMap).find(key => name.includes(key)) as string]
            : null
            
        // Return image if found, otherwise return default icon
        return imgSrc ? (
            <div className="flex items-center justify-center">
                <img src={imgSrc} alt={osName} className={imgClasses} />
            </div>
        ) : (
            <CodeBracketIcon className="w-5 h-5 text-gray-300" />
        )
    }, [])

    return (
        <Section 
          title="Choose an operating system"
          icon={<ComputerDesktopIcon className="w-5 h-5" />}
        >
            <div className="flex flex-wrap gap-3 mb-6">
                {uniqueImageNames.map((imageName, index) => (
                    <OptionButton 
                        key={index} 
                        label={imageName}
                        icon={getOsIcon(imageName)}
                        isSelected={imageName === selectedImageName}
                        onClick={() => onImageNameSelect(imageName)}
                        className="font-medium"
                    />
                ))}
            </div>
            
            {selectedImageName && (
                <div className="mt-4 mb-4">
                    <SelectDropdown
                        label="Version"
                        options={availableVersions}
                        selectedOption={selectedVersion}
                        onSelect={onVersionSelect}
                    />
                </div>
            )}
            
            {selectedOsType && (
                <div className="mt-4 bg-blue-900/20 p-4 rounded-lg border border-blue-800/30 text-gray-300">
                    <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-purple-400" />
                        <p className="font-medium">
                            Selected: <span className="text-white">{selectedOsType.os_image_name} {selectedOsType.os_image_version}</span>
                        </p>
                    </div>
                </div>
            )}
        </Section>
    )
})

export default ChooseOsImageSection