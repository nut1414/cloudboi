// EditPackage.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import PackageForm from "../../../components/Admin/Package/PackageForm";
import { PackageData } from "../../../tmp/type";


const EditPackage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const encodedData = queryParams.get("data");

  const [initialData, setInitialData] = useState<PackageData | null>(null);

  useEffect(() => {
    if (encodedData) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(encodedData));
        setInitialData(decodedData);
      } catch (error) {
        console.error("Error parsing package data:", error);
      }
    }
  }, [encodedData]);

  const handleUpdate = (data: PackageData) => {
    console.log("Updated package data:", data);
    alert("Package updated successfully!");
    // Send the updated packageData to your backend API here
  };

  return (
      <div className="text-black absolute top-4 left-80 z-0">
        <div className="flex flex-col justify-start items-start">
          <p className="text-4xl font-bold mb-6">Edit Package</p>
          <div className="bg-red-300 shadow-md h-auto w-[640px] rounded-2xl p-6">
            {initialData ? (
              <PackageForm
                initialData={initialData}
                onSubmit={handleUpdate}
                submitButtonText="Save Changes"
              />
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
  );
};

export default EditPackage;
