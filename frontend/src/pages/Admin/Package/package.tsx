// Package.tsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import PackageTable from "../../../components/Admin/Package/PackageTable";
import { PackageData } from "../../../tmp/type";

const initialPackages: PackageData[] = [
  {
    id: "PackageId 1",
    name: "Package 1",
    type: 1,
    price: 200,
    cpu: 1,
    ram: 2,
    storage: 25,
    instances: [
      {
        id: "InstanceId1",
        instanceName: "instance1",
        username: "xxxxxxx",
        userId: "xxxxxxx",
        status: "Stopped",
        paymentStatus: "Pending",
      },
      {
        id: "InstanceId2",
        instanceName: "instance2",
        username: "xxxxxxx",
        userId: "xxxxxxx",
        status: "Running",
        paymentStatus: "Paid",
      },
    ],
  },
  {
    id: "PackageId 2",
    name: "Package 2",
    type: 2,
    price: 1000,
    cpu: 2,
    ram: 2,
    storage: 50,
    instances: [
      {
        id: "InstanceId3",
        instanceName: "instance3",
        username: "xxxxxxx",
        userId: "xxxxxxx",
        status: "Stopped",
        paymentStatus: "Pending",
      },
    ],
  },
 
];

const Package: React.FC = () => {
  const location = useLocation();

  
  const [packages, setPackages] = useState<PackageData[]>(initialPackages);

 
  const handleEditPackage = (packageData: PackageData) => {
    window.location.href = `${location.pathname}/edit?data=${encodeURIComponent(
      JSON.stringify(packageData)
    )}`;
  };

 
  const handleDeletePackage = (packageData: PackageData) => {
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${packageData.name}"?`
    );
    if (!confirmDelete) return;

    setPackages((prevPackages) =>
      prevPackages.filter((p) => p.id !== packageData.id)
    );
  };

  return (
    <>
      <div className="absolute shadow-md top-14 ml-8 mt-8 w-[920px] h-[4px] bg-purple-600  bg-opacity-50 z-[-1] rounded-full"></div>
      <div className="text-black absolute top-4 left-80 z-0">
        <div className="flex flex-col justify-start items-start">
          <div className="mt-4 flex items-center gap-80">
            <p className="text-white text-4xl font-bold">Package</p>
            <a
              href={`${location.pathname}/create`}
              className="ml-96 bg-purple-600  shadow-md text-white px-4 py-2 rounded-2xl hover:bg-purple-700 transition-colors duration-300"
            >
              Create
            </a>
          </div>
          <p className="text-white text-3xl mt-14">All Packages</p>
          <p className="text-gray-300 text-black mt-8 pl-0 mr-96">
            Displaying {packages.length} items
          </p>

          
          <PackageTable
            packages={packages}
            onEdit={handleEditPackage}
            onDelete={handleDeletePackage}
          />
        </div>
      </div>
    </>
  );
};

export default Package;
