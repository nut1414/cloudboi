import React from "react";
import MenuContainer from "../Menucontainer";

interface PrivateNetworkProps {

}

const PrivateNetwork: React.FC<PrivateNetworkProps> = ({ }) => {
    return (
        <>
            <p className="ml-14 mt-4 text-white text-2xl font-bold">Private Network</p>
            <MenuContainer style="ml-14 mt-10 bg-[#23375F] h-[140px] w-[680px]">
                <p className="flex justify-center items-center h-full w-full text-gray-300 text-xl font-bold">Instance Private Network Details</p>
            </MenuContainer>
        </>
    );
};
export default PrivateNetwork;