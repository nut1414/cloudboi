import Navbar from "../components/Navbar";
import SidebarWrapper from "../components/sidebar/SidebarWrapper";
import ColumnName from "../components/managePageComponents/ColumnName";
import ContainerManage from "../components/managePageComponents/ContainerManage";

function Manage() {

  const instances = [
    { name: "instance_01", os: "Debian xx.xx.xx", usage: "8.23 GBs", type: "Instance Type 1", status: "Running" },
    { name: "instance_02", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
  ];

  return (
    <>
      <SidebarWrapper>
        <Navbar />
        <p className="text-black  pt-20 pl-0 mr-96"> Displaying xx items</p>
        {/* Large Square Content */}
        <div className="mr-0 ml-60 mt-[5vh]  justify-center h-[900px] w-[900px] bg-[#F5E6E8] rounded-2xl">
          <ColumnName />
          {/* Data Rows */}
          <ContainerManage instances={instances} />
        </div>
      </SidebarWrapper>
    </>
  );
}

export default Manage;
