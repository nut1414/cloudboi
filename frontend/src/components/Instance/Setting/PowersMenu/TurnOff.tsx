import React from "react";
import ButtonCommon from "../ButtonCommon";
import MenuContainer from "../Menucontainer";

interface TurnOffProps {
   
}

const TurnOff: React.FC<TurnOffProps> = ({ }) => {
    return (
        <>
            <MenuContainer style="bg-red-300 mt-8 h-[260px] w-[780px]">
                    <p className="ml-14 mt-4 text-2xl font-bold">Turn off Instance</p>
                    <p className="ml-14 mt-4 ">Safely power down your instance when it is not in use, preserving data and configurations while </p>
                    <p className="ml-14 mt-4 "> minimizing resource usage and costs. You can turn it back on anytime to restore all settings and </p>
                    <p className="ml-14 mt-4 ">continue from where you left off.</p>
                    <ButtonCommon name={" Turn off"} style={"w-[20%] text-white mt-4 ml-14  py-2 "}/>
            </MenuContainer>       
        </>
    );
};

export default TurnOff;