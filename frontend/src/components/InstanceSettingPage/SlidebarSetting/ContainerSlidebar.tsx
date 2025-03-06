import React from "react";
import { twMerge } from 'tailwind-merge';

interface ContainerSlidebarProps {
    menu: number;
    name: string;
    showDiv: boolean;
    active:number;
    setActive: (value: number) => void;
}

const ContainerSlidebar: React.FC<ContainerSlidebarProps> = ({ showDiv, menu, name, active, setActive }) => {
    return (
        <div>
            <div className="relative group">
                <p onClick={() => setActive(menu)} className={twMerge(`inline-block transform text-blue-500 font-semibold cursor-pointer`, ((active) === (menu) && showDiv) ? "-translate-y-2 " : "", `transition-transform duration-300 hover:-translate-y-2`)}> {name}</p>
                {<div className={twMerge(`absolute bg-[#192A51] h-[8px] bottom-[-6px]  ${( menu === 3)? "left-[-14px] px-14" : "left-[-10px] px-10"} rounded-full`,
                    (active === (menu) && showDiv) ? "" : "opacity-0 group-hover:opacity-100 transition-opacity duration-300")}></div>}
            </div>
        </div>
    );
};

export default ContainerSlidebar;
