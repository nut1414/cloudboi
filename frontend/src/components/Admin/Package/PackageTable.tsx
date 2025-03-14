// PackageTable.tsx
import React from "react";
import PackageRow from "./PackageRow";
import { PackageData } from "../../../tmp/type";

interface PackageTableProps {
  packages: PackageData[];
  onEdit: (data: PackageData) => void;
}

const PackageTable: React.FC<PackageTableProps> = ({ packages, onEdit }) => {
  return (
    <div className="mt-[5vh] pb-16 mb-10 shadow-md justify-center w-[920px] bg-[#F5E6E8] rounded-2xl">
      <div className="ml-14 gap-4 justify-center grid grid-cols-7 text-black text-lg pt-4 pb-6 font-semibold">
        <span>Package Name</span>
        <span className="ml-6">Type</span>
        <span>Price(CBC)</span>
        <span>VCPUs</span>
        <span>Ram</span>
        <span>Storage</span>
        <span></span>
      </div>
      <div className="max-h-[600px] overflow-y-auto">
        {packages.map((item) => (
          <PackageRow key={item.id} packageItem={item} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

export default PackageTable;
