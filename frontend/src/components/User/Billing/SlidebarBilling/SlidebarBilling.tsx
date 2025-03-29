import React, {useState } from "react";

import ContainerSlidebar from "./ContainerSlidebar";

interface SlidebarBillingProps {
    active:string;
    setActive: (value: string) => void;
}

const SlidebarBilling: React.FC<SlidebarBillingProps> = ({active,setActive}) => {

    const [showDiv, setShowDiv] = useState(true);
    
    return (
        <nav >
            <div onMouseEnter={() => setShowDiv(false)}
                onMouseLeave={() => setShowDiv(true)}
                className="mt-6 ml-6 h-[42px]  items-center inline-flex gap-20 ">
                <ContainerSlidebar active={active} setActive={ setActive}  menu={"OverviewMenu"} showDiv={showDiv} name={"Overview"}/>
                <ContainerSlidebar active={active} setActive={ setActive}  menu={"HistoryMenu"} showDiv={showDiv} name={"History"}/>
                <ContainerSlidebar active={active} setActive={ setActive}  menu={"TopUpMenu"} showDiv={showDiv} name={"Top Up"}/>
            </div>
            <div className="absolute shadow-md top-20 ml-6 mt-4 w-[530px] py-1 bg-[#192A51] bg-opacity-50 z-[-1] rounded-full"></div>
        </nav>
    );
};

export default SlidebarBilling;
