import React from "react";
import TopNavbar from "../../components/Navbar/TopNavbar"

function Manage() {

  const instances = [
    { name: "instance_01", os: "Debian xx.xx.xx", usage: "8.23 GBs", type: "Instance Type 1", status: "Running" },
    { name: "instance_02", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
  ];

  return (
    <>
      <TopNavbar />
      <p className="text-black  pt-20 pl-0 mr-96"> Displaying xx items</p>
      {/* Large Square Content */}
      <div className="mr-0 ml-60 mt-[5vh]  justify-center h-[900px] w-[900px] bg-[#F5E6E8] rounded-2xl text-center">


        {/* Header Row */}
        <div className="justify-center grid grid-cols-6 text-black text-lg pt-4 pb-6  font-semibold">
          <span>Name</span>
          <span>OS</span>
          <span>Usage</span>
          <span>Instance Type</span>
          <span>Status</span>
          <span></span>

        </div>

        {/* Data Rows */}
        {instances.map((instance, index) => (
          <div key={index} className="grid grid-cols-6 text-black text-md bg-red-300 mt-1 border-b py-2 px-4">
            <span>{instance.name}</span>
            <span>{instance.os}</span>
            <span>{instance.usage}</span>
            <span>{instance.type}</span>
            <span className={`ml-8 font-semibold ${instance.status === "Running" ? "text-green-500" : "text-red-500"}`}>
              {instance.status}
            </span>

            <button className=" bg-[#D5C6E0] text-black  py-2 rounded-2xl ">View Instance</button>

          </div>
        ))}

      </div>
    </>
  );
}

export default React.memo(Manage);
