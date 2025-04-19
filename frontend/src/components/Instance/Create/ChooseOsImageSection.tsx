import React, { useCallback } from "react"
import OptionButton from "../../Common/Button/OptionButton"
import { OsType } from "../../../client"
import { 
  ComputerDesktopIcon, 
  CheckCircleIcon,
  CodeBracketIcon, // For fallback
  ViewfinderCircleIcon
} from "@heroicons/react/24/outline"
import Section from "../../Common/Section"
import DropdownButton, { DropdownItemProps } from "../../Common/Button/DropdownButton"

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

    // Create dropdown items from availableVersions
    const versionItems: DropdownItemProps[] = availableVersions.map(version => ({
        content: version,
        onClick: () => onVersionSelect(version)
    }))

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
                        data-testid={`os-image-${imageName.toLowerCase()}`}
                    />
                ))}
            </div>
            
            {selectedImageName && (
                <div className="mt-4 mb-6">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center mb-2">
                            <ViewfinderCircleIcon className="w-5 h-5 text-purple-400 mr-2" />
                            <span className="text-gray-200 font-medium">Version</span>
                        </div>
                        
                        <DropdownButton
                            content={selectedVersion || "Select Version"}
                            items={versionItems}
                            variant="none"
                            className="bg-[#2A3F6A] border border-blue-800/40 text-gray-200 hover:bg-[#304776] focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md py-2.5"
                            position="bottom-left"
                            buttonType="default"
                            hasBorder={false}
                            data-testid={`os-version-dropdown`}
                        />
                        
                        {selectedOsType && (
                            <div className="flex items-center mt-2 px-3 py-2 bg-purple-900/20 rounded-md border-l-2 border-purple-500">
                                <CheckCircleIcon className="w-5 h-5 text-purple-400 mr-2" />
                                <span className="text-white">
                                    <span className="text-gray-300">Selected: </span>
                                    <span className="font-medium">
                                        {selectedOsType.os_image_name} {selectedOsType.os_image_version}
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Section>
    )
})

export default ChooseOsImageSection