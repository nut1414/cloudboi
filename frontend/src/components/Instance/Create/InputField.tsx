import React from "react";

interface InputFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, value, onChange }) => {
    return (
        <div>
            <p className="text-xl font-bold ml-10 mt-10">{label}</p>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="px-200 mt-4 ml-10 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default InputField;
