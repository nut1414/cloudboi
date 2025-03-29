import React from "react";
import ButtonCommon from "../ButtonCommon";
import MenuContainer from "../Menucontainer";

interface TurnOffProps {
    onTurnOff: () => void;
}

const TurnOff: React.FC<TurnOffProps> = ({ onTurnOff }) => {
    return (
        <>
            <MenuContainer style="bg-[#192A51]  mt-8 h-[260px] w-[780px]">
                    <p className="ml-14 mt-4 text-white text-2xl font-bold">Turn off Instance</p>
                    <p className="ml-14 mt-4 text-gray-300">Safely power down your instance when it is not in use, preserving data and configurations while </p>
                    <p className="ml-14 mt-4 text-gray-300"> minimizing resource usage and costs. You can turn it back on anytime to restore all settings and </p>
                    <p className="ml-14 mt-4 text-gray-300">continue from where you left off.</p>
                    <ButtonCommon onClick={onTurnOff} name={" Turn off"} style={"w-[20%] bg-purple-600 text-white mt-4 ml-14  py-2 "}/>
            </MenuContainer>       
        </>
    );
};

export default TurnOff;