import React from "react";

import InstanceConsole from "./InstanceConsole";
import ResetRootPassword from "./ResetRootPassword";


const AccessMenu: React.FC = () => {

    return (
        <>
            <InstanceConsole />
            <ResetRootPassword />
        </>
    );
};

export default AccessMenu;
