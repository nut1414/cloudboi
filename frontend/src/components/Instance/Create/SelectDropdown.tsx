import React from "react";

interface SelectDropdownProps {
    label: string;
    options: string[];
    selectedOption: string;
    onSelect: (value: string) => void;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({ label, options, selectedOption, onSelect }) => {
    return (
        <div>
            <p className=" text-2xl pt-10 pb-4">{label}</p>
            <select
                className="border border-gray-300 rounded-md px-2 py-1 text-black"
                value={selectedOption}
                onChange={(e) => onSelect(e.target.value)}
            >
                <option value="">-- Choose --</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default SelectDropdown;
