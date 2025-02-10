import React from "react";
import ButtonCommon from "../ButtonCommon";

interface DestroyInstanceProps {
   
}

const DestroyInstance: React.FC<DestroyInstanceProps> = ({ }) => {
    return (
        <>
            <div className="mt-8 bg-red-300  shadow-md h-[300px] w-[780px] rounded-2xl flex flex-col  justify-start items-start ">
                    <p className="ml-14 mt-4 text-2xl font-bold">Destroy Instance</p>
                    <p className="ml-14 mt-4 ">Permanently delete this instance, removing all associated data, configurations, and resources.  </p>
                    <p className="ml-14 mt-4 "> This action is irreversible and ideal when the instance is no longer needed or to free up</p>
                    <p className="ml-14 mt-4 "> resources. Ensure you have backed up any essential data, as this will fully dismantle </p>
                    <p className="ml-14 mt-4 "> the instance and reclaim the underlying resources for future use.</p>
                    <ButtonCommon name={"Destroy this Instance"} style={"w-[30%] text-white mt-5 ml-14  py-2"}/>
            </div>           
        </>
    );
};

export default DestroyInstance;