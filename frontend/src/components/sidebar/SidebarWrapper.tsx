import React from "react";
import VerticalSidebar from "./VerticalSidebar";

interface ComponentWithChildren {
  children?: React.ReactNode
}

const SidebarWrapper: React.FC<ComponentWithChildren> = ({ children }) => {
  return (
    <div className="wrapper-container">
    <VerticalSidebar />
    <div className="content-container">{children}</div>
  </div>
  );
};

export default SidebarWrapper;