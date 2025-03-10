import React from "react";
import TopNavbar from "../../../components/Navbar/TopNavbar";
import ColumnName from "../../../components/Instance/List/ColumnName";
import ContainerManage from "../../../components/Instance/List/ContainerManage";

function Manage() {

  const instances = [
    { id:"In01",name: "instance_1", os: "Debian xx.xx.xx", usage: "8.23 GBs", type: "Instance Type 1", status: "Running" },
    { id:"In02",name: "instance_2", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
    { id:"In03",name: "instance_3", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
    { id:"In04",name: "instance_4", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
    { id:"In05",name: "instance_5", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
    { id:"In06",name: "instance_6", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
    { id:"In07",name: "instance_7", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
    { id:"In08",name: "instance_8", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
    { id:"In09",name: "instance_9", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
    { id:"In10",name: "instance_10", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
  
  ];

  return (
    <>
      <TopNavbar />
      <p className="text-black  pt-20 pl-0 mr-96"> Displaying xx items</p>
     
       {/* Large Square Content */}
       <div className="mr-0 ml-60 mt-[5vh] pb-16 shadow-md justify-center  w-[900px] bg-[#F5E6E8] rounded-2xl">
          <ColumnName />
          {/* Data Rows */}
          <ContainerManage instances={instances} />
        </div>
    </>
  );
}

export default React.memo(Manage);
