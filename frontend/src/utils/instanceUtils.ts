import { Requirement } from '../components/Common/RequirementsChecklist';

// Define the password requirement with test function
interface PasswordRequirement {
    key: string;
    label: string;
    test: (pwd: string) => boolean;
}

// Base password requirements definition
export const passwordRequirementRules: PasswordRequirement[] = [
    { key: 'length', label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
    { key: 'uppercase', label: 'Uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { key: 'lowercase', label: 'Lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
    { key: 'number', label: 'Number', test: (pwd: string) => /[0-9]/.test(pwd) },
    { key: 'special', label: 'Special character', test: (pwd: string) => /[!@#$%^&*()_+\-=\[\]{}':"\\|,.<>\/?]/.test(pwd) }
];

/**
 * Generates requirement objects with passed status for password validation
 * @param password The password to validate
 * @returns Array of requirements with pass/fail status
 */
export const getPasswordRequirements = (password: string): Requirement[] => {
    return passwordRequirementRules.map(({ key, label, test }) => ({
        key,
        label,
        passed: test(password)
    }));
};

/**
 * Checks if a password meets all requirements
 * @param password The password to validate
 * @returns Boolean indicating if all requirements are met
 */
export const isPasswordValid = (password: string): boolean => {
    return passwordRequirementRules.every(({ test }) => test(password));
}; 