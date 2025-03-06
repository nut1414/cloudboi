export const validatePassword = (password: string): boolean =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  
  export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!validatePassword(password)) {
      return "Least 8 characters (0-9) (a-z, A-Z) (!@#$%^& etc.)";
    }
    if (confirmPassword !== password) {
      return "Passwords do not match!";
    }
    return "";
  };
  