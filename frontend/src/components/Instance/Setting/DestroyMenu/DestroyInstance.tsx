import React from "react";
import ButtonCommon from "../ButtonCommon";
import MenuContainer from "../Menucontainer";

interface DestroyInstanceProps {
    onDelete: () => void;
}

const DestroyInstance: React.FC<DestroyInstanceProps> = ({ onDelete }) => {
    return (
        <>
            <MenuContainer style="bg-[#192A51] mt-8 h-[300px] w-[780px]">
                <p className="ml-14 mt-4 text-gray-300 text-white text-2xl font-bold">Destroy Instance</p>
                <p className="ml-14 mt-4 text-gray-300">Permanently delete this instance, removing all associated data, configurations, and resources.  </p>
                <p className="ml-14 mt-4 text-gray-300"> This action is irreversible and ideal when the instance is no longer needed or to free up</p>
                <p className="ml-14 mt-4 text-gray-300"> resources. Ensure you have backed up any essential data, as this will fully dismantle </p>
                <p className="ml-14 mt-4 text-gray-300"> the instance and reclaim the underlying resources for future use.</p>
                <ButtonCommon onClick={onDelete} name={"Destroy this Instance"} style={"w-[30%] bg-purple-600 text-white mt-5 ml-14  py-2"} />
            </MenuContainer>
        </>
    );
};

export default DestroyInstance;