import React from "react";

interface CpuUsageGraphsProps {
   
}

const CpuUsageGraphs: React.FC<CpuUsageGraphsProps> = ({ }) => {
    return (
        <>
             <div className="mt-8 bg-red-300  shadow-md h-[230px] w-[780px] rounded-2xl flex flex-col  justify-start items-start mb-20">
                        <p className="flex justify-center items-center h-full w-full text-xl font-bold">CPU Usage Graph</p>
                
                    </div>       
        </>
    );
};
export default CpuUsageGraphs;