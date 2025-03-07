import UnauthenticatedNavbar from "../../components/Navbar/UnauthenticatedNavbar";
import { useState, ChangeEvent } from "react";
import AuthForm from "../../components/Auth/AuthForm";


interface FormData {
    email: string;
    password: string;
    error: string;
  }

function SignIn() {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        error: "",
      });
    
      const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = () => {
        console.log("Sign In Data:", formData);
      };
    
      return (
        <>
          <UnauthenticatedNavbar>
          <ul className="flex space-x-4 items-center">
            <p>Don't have an account?</p>
            <a href="signup" className="text-white underline">Sign Up</a>
            </ul>
          </UnauthenticatedNavbar>
          <AuthForm
            title="Sign In with Email"
            fields={[{ name: "email", type: "text", label: "Email" }, { name: "password", type: "password", label: "Password" }]}
            buttonLabel="Sign In"
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </>
      );
}

export default SignIn;
