import UnauthenticatedNavbar from "../../components/Navbar/UnauthenticatedNavbar";
import AuthForm from "../../components/Auth/AuthForm";
import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/User/useAuth";
import { useUser } from "../../contexts/userContext";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { error: contextError } = useUser();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Clear previous error messages
    setFormData({ ...formData, error: "" });
    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      // Redirect to the user instance page upon successful login
      navigate(`/user/${formData.email}/instance`, { replace: true });
    } catch (err: any) {
      setFormData({
        ...formData,
        error: err.response?.data?.detail || "Login failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display error from either local state or context
  const displayError = formData.error || contextError;

  return (
    <>
      <UnauthenticatedNavbar>
        <ul className="flex space-x-4 items-center">
          <p>Don't have an account?</p>
          <a href="register" className="text-white underline">
            Register
          </a>
        </ul>
      </UnauthenticatedNavbar>
      {displayError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{displayError}</div>
        </div>
      )}
      <AuthForm
        title="Login with Email"
        fields={[
          { name: "email", type: "text", label: "Email" },
          { name: "password", type: "password", label: "Password" },
        ]}
        buttonLabel={isSubmitting ? "Logining in..." : "Login"}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default SignIn;
