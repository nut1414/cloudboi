import React, {useState } from "react";

import ContainerSlidebar from "./ContainerSlidebar";

interface SlidebarSettingPageProps {
    active:number;
    setActive: (value: number) => void;
}

const SlidebarSettingPage: React.FC<SlidebarSettingPageProps> = ({active,setActive}) => {

    const [showDiv, setShowDiv] = useState(true);
    

    return (
        <nav >
            <div onMouseEnter={() => setShowDiv(false)}
                onMouseLeave={() => setShowDiv(true)}
                className="mt-6 ml-48 h-[42px]  items-center inline-flex gap-14 ">

                <ContainerSlidebar active={active} setActive={ setActive}  menu={0} showDiv={showDiv} name={"Access"}/>
                <ContainerSlidebar active={active} setActive={ setActive}  menu={1} showDiv={showDiv} name={"Graphs"}/>
                <ContainerSlidebar active={active} setActive={ setActive}  menu={2} showDiv={showDiv} name={"Powers"}/>
                <ContainerSlidebar active={active} setActive={ setActive}  menu={3} showDiv={showDiv} name={"Networking"}/>
                <ContainerSlidebar active={active} setActive={ setActive}  menu={4} showDiv={showDiv} name={"Destroy"}/>
            </div>
            <div className="absolute shadow-md top-36 ml-2 mt-2 px-[50%] py-1 bg-red-300 bg-opacity-50 z-[-1] rounded-full"></div>
        </nav>
    );
};

export default SlidebarSettingPage;

{/* <ContainerSlidebar setActive={ setActive} currentPath={(location.pathname.split("/").filter(Boolean)[3] || "")} pathName={"access"} showDiv={showDiv} name={"Access"}/>
<ContainerSlidebar setActive={ setActive} currentPath={(location.pathname.split("/").filter(Boolean)[3] || "")} pathName={"graphs"} showDiv={showDiv} name={"Graphs"}/>
<ContainerSlidebar setActive={ setActive} currentPath={(location.pathname.split("/").filter(Boolean)[3] || "")} pathName={"powers"} showDiv={showDiv} name={"Powers"}/>
<ContainerSlidebar setActive={ setActive} currentPath={(location.pathname.split("/").filter(Boolean)[3] || "")} pathName={"networking"} showDiv={showDiv} name={"Networking"}/>
<ContainerSlidebar setActive={ setActive} currentPath={(location.pathname.split("/").filter(Boolean)[3] || "")} pathName={"destroy"} showDiv={showDiv} name={"Destroy"}/> */}