import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ContainerSidebar from "./ContainerSidebar";
import AvailableCredit from "./AvailableCredit";
import CloudBoiLogo from "./CloudBoiLogo";

const VerticalSidebar: React.FC = () => {

  const location = useLocation();
  const [showDiv, setShowDiv] = useState(true); 

  return (
    <nav className="bg-[#192A51] h-screen w-64 fixed top-0 left-0 ">

      <ul className="flex flex-col h-full">
        <CloudBoiLogo />
        <AvailableCredit />

        <ul onMouseEnter={() => setShowDiv(false)}
          onMouseLeave={() => setShowDiv(true)}>

          <ContainerSidebar currentPath={(location.pathname.split("/").filter(Boolean)[0] || "")} pathName={"manage"} showDiv={showDiv} name={"Manage"} />
          <ContainerSidebar currentPath={(location.pathname.split("/").filter(Boolean)[0] || "")} pathName={"billing"} showDiv={showDiv} name={"Billing"} />
          <ContainerSidebar currentPath={(location.pathname.split("/").filter(Boolean)[0] || "")} pathName={"support"} showDiv={showDiv} name={"Support"} />
          <ContainerSidebar currentPath={(location.pathname.split("/").filter(Boolean)[0] || "")} pathName={"setting/access"} showDiv={showDiv} name={"Setting"} />

        </ul>
      </ul>
    </nav>

  );
};

export default VerticalSidebar;
