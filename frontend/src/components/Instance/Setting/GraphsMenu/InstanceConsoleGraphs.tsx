import React from "react";
import MenuContainer from "../Menucontainer";

interface InstanceConsoleGraphsProps {

}

const InstanceConsoleGraphs: React.FC<InstanceConsoleGraphsProps> = ({ }) => {
    return (
        <>
            <p className="shadow-lg  mt-8 bg-[#967AA1]  px-4 py-2 text-white rounded-lg">Time Granularity Dropdown</p>
            <MenuContainer style="bg-red-300 mt-8 h-[230px] w-[780px] ">
                <p className="flex justify-center items-center h-full w-full text-xl font-bold">Instance Console</p>
            </MenuContainer>
        </>
    );
};
export default InstanceConsoleGraphs;