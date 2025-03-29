import React from "react";
import SlidebarBilling from "./SlidebarBilling/SlidebarBilling";


interface ComponentWithChildren {
    children?: React.ReactNode
    active:string;
    setActive: (value: string) => void;
}


const BillingWrapper: React.FC<ComponentWithChildren> = ({ children, active, setActive }) => {
    return (
        <>
                <div className="  text-black absolute top-4 left-80 z-0 ">
                    <div className="flex flex-col  justify-start items-start">
                        <p className="text-white text-4xl font-bold">Billing</p>
                        <SlidebarBilling active={active} setActive={ setActive}/>
                        {children}
                    </div>
                </div>
        </>
    );
};

export default BillingWrapper;