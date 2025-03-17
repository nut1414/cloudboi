import React from "react";
import ButtonCommon from "../ButtonCommon";
import MenuContainer from "../Menucontainer";

interface InstanceConsoleProps {
   
}

const InstanceConsole: React.FC<InstanceConsoleProps> = ({ }) => {
    return (
        <>
            <MenuContainer style="bg-red-300 mt-8 h-[230px] w-[780px]">         
                <p className="ml-14 mt-4 text-xl font-bold">Instance Console</p>
                <p className="ml-14 mt-4 ">Access the console for direct control over your cloud instance, just like having physical access to </p>
                <p className="ml-14">  the server. Use it to configure settings, troubleshoot issues, and perform administrative actions </p>
                <p className="ml-14">  without needing SSH access.Ideal for managing your instance at a detailed level.</p>

                <div className=" mt-2  justify-center grid grid-cols-2 ">
                    <div className="bg-blue-300 h-[50px] w-[100px] mt-4 ml-20  rounded-2xl">
                        <div className="ml-4">
                            <p className="text-xs mt-1">Log in as...</p>
                            <p className="mr-6">root</p>
                        </div>
                    </div>
                    <ButtonCommon name={"Launch Instance Console"} style={"w-[100%] text-white mt-4  py-2"}/>
                </div>
            </MenuContainer>
        </>
    );
};

export default InstanceConsole;