import { useState, ChangeEvent } from "react";
import UnauthenticatedNavbar from "../../components/Navbar/UnauthenticatedNavbar";
import { validateConfirmPassword } from "../../utils/validate";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string;
}

function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    let errorMessage = "";
    if (name === "password" || name === "confirmPassword") {
      errorMessage = validateConfirmPassword(
        name === "password" ? value : formData.password,
        name === "confirmPassword" ? value : formData.confirmPassword
      );
    }
    setFormData((prev) => ({ ...prev, [name]: value, error: errorMessage }));
  };

  

  return (
    <>
      <UnauthenticatedNavbar>
        <ul className="flex space-x-4 items-center">
          <p>Already have an account?</p>
          <li>
            <a
              href="signin"
              className="text-white relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white"
            >
              Sign In
            </a>
          </li>
        </ul>
      </UnauthenticatedNavbar>
      <div className="ml-96">
        <div className="mt-[14vh] mb-6 flex flex-col justify-start items-start h-[600px] w-[500px] bg-[#D5C6E0] rounded-2xl p-6">
          <p className="text-white text-2xl font-medium pb-4">Sign Up</p>

          {[
            { name: "username", type: "text", label: "Username" },
            { name: "email", type: "text", label: "Email" },
            { name: "password", type: "password", label: "Password" },
            { name: "confirmPassword", type: "password", label: "Confirm Password" },
          ].map(({ name, type, label }) => (
            <div key={name} className="w-full flex flex-col justify-start items-start">
              <p className="text-white text-xl mb-2">{label}</p>
              <input
                type={type}
                name={name}
                placeholder={`Enter your ${label.toLowerCase()}...`}
                className="w-full mb-4 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData[name as keyof FormData]}
                onChange={handleChange}
              />
            </div>
          ))}


          {formData.error && <p className="text-red-500 text-sm mb-2">{formData.error}</p>}

          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="bg-[#192A51] w-full text-white mt-4 px-20 py-2 rounded-lg hover:border-white border-2 hover:text-blue-400 transition duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
