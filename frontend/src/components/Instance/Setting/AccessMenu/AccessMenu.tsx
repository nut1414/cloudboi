import React from "react";

import InstanceConsole from "./InstanceConsole";
import ResetRootPassword from "./ResetRootPassword";


const AccessMenu: React.FC = () => {
    
    const onLaunchInstanceConsole= () => {
        // Handle instance actions
    }
    const onResetRootPassword=()=>{

    }

    return (
        <>
            <InstanceConsole onLaunchInstance={onLaunchInstanceConsole}/>
            <ResetRootPassword  onResetPassword={onResetRootPassword}/>
        </>
    );
};

export default AccessMenu;
