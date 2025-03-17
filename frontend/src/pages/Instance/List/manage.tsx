import React, { useState } from "react";
import TopNavbar from "../../../components/Navbar/TopNavbar";
import ColumnName from "../../../components/Instance/List/ColumnName";
import ContainerManage from "../../../components/Instance/List/ContainerManage";
import { Instance } from "../../../tmp/type";

// Sample Data
const instancesData: Instance[] = [
  { id: "In01", name: "instance_1", os: "Debian xx.xx.xx", usage: "8.23 GBs", type: "Instance Type 1", status: "Running" },
  { id: "In02", name: "instance_2", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
  { id: "In03", name: "instance_3", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
  { id: "In04", name: "instance_4", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
  { id: "In05", name: "instance_5", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
  { id: "In06", name: "instance_6", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
  
];

const Manage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter instances by search query
  const filteredInstances = instancesData.filter(instance =>
    instance.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <TopNavbar setSearchQuery={setSearchQuery} />
      <p className="text-black pt-20 pl-0 mr-96">Displaying {filteredInstances.length} items</p>

      {/* Main Container */}
      <div className="mr-0 ml-60 mt-[5vh] pb-16 shadow-md w-[900px] bg-[#F5E6E8] rounded-2xl">
        <ColumnName />
        <ContainerManage instances={filteredInstances} />
      </div>
    </>
  );
};

export default React.memo(Manage);
