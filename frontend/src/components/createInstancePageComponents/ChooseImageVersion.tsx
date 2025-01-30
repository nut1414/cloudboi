import React, { useState } from "react";

interface ChooseImageVersionProps {

}

const ChooseImageVersion: React.FC<ChooseImageVersionProps> = ({ }) => {
    const [selectedVersion, setSelectedVersion] = useState("");
    return (
        <>
            <p className=" text-xl pt-10 pb-10">Choose an image</p>

            <div className="flex gap-4">
                <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">OS 1</p>
                <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">OS 2</p>
                <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">OS 3</p>
                <p className="bg-red-300 px-6 py-6 text-xl rounded-2xl">OS 4</p>
            </div>
            <p className=" text-2xl pt-10 pb-4">Version</p>

            <select
                id="os"
                className="border border-gray-300 rounded-md px-2 py-1 text-black"
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
            >
                <option value="">-- Choose an OS Version --</option>
                <option value="Version 1">XX.XXX.XXX</option>
                <option value="Version 2">XX.XXX.XXX</option>
                <option value="Version 3">XX.XXX.XXX</option>
            </select>
            
            {selectedVersion && (
                <p className="mt-4 text-lg">Selected Version: <strong>{selectedVersion}</strong></p>
            )}
        </>
    );
};
export default ChooseImageVersion;