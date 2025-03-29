import React from "react";

interface TopUpAmountButtonProps {
    amount: number;
    onClick: () => void;
}
const TopUpAmountButton: React.FC<TopUpAmountButtonProps> = ({ amount, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-[#23375F] w-[120px] h-[72%] mt-4 text-white rounded-lg hover:border-white border-2 hover:text-blue-400 transition duration-300"
        >
            {amount} CBC
        </button>
    );
};

export default TopUpAmountButton;