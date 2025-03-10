// Utility function to check if a string contains a specific character type.
const containsType = (pattern: RegExp, str: string): boolean => pattern.test(str);

// Function to validate password based on the given rules.
export const validatePassword = (password: string): boolean => {
  const MIN_LENGTH = 8;
  const passwordConditions = [
    /[A-Z]/,  // Uppercase letter
    /[a-z]/,  // Lowercase letter
    /\d/,     // Digit
    /[@$!%*?&]/, // Special character
  ];

  // Check password length and the number of character types met
  const validTypesCount = passwordConditions.filter((condition) => containsType(condition, password)).length;
  
  return password.length >= MIN_LENGTH && validTypesCount >= 3;
};

// Function to validate that the passwords match and meet the criteria.
export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!validatePassword(password)) {
    return "Password must be at least 8 characters long and include at least 3 of the following: uppercase letter, lowercase letter, digit, special character (!@$!%*?&).";
  }
  if (confirmPassword !== password) {
    return "Passwords do not match!";
  }
  return "";
};
