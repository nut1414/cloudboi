import React from "react";

import PrivateNetwork from "./PrivateNetwork";
import PublicNetwork from "./PublicNetwork";
import MenuContainer from "../Menucontainer";


const NetworkingMenu: React.FC = () => {

    return (
        <>
            <MenuContainer style="bg-red-300 mt-8 h-[580px] w-[780px] mb-20 ">
                <PrivateNetwork />
                <PublicNetwork />
            </MenuContainer>
        </>
    );
};
export default NetworkingMenu;
