import React from "react";
import { twMerge } from 'tailwind-merge';

interface ContainerSlidebarProps {
    children?: React.ReactNode;
    currentPath: string;
    pathName: string;
    name: string;
    showDiv: boolean;
}

const ContainerSlidebar: React.FC<ContainerSlidebarProps> = ({ currentPath, showDiv, pathName, name }) => {
    return (
        <div>
            <div className="relative group">
                <a href={pathName} className={twMerge(`inline-block transform `, ((currentPath) === (pathName) && showDiv) ? "-translate-y-2 " : "", `transition-transform duration-300 hover:-translate-y-2`)}> {name}</a>
                {<div className={twMerge(`absolute bg-[#192A51] h-[8px] bottom-[-6px]  ${((currentPath === 'networking' && showDiv) || (pathName === 'networking' && showDiv === false))? "left-[-14px] px-14" : "left-[-10px] px-10"} rounded-full`,
                    (currentPath === (pathName) && showDiv) ? "" : "opacity-0 group-hover:opacity-100 transition-opacity duration-300")}></div>}
            </div>
        </div>
    );
};

export default ContainerSlidebar;
