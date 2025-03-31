// PackageForm.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import LabeledInput from "./LabeledInput";
import LabeledSelect from "./LabeledSelect";
import { PackageData } from "../../../tmp/type";

interface PackageFormProps {
  initialData?: PackageData;
  onSubmit: (data: PackageData) => void;
  submitButtonText: string;
}

const PackageForm: React.FC<PackageFormProps> = ({
  initialData,
  onSubmit,
  submitButtonText,
}) => {
  const [packageData, setPackageData] = useState<PackageData>({
    id: initialData?.id || "",
    name: initialData?.name || "",
    type: initialData?.type || 0,
    price: initialData?.price || 0,
    cpu: initialData?.cpu || 0,
    ram: initialData?.ram || 0,
    storage: initialData?.storage || 0,
  });

  // Update form state if initialData changes (useful for edit mode)
  useEffect(() => {
    if (initialData) {
      setPackageData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPackageData((prevData) => ({
      ...prevData,
      [name]:
        ["price", "cpu", "ram", "storage"].includes(name) && value !== ""
          ? Number(value)
          : value,
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    // For select elements, convert value to number if applicable (e.g. type or ram)
    setPackageData((prevData) => ({
      ...prevData,
      [name]: value === "" ? 0 : Number(value),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(packageData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <LabeledInput
        label="Package Name:"
        name="name"
        value={packageData.name}
        onChange={handleInputChange}
        placeholder="Enter package name"
      />

      <LabeledSelect
        label="Type:"
        name="type"
        value={packageData.type ? packageData.type.toString() : ""}
        onChange={handleSelectChange}
        options={[
          { value: "", label: "-- Choose Type --" },
          { value: "1", label: "Type 1" },
          { value: "2", label: "Type 2" },
          { value: "3", label: "Type 3" },
        ]}
      />

      <LabeledInput
        label="Price (CBC):"
        name="price"
        type="number"
        value={packageData.price}
        onChange={handleInputChange}
        unit="CBC/month"
      />

      <LabeledInput
        label="VCPUs:"
        name="cpu"
        type="number"
        value={packageData.cpu}
        onChange={handleInputChange}
        placeholder="Enter CPU cores"
        unit="Core"
      />

      <LabeledSelect
        label="RAM (GB):"
        name="ram"
        value={packageData.ram ? packageData.ram.toString() : ""}
        onChange={handleSelectChange}
        options={[
          { value: "", label: "-- Choose RAM --" },
          { value: "2", label: "2" },
          { value: "4", label: "4" },
          { value: "8", label: "8" },
          { value: "16", label: "16" },
        ]}
        unit="GB"
      />

      <LabeledInput
        label="Storage (GB):"
        name="storage"
        type="number"
        value={packageData.storage}
        onChange={handleInputChange}
        placeholder="Enter storage size"
        unit="GB"
      />

      <button
        type="submit"
        className="bg-purple-600 text-white font-bold px-6 py-2 rounded-lg 
        hover:bg-purple-700 transition-colors duration-300 transition w-full mt-4"

      >
        {submitButtonText}
      </button>
    </form>
  );
};

export default PackageForm;
