import { ChangeEvent } from "react";
import InputField from "./InputField";

interface AuthFormProps {
  title: string;
  fields: { name: string; type: string; label: string }[];
  buttonLabel: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  error?: string;
}

const AuthForm = ({ title, fields, buttonLabel, onChange, onSubmit, error }: AuthFormProps) => (
  <div className="ml-96">
    <div className="mt-[10vh] flex flex-col justify-start items-start h-auto w-[500px] bg-[#D5C6E0] rounded-2xl p-6">
      <p className="text-white text-2xl font-medium pb-4">{title}</p>
      {fields.map(({ name, type, label }) => (
        <InputField key={name} name={name} type={type} label={label} value={(onChange as any)[name]} onChange={onChange} />
      ))}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div className="w-full flex justify-center">
        <button type="submit" className="bg-[#192A51] w-full text-white mt-4 px-20 py-2 rounded-lg hover:border-white border-2 hover:text-blue-400 transition duration-300" onClick={onSubmit}>
          {buttonLabel}
        </button>
      </div>
    </div>
  </div>
);

export default AuthForm;
