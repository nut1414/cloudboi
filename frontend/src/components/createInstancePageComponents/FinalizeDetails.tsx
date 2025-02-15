import React from "react";

interface FinalizeDetailsProps {

}

const FinalizeDetails: React.FC<FinalizeDetailsProps> = ({ }) => {
  
    return (
        <>
            <p className="text-2xl pt-5 pb-5">Finalize Details</p>
                    <div className="bg-red-300 h-[200px] w-[650px] rounded-2xl flex flex-col  justify-start items-start">
                        <p className="text-xl font-bold ml-10 mt-10">Hostname</p>
                        <p className="ml-10 mt-2">Assign a unique hostname to help identify this instance</p>
                        <input
                            type="text"
                            placeholder="Enter text..."
                            className="w-[80%] mt-4 ml-10 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
        </>
    );
};
export default FinalizeDetails;