// PackageRow.tsx
import React  from "react";
import { PackageData } from "../../../tmp/type";

interface PackageRowProps {
  packageItem: PackageData;
  onEdit: (data: PackageData) => void;
  onDelete: (data: PackageData) => void;
}

const PackageRow: React.FC<PackageRowProps> = ({
  packageItem,
  onEdit,
  onDelete,
}) => {


  return (
    <div className="w-full">
      <div className="grid grid-cols-7 text-gray-300 text-md bg-[#23375F] mt-1  py-2 px-4">
        <span className="ml-6 text-center">{packageItem.name}</span>
        <span className="ml-6 text-center">{packageItem.type}</span>
        <span className="ml-6 text-center">{packageItem.price}</span>
        <span className="ml-6 text-center">{packageItem.cpu}</span>
        <span className="ml-6 text-center">{packageItem.ram} GB</span>
        <span className="ml-6 text-center">{packageItem.storage} GB</span>

        <div className="flex flex-col gap-2">
          <button
            className="bg-[#192A51] shadow-md text-white py-2 rounded-2xl px-2 border-2 border-transparent hover:border-white"
            onClick={() => onEdit(packageItem)}
          >
            Edit
          </button>
          <button
            className="bg-purple-600 text-white py-2 rounded-2xl px-2
             hover:bg-purple-700 transition-colors duration-300"
            onClick={() => onDelete(packageItem)}
          >
            Delete
          </button>
        

        </div>
      </div>

    </div>
  );
};

export default PackageRow;
