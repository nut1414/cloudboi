import React from "react";
import MenuContainer from "../Menucontainer";

interface PublickNetworkProps {

}

const PublicNetwork: React.FC<PublickNetworkProps> = ({ }) => {
    return (
        <>
            <div className=" shadow-md ml-10 mt-10 mb-6 px-[46%] py-[0.3%] bg-blue-300  rounded-full"></div>
            <p className="ml-14 mt-4 text-2xl font-bold">Private Network</p>
            <MenuContainer style="ml-14 mt-10 bg-[#F5E6E8] h-[140px] w-[680px]">
                <p className="flex justify-center items-center h-full w-full text-xl font-bold">Instance Private Network Details</p>
            </MenuContainer>
        </>
    );
};
export default PublicNetwork;