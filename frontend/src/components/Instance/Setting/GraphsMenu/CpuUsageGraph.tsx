import React from "react";
import MenuContainer from "../Menucontainer";

interface CpuUsageGraphsProps {
   
}
const CpuUsageGraphs: React.FC<CpuUsageGraphsProps> = ({ }) => {
    return (
        <>
            <MenuContainer style="bg-red-300 mt-8 h-[230px] w-[780px] mb-20 ">
                <p className="flex justify-center items-center h-full w-full text-xl font-bold">CPU Usage Graph</p>             
            </MenuContainer>  
        </>
    );
};
export default CpuUsageGraphs;