// src/components/Instance/Create/ChooseAuthenMethod.tsx
import React, { useState } from "react";

interface ChooseAuthenMethodProps {
    password: string;
    onPasswordChange: (password: string) => void;
}

const ChooseAuthenMethod: React.FC<ChooseAuthenMethodProps> = ({ 
    password, 
    onPasswordChange 
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    
    const validatePassword = (value: string) => {
        const newErrors = [];
        
        if (value.length < 8) {
            newErrors.push("Password must be at least 8 characters long");
        }
        
        if (!/[A-Z]/.test(value)) {
            newErrors.push("Password must contain at least one uppercase letter");
        }
        
        if (!/[a-z]/.test(value)) {
            newErrors.push("Password must contain at least one lowercase letter");
        }
        
        if (!/[0-9]/.test(value)) {
            newErrors.push("Password must contain at least one number");
        }
        
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
            newErrors.push("Password must contain at least one special character");
        }
        
        setErrors(newErrors);
        onPasswordChange(value);
    };
    
    return (
        <>
            <p className="text-2xl pt-5 pb-4">Choose Authentication Method</p>
            <div className="bg-gray-100 h-auto min-h-[360px] w-[650px] rounded-2xl flex flex-col justify-start items-start p-6">
                <p className="text-xl font-bold">Create root password</p>
                <p className="mt-2 text-gray-600">Choose a secure root password to access and manage your instance</p>
                
                <div className="w-full mt-4 relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => validatePassword(e.target.value)}
                        placeholder="Enter password..."
                        className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2 text-gray-500"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                
                <div className="w-full mt-6">
                    <p className="text-xl font-medium mb-2">Password requirements</p>
                    <ul className="space-y-1">
                        <li className={`flex items-center ${password.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{password.length >= 8 ? '✓' : '✗'}</span>
                            <span className="ml-2">At least 8 characters long</span>
                        </li>
                        <li className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{/[A-Z]/.test(password) ? '✓' : '✗'}</span>
                            <span className="ml-2">At least one uppercase letter</span>
                        </li>
                        <li className={`flex items-center ${/[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{/[a-z]/.test(password) ? '✓' : '✗'}</span>
                            <span className="ml-2">At least one lowercase letter</span>
                        </li>
                        <li className={`flex items-center ${/[0-9]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{/[0-9]/.test(password) ? '✓' : '✗'}</span>
                            <span className="ml-2">At least one number</span>
                        </li>
                        <li className={`flex items-center ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? '✓' : '✗'}</span>
                            <span className="ml-2">At least one special character</span>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default ChooseAuthenMethod;