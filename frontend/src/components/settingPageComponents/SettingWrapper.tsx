import React from "react";
import VerticalSidebar from "../sidebar/VerticalSidebar";
import SidebarWrapper from "../sidebar/SidebarWrapper";
import TopicName from "./TopicName";
import SlidebarSettingPage from "../slidebarSetting/SlidebarSettingPage";


interface ComponentWithChildren {
    children?: React.ReactNode
}

const SettingWrapper: React.FC<ComponentWithChildren> = ({ children }) => {
    return (
        <>
            <SidebarWrapper>
                <VerticalSidebar />
                <div className="  text-black absolute top-4 left-80 z-0 ">
                    <div className="flex flex-col  justify-start items-start">
                        <TopicName />
                        <SlidebarSettingPage />
                        {children}
                    </div>
                </div>
            </SidebarWrapper>
        </>
    );
};

export default SettingWrapper;