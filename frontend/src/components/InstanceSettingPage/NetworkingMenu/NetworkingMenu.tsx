import React from "react";

import PrivateNetwork from "./PrivateNetwork";
import PublicNetwork from "./PublicNetwork";


const NetworkingMenu: React.FC = () => {

    return (
        <>
            <div className="mt-8 bg-red-300 mb-10 shadow-md h-[550px] w-[780px] rounded-2xl flex flex-col  justify-start items-start ">
                        <PrivateNetwork />
                        <PublicNetwork />
            </div>
        </>
    );
};
export default NetworkingMenu;
