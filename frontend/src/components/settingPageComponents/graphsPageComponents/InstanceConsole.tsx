import React from "react";

interface InstanceConsoleGraphsProps {
   
}

const InstanceConsoleGraphs: React.FC<InstanceConsoleGraphsProps> = ({ }) => {
    return (
        <>
             <p className="shadow-lg  mt-8 bg-[#967AA1]  px-4 py-2 text-white rounded-lg">Time Granularity Dropdown</p>
                
                <div className="mt-8 bg-red-300  shadow-md h-[230px] w-[780px] rounded-2xl flex flex-col  justify-start items-start ">
                    <p className="flex justify-center items-center h-full w-full text-xl font-bold">Instance Console</p>
            
                </div>          
        </>
    );
};
export default InstanceConsoleGraphs;