import React from "react";

import DestroyInstance from "./DestroyInstance";
const DestroyMenu: React.FC = () => {

    const handleDeleteInstance = () => {
        
      };

    return (
        <>
            <DestroyInstance onDelete={handleDeleteInstance}/>
        </>
    );
};
export default DestroyMenu;
