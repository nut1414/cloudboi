import React, {useState } from "react";

import ContainerSlidebar from "./ContainerSlidebar";

interface SlidebarSettingProps {
    active:string;
    setActive: (value: string) => void;
}

const SlidebarSetting: React.FC<SlidebarSettingProps> = ({active,setActive}) => {

    const [showDiv, setShowDiv] = useState(true);
    

    return (
        <nav >
            <div onMouseEnter={() => setShowDiv(false)}
                onMouseLeave={() => setShowDiv(true)}
                className="mt-6 ml-56 h-[42px]  items-center inline-flex gap-14 ">

                <ContainerSlidebar active={active} setActive={ setActive}  menu={"AccessMenu"} showDiv={showDiv} name={"Access"}/>
                <ContainerSlidebar active={active} setActive={ setActive}  menu={"PowersMenu"} showDiv={showDiv} name={"Powers"}/>
                <ContainerSlidebar active={active} setActive={ setActive}  menu={"NetworkingMenu"} showDiv={showDiv} name={"Networking"}/>
                <ContainerSlidebar active={active} setActive={ setActive}  menu={"DestroyMenu"} showDiv={showDiv} name={"Destroy"}/>
            </div>
            <div className="absolute shadow-md top-36 ml-2 mt-2 px-[50%] py-1 bg-[#192A51] bg-opacity-50 z-[-1] rounded-full"></div>
        </nav>
    );
};

export default SlidebarSetting;

