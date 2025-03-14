// PackagePage.tsx
import React from "react";
import { useLocation } from "react-router-dom";

import PackageTable from "../../../components/Admin/Package/PackageTable";
import { PackageData } from "../../../tmp/type";

const packages: PackageData[] = [
  { id: "PackageId 1", name: "Package 1", type: 1, price: 200, cpu: 1, ram: 2, storage: 25 },
  { id: "PackageId 2", name: "Package 2", type: 2, price: 1000, cpu: 2, ram: 2, storage: 50 },
  { id: "PackageId 3", name: "Package 3", type: 3, price: 2000, cpu: 2, ram: 4, storage: 100 },
  { id: "PackageId 4", name: "Package 4", type: 2, price: 3000, cpu: 1, ram: 4, storage: 50 },
  { id: "PackageId 5", name: "Package 5", type: 1, price: 4000, cpu: 1, ram: 2, storage: 25 },
];

const Package: React.FC = () => {
  const location = useLocation();
  // Function to send package data as URL parameters and redirect to the edit page
  const handleEditPackage = (packageData: PackageData) => {
    window.location.href = `${location.pathname}/edit?data=${encodeURIComponent(
      JSON.stringify(packageData)
    )}`;
  };

  return (
    <>
      <div className="absolute shadow-md top-14 left-72 mt-8 w-[960px] h-[4px] bg-red-300 bg-opacity-50 z-[-1] rounded-full"></div>
      <div className="text-black absolute top-4 left-80 z-0">
        <div className="flex flex-col justify-start items-start">
          <div className="mt-4 flex items-center gap-80">
            <p className="text-4xl font-bold">Package</p>
            <a
              href={`${location.pathname}/create`}
              className="ml-80 bg-[#D5C6E0] shadow-md text-black px-4 py-2 rounded-2xl"
            >
              Create
            </a>
          </div>
          <p className="text-3xl mt-14">All Packages</p>
          <p className="text-black mt-8 pl-0 mr-96">
            Displaying {packages.length} items
          </p>
          <PackageTable packages={packages} onEdit={handleEditPackage} />
        </div>
      </div>
    </>
  );
};

export default Package;
