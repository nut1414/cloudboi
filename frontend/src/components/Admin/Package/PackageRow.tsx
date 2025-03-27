// PackageRow.tsx
import React from "react";
import { PackageData } from "../../../tmp/type";

interface PackageRowProps {
  packageItem: PackageData;
  onEdit: (data: PackageData) => void;
}

const PackageRow: React.FC<PackageRowProps> = ({ packageItem, onEdit }) => {
  return (
    <div className="grid grid-cols-7 text-black text-md bg-red-300 mt-1 border-b py-2 px-4">
      <span className="ml-6 text-center">{packageItem.name}</span>
      <span className="ml-6 text-center">{packageItem.type}</span>
      <span className="ml-6 text-center">{packageItem.price}</span>
      <span className="ml-6 text-center">{packageItem.cpu}</span>
      <span className="ml-6 text-center">{packageItem.ram} GB</span>
      <span className="ml-6 text-center">{packageItem.storage} GB</span>
      <button
        className="bg-[#D5C6E0] shadow-md text-black py-2 rounded-2xl"
        onClick={() => onEdit(packageItem)}
      >
        Edit Package
      </button>
    </div>
  );
};

export default PackageRow;
