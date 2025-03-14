// LabeledInput.tsx
import React from "react";

interface LabeledInputProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    unit?: string;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    unit,
}) => {
    return (
        <div className="flex items-center space-x-4 relative">
            <label className="text-white text-lg w-40 text-right">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-2 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {unit && <span className="absolute right-14 text-gray-600">{unit}</span>}
        </div>
    );
};

export default LabeledInput;
