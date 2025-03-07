import React from "react";

interface ButtonCommonProps {
    name: string;
    style: string;
}

const ButtonCommon: React.FC<ButtonCommonProps> = ({ name, style}) => {
    return (
        <>
            <button
                type="submit"
                className={`bg-[#192A51] ${style} rounded-lg hover:border-white border-2   hover:text-blue-400 transition duration-300`}
            >
                {name}
            </button>
        </>
    );
};

export default ButtonCommon;