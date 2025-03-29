import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

import ContainerSidebar from "./ContainerSidebar";
import AvailableCredit from "./AvailableCredit";
import CloudBoiLogo from "./CloudboiLogo";

const VerticalSidebar: React.FC = () => {

  const location = useLocation();
  const [showDiv, setShowDiv] = useState(true);


  const pathSegments = location.pathname.split("/").filter(Boolean);
  const userRole = pathSegments[0] || ""; // Assuming username is at index 0
  const currentPath = pathSegments[2] || ""; // Assuming pathmenu is at index 2

  const { userName } = useParams<{ userName: string }>(); // Extract userName from the URL
  const { adminName } = useParams<{ adminName: string }>(); // Extract adminName from the URL
  
  return (
    <nav className="bg-[#192A51] h-screen w-64 fixed top-0 left-0 ">

      <ul className="flex flex-col h-full">
        <CloudBoiLogo />
        <AvailableCredit />

        <ul onMouseEnter={() => setShowDiv(false)}
          onMouseLeave={() => setShowDiv(true)}>

          {/* role user  */}
          {userRole === "user" && (
            <>
              <ContainerSidebar role={userRole} userName={userName ?? ""} currentPath={currentPath} pathName={"instance"} showDiv={showDiv} name={"Manage"} />
              <ContainerSidebar role={userRole} userName={userName ?? ""} currentPath={currentPath} pathName={"billing"} showDiv={showDiv} name={"Billing"} />
              <ContainerSidebar role={userRole} userName={userName ?? ""} currentPath={currentPath} pathName={"support"} showDiv={showDiv} name={"Support"} />
              <ContainerSidebar role={userRole} userName={userName ?? ""} currentPath={currentPath} pathName={"setting/access"} showDiv={showDiv} name={"Setting"} />
            </>)}
          {/* role admin */}
          {userRole === "admin" && (
            <>
              <ContainerSidebar role={userRole} userName={adminName ?? ""} currentPath={currentPath} pathName={"billing"} showDiv={showDiv} name={"Billing"} />
              <ContainerSidebar role={userRole} userName={adminName ?? ""} currentPath={currentPath} pathName={"package"} showDiv={showDiv} name={"Package"} />
            </>)}
        </ul>
      </ul>
    </nav>
  );
};

export default VerticalSidebar;
