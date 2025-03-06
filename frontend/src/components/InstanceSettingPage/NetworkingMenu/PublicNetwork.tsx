import React from "react";

interface PublickNetworkProps {

}

const PublicNetwork: React.FC<PublickNetworkProps> = ({ }) => {
    return (
        <>
            <div className=" shadow-md ml-10 mt-10 mb-6 px-[46%] py-[0.3%] bg-blue-300  rounded-full"></div>
            <p className="ml-14 mt-4 text-2xl font-bold">Private Network</p>
            <div className="ml-14 mt-10 bg-[#F5E6E8] shadow-lg h-[140px] w-[680px] rounded-2xl  flex flex-col  justify-start items-start ">
                <p className="flex justify-center items-center h-full w-full text-xl font-bold">Instance Private Network Details</p>

            </div>
        </>
    );
};
export default PublicNetwork;