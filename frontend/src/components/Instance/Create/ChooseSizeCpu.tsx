import React from "react";
import OptionButton from "./OptionButton";

interface ChooseSizeCpuProps {

}

const ChooseSizeCpu: React.FC<ChooseSizeCpuProps> = ({ }) => {
  
    const cpuOptions = ["Package 1", "Package 2", "Package 3", "Package 4"];

    return (
        <>
            <p className="text-2xl pt-10">Choose Size</p>
            <p className="pt-2 pb-4">CPU options</p>
            <div className="flex gap-4">
                {cpuOptions.map((option, index) => (
                    <OptionButton key={index} label={option} onClick={() => {}} />
                ))}
            </div>
        </>
    );
    
};
export default ChooseSizeCpu;