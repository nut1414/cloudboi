import React, { useState } from "react";
import OptionButton from "./OptionButton";
import SelectDropdown from "./SelectDropdown";

interface ChooseImageVersionProps {

}

const ChooseImageVersion: React.FC<ChooseImageVersionProps> = ({ }) => {
    const [selectedVersion, setSelectedVersion] = useState("");
    const imageOptions = ["OS 1", "OS 2", "OS 3", "OS 4"];
    const versionOptions = ["Version 1", "Version 2", "Version 3"];

    return (
        <>
            <p className="text-xl pt-10 pb-10">Choose an image</p>
            <div className="flex gap-4">
                {imageOptions.map((option, index) => (
                    <OptionButton key={index} label={option} onClick={() => {}} />
                ))}
            </div>
            <SelectDropdown
                label="Version"
                options={versionOptions}
                selectedOption={selectedVersion}
                onSelect={setSelectedVersion}
            />
            {selectedVersion && (
                <p className="mt-4 text-lg">Selected Version: <strong>{selectedVersion}</strong></p>
            )}
        </>
    );
};
export default ChooseImageVersion;