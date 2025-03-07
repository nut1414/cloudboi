import React from "react";
import ButtonCommon from "../ButtonCommon";
import MenuContainer from "../Menucontainer";

interface DestroyInstanceProps {

}

const DestroyInstance: React.FC<DestroyInstanceProps> = ({ }) => {
    return (
        <>
            <MenuContainer style="bg-red-300 mt-8 h-[300px] w-[780px]">
                <p className="ml-14 mt-4 text-2xl font-bold">Destroy Instance</p>
                <p className="ml-14 mt-4 ">Permanently delete this instance, removing all associated data, configurations, and resources.  </p>
                <p className="ml-14 mt-4 "> This action is irreversible and ideal when the instance is no longer needed or to free up</p>
                <p className="ml-14 mt-4 "> resources. Ensure you have backed up any essential data, as this will fully dismantle </p>
                <p className="ml-14 mt-4 "> the instance and reclaim the underlying resources for future use.</p>
                <ButtonCommon name={"Destroy this Instance"} style={"w-[30%] text-white mt-5 ml-14  py-2"} />
            </MenuContainer>
        </>
    );
};

export default DestroyInstance;