import React from "react";
import TopicName from "./TopicName";
import SlidebarSetting from "./SlidebarSetting/SlidebarSetting";

interface ComponentWithChildren {
    children?: React.ReactNode;
    active:number;
    setActive: (value: number) => void;
}

const SettingWrapper: React.FC<ComponentWithChildren> = ({ children ,active, setActive}) => {
    return (
        <>
                <div className="  text-black absolute top-4 left-80 z-0 ">
                    <div className="flex flex-col  justify-start items-start">
                        <TopicName />
                        <SlidebarSetting active={active} setActive={ setActive}/>
                        {children}
                    </div>
                </div>
        </>
    );
};

export default SettingWrapper;