import React from "react";

interface PrivateNetworkProps {

}

const PrivateNetwork: React.FC<PrivateNetworkProps> = ({ }) => {
    return (
        <>
            <p className="ml-14 mt-4 text-2xl font-bold">Public Network</p>
            <div className="ml-14 mt-10 bg-[#F5E6E8] shadow-lg h-[140px] w-[680px] rounded-2xl  flex flex-col  justify-start items-start ">
                <p className="flex justify-center items-center h-full w-full text-xl font-bold">Instance Public Network Details</p>

            </div>
        </>
    );
};
export default PrivateNetwork;