// src/components/Instance/Create/OptionButton.tsx
import React from "react";

interface OptionButtonProps {
    label: string;
    onClick: () => void;
    isSelected?: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({ 
    label, 
    onClick,
    isSelected = false 
}) => {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 rounded-lg border transition-colors ${
                isSelected 
                    ? 'bg-blue-600 text-white border-blue-700' 
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            }`}
        >
            {label}
        </button>
    );
};

export default OptionButton;