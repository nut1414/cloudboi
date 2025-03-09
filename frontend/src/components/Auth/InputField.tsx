import { ChangeEvent } from "react";

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({ label, type, name, value, onChange }: InputFieldProps) => (
  <div className="w-full flex flex-col justify-start items-start">
    <p className="text-white text-xl mb-2">{label}</p>
    <input
      type={type}
      name={name}
      placeholder={`Enter your ${label.toLowerCase()}...`}
      className="w-full mb-4 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={onChange}
    />
  </div>
);

export default InputField;
