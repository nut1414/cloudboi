import React from "react";
import MenuContainer from "../Menucontainer";

interface PrivateNetworkProps {

}

const PrivateNetwork: React.FC<PrivateNetworkProps> = ({ }) => {
    return (
        <>
            <p className="ml-14 mt-4 text-2xl font-bold">Public Network</p>
            <MenuContainer style="ml-14 mt-10 bg-[#F5E6E8] h-[140px] w-[680px]">
                <p className="flex justify-center items-center h-full w-full text-xl font-bold">Instance Public Network Details</p>
            </MenuContainer>
        </>
    );
};
export default PrivateNetwork;