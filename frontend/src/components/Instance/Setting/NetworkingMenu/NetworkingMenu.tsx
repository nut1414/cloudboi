import React from "react";

import PrivateNetwork from "./PrivateNetwork";
import MenuContainer from "../Menucontainer";


const NetworkingMenu: React.FC = () => {
            
    return (
        <>
            <MenuContainer style="bg-[#192A51] mt-8 h-[280px] w-[780px] mb-20 ">
                <PrivateNetwork />
            </MenuContainer>
        </>
    );
};
export default NetworkingMenu;
