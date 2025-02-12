import React from "react";
import VerticalSidebar from "../sidebar/VerticalSidebar";
import SidebarWrapper from "../sidebar/SidebarWrapper";
import SlidebarBillingPage from "./slidebarBilling/SlidebarBillingPage";


interface ComponentWithChildren {
    children?: React.ReactNode
    active:number;
    setActive: (value: number) => void;
}


const BillingWrapper: React.FC<ComponentWithChildren> = ({ children, active, setActive }) => {
    return (
        <>
            <SidebarWrapper>
                <VerticalSidebar />
                <div className="  text-black absolute top-4 left-80 z-0 ">
                    <div className="flex flex-col  justify-start items-start">
                        <p className=" text-4xl font-bold">Billing</p>
                        <SlidebarBillingPage active={active} setActive={ setActive}/>
                        {children}
                    </div>
                </div>
            </SidebarWrapper>
        </>
    );
};

export default BillingWrapper;