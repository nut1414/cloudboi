// LabeledSelect.tsx
import React from "react";

interface Option {
  value: string;
  label: string;
}

interface LabeledSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  unit?: string;
}

const LabeledSelect: React.FC<LabeledSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  unit,
}) => {
  return (
    <div className="flex items-center space-x-4 relative">
      <label className="text-white text-lg w-40 text-right">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {unit && <span className="absolute right-14 text-gray-600">{unit}</span>}
    </div>
  );
};

export default LabeledSelect;
