import React, {useState } from "react";
import { useLocation } from "react-router-dom";

import ContainerSlidebar from "./ContainerSlidebar";

const SlidebarSettingPage: React.FC = () => {

    const location = useLocation();
    const [showDiv, setShowDiv] = useState(true);
    

    return (
        <nav >
            <div onMouseEnter={() => setShowDiv(false)}
                onMouseLeave={() => setShowDiv(true)}
                className="mt-6 ml-48 h-[42px]  items-center inline-flex gap-14 ">

                <ContainerSlidebar currentPath={(location.pathname.split("/").filter(Boolean)[1] || "")} pathName={"access"} showDiv={showDiv} name={"Access"}/>
                <ContainerSlidebar currentPath={(location.pathname.split("/").filter(Boolean)[1] || "")} pathName={"graphs"} showDiv={showDiv} name={"Graphs"}/>
                <ContainerSlidebar currentPath={(location.pathname.split("/").filter(Boolean)[1] || "")} pathName={"powers"} showDiv={showDiv} name={"Powers"}/>
                <ContainerSlidebar currentPath={(location.pathname.split("/").filter(Boolean)[1] || "")} pathName={"networking"} showDiv={showDiv} name={"Networking"}/>
                <ContainerSlidebar currentPath={(location.pathname.split("/").filter(Boolean)[1] || "")} pathName={"destroy"} showDiv={showDiv} name={"Destroy"}/>
            </div>
            <div className="absolute shadow-md top-36 ml-2 mt-2 px-[50%] py-1 bg-red-300 bg-opacity-50 z-[-1] rounded-full"></div>
        </nav>
    );
};

export default SlidebarSettingPage;
