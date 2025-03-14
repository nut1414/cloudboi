import React from "react";
import { twMerge } from 'tailwind-merge';

interface ContainerSidebarProps {
    children?: React.ReactNode;
    userName: string;
    currentPath: string;
    pathName: string;
    name: string;
    role: string;
    showDiv: boolean;
}

const ContainerSidebar: React.FC<ContainerSidebarProps> = ({ userName,currentPath,role ,showDiv, pathName, name }) => {

    return (
        <li className={`relative group p-4 flex justify-center items-center
                       ${currentPath === pathName.split('/')[0] && showDiv ? "bg-[#1E345F]" : "hover:bg-[#1E345F]"}`}>
            <div className={twMerge(`absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[70%] -z-10 bg-[#967AA1]  scale-110 rounded-md ${(currentPath === pathName.split('/')[0] && showDiv)
                ? "" : "opacity-0 group-hover:opacity-100 transition-all"}`)}></div>
            <a href={`/${role}/${userName}/${pathName}`} className="text-white"> {name} </a>
        </li>
    );
};
export default ContainerSidebar;
