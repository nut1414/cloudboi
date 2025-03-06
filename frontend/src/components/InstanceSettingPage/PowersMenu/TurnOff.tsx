import React from "react";
import ButtonCommon from "../ButtonCommon";

interface TurnOffProps {
   
}

const TurnOff: React.FC<TurnOffProps> = ({ }) => {
    return (
        <>
           <div className="mt-8 bg-red-300  shadow-md h-[260px] w-[780px] rounded-2xl flex flex-col  justify-start items-start ">
                    <p className="ml-14 mt-4 text-2xl font-bold">Turn off Instance</p>
                    <p className="ml-14 mt-4 ">Safely power down your instance when it’s not in use, preserving data and configurations while </p>
                    <p className="ml-14 mt-4 "> minimizing resource usage and costs. You can turn it back on anytime to restore all settings and </p>
                    <p className="ml-14 mt-4 ">continue from where you left off.</p>
                    <ButtonCommon name={" Turn off"} style={"w-[20%] text-white mt-4 ml-14  py-2 "}/>
            </div>           
        </>
    );
};

export default TurnOff;