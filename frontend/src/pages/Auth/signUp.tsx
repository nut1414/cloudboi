import { useState, ChangeEvent } from "react";
import UnauthenticatedNavbar from "../../components/Navbar/UnauthenticatedNavbar";
import { validateConfirmPassword } from "../../utils/validate";
import AuthForm from "../../components/Auth/AuthForm";
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let errorMessage = "";
    if (name === "password" || name === "confirmPassword") {
      errorMessage = validateConfirmPassword(
        name === "password" ? value : formData.password,
        name === "confirmPassword" ? value : formData.confirmPassword || ""
      );
    }
    setFormData((prev) => ({ ...prev, [name]: value, error: errorMessage }));
  };

  const handleSubmit = () => {
    console.log("Sign Up Data:", formData);
  };

  return (
    <>
      <UnauthenticatedNavbar>
      <ul className="flex space-x-4 items-center">
        <p>Already have an account?</p>
        <a href="login" className="text-white underline">Login</a>
      </ul>
      </UnauthenticatedNavbar>
      <AuthForm
        title="Register"
        fields={[
          { name: "username", type: "text", label: "Username" },
          { name: "email", type: "text", label: "Email" },
          { name: "password", type: "password", label: "Password" },
          { name: "confirmPassword", type: "password", label: "Confirm Password" }
        ]}
        buttonLabel="Register"
        onChange={handleChange}
        onSubmit={handleSubmit}
        error={formData.error}
      />
    </>
  );
}

export default SignUp;
