import React from "react";

interface OptionButtonProps {
    label: string;
    onClick: () => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({ label, onClick }) => {
    return (
        <p
            onClick={onClick}
            className="bg-red-300 px-6 py-6 text-xl rounded-2xl cursor-pointer"
        >
            {label}
        </p>
    );
};

export default OptionButton;
