import React from "react";

interface ButtonCommonProps {
    name: string;
    style: string;
    onClick?: () => void
}

const ButtonCommon: React.FC<ButtonCommonProps> = ({ name, style,onClick}) => {
    return (
        <>
            <button
                type="submit"
                onClick={onClick}
                className={`${style} rounded-lg hover:border-white  hover:border-2 transition duration-300`}
            >
                {name}
            </button>
        </>
    );
};

export default ButtonCommon;