import React from "react";
import ButtonCommon from "../ButtonCommon";

interface ComponentWithChildren {
    children?: React.ReactNode
}


const ResetRootPassword: React.FC<ComponentWithChildren> = ({ }) => {
    return (
        <>
            <div className="mt-8 bg-red-300 shadow-md h-[220px] w-[780px] rounded-2xl flex flex-col  justify-start items-start mb-40">
                <p className="ml-14 mt-4 text-xl font-bold">Reset root password </p>
                <p className="ml-14 mt-4 ">Reset the root password to update or regain access permissions for your instance. Essential for   </p>
                <p className="ml-14">  securing administrative control, this option is helpful if you’ve lost access or want to improve security </p>
                <p className="ml-14"> by setting a new password.</p>

                <div className=" mt-2 ml-14 ">
                    <ButtonCommon name={"Launch Instance Console"} style={"w-[100%] text-white mt-4  py-2 "} />
                </div>
            </div>
        </>
    );
};

export default ResetRootPassword;