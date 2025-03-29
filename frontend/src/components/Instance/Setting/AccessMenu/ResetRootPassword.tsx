import React from "react";
import ButtonCommon from "../ButtonCommon";
import MenuContainer from "../Menucontainer";

interface ComponentWithChildren {
    children?: React.ReactNode
    onResetPassword: () => void;
}

const ResetRootPassword: React.FC<ComponentWithChildren> = ({ onResetPassword}) => {
    return (
        <>
            <MenuContainer style="bg-[#192A51]  mt-8 h-[240px] w-[780px] mb-40 ">
                <p className="ml-14 mt-4 text-white text-xl font-bold">Reset root password </p>
                <p className="ml-14 mt-4 text-gray-300">Reset the root password to update or regain access permissions for your instance. Essential for   </p>
                <p className="ml-14 text-gray-300">  securing administrative control, this option is helpful if you’ve lost access or want to improve security </p>
                <p className="ml-14 text-gray-300"> by setting a new password.</p>
                <div className=" mt-2 ml-14 ">
                    <ButtonCommon onClick={onResetPassword} name={"Reset root password"} style={"w-[100%]  bg-purple-600 text-white mt-4  px-2 py-2 "} />
                </div>
            </MenuContainer>
        </>
    );
};

export default ResetRootPassword;