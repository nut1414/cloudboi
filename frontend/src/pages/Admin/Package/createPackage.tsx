// CreatePackage.tsx
import React from "react";

import PackageForm from "../../../components/Admin/Package/PackageForm";
import { PackageData } from "../../../tmp/type";

const CreatePackage: React.FC = () => {
  const handleCreate = (data: PackageData) => {
    console.log("Created package data:", data);
    alert("Package created successfully!");
    // Send packageData to your backend API here
  };

  return (
    
      <div className="text-black absolute top-4 left-80 z-0">
        <div className="flex flex-col justify-start items-start">
          <p className="text-white text-4xl font-bold">Create Package</p>
          <div className="mt-10 bg-[#192A51] shadow-md h-auto w-[640px] rounded-2xl p-6">
            <PackageForm onSubmit={handleCreate} submitButtonText="Create Package" />
          </div>
        </div>
      </div>
   
  );
};

export default CreatePackage;
