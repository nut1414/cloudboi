// src/components/Instance/Create/ChooseImageVersion.tsx
import React, { useState, useEffect } from "react";
import OptionButton from "./OptionButton";
import SelectDropdown from "./SelectDropdown";
import { OsType } from "../../../tmp/type";

interface ChooseImageVersionProps {
    osImages: OsType[];
    selectedOsType: OsType | undefined;
    onSelect: (osType: OsType) => void;
}

const ChooseImageVersion: React.FC<ChooseImageVersionProps> = ({ 
    osImages, 
    selectedOsType, 
    onSelect 
}) => {
    const [selectedImageName, setSelectedImageName] = useState<string>("");
    const [selectedVersion, setSelectedVersion] = useState<string>("");
    const [availableVersions, setAvailableVersions] = useState<string[]>([]);
    
    // Get unique image names for buttons
    const uniqueImageNames = [...new Set(osImages.map(img => img.os_image_name))];
    
    // Update available versions when image name changes
    useEffect(() => {
        if (selectedImageName) {
            const versions = osImages
                .filter(img => img.os_image_name === selectedImageName)
                .map(img => img.os_image_version);
            setAvailableVersions(versions);
            setSelectedVersion("");
        }
    }, [selectedImageName, osImages]);
    
    // Handle image name selection
    const handleImageSelect = (imageName: string) => {
        setSelectedImageName(imageName);
    };
    
    // Handle version selection and update parent
    const handleVersionSelect = (version: string) => {
        setSelectedVersion(version);
        
        // Find the complete OsType object and send it to parent
        const selectedOs = osImages.find(
            img => img.os_image_name === selectedImageName && img.os_image_version === version
        );
        
        if (selectedOs) {
            onSelect(selectedOs);
        }
    };

    return (
        <>
            <p className="text-xl pt-10 pb-10">Choose an image</p>
            <div className="flex gap-4">
                {uniqueImageNames.map((imageName, index) => (
                    <OptionButton 
                        key={index} 
                        label={imageName} 
                        isSelected={imageName === selectedImageName}
                        onClick={() => handleImageSelect(imageName)} 
                    />
                ))}
            </div>
            
            {selectedImageName && (
                <SelectDropdown
                    label="Version"
                    options={availableVersions}
                    selectedOption={selectedVersion}
                    onSelect={handleVersionSelect}
                />
            )}
            
            {selectedOsType && (
                <div className="mt-4 text-lg">
                    <p>Selected OS: <strong>{selectedOsType.os_image_name}</strong></p>
                    <p>Version: <strong>{selectedOsType.os_image_version}</strong></p>
                </div>
            )}
        </>
    );
};

export default ChooseImageVersion;