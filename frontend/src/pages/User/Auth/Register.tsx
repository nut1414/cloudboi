import React from 'react'
import { useAuth } from '../../../hooks/User/useAuth'
import InputField from '../../../components/Common/InputField'
import Button from '../../../components/Common/Button/Button'
import {
    UserIcon,
    LockClosedIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline'
import AuthForm from '../../../components/User/Auth/AuthForm'
import { Controller } from 'react-hook-form'

const Register: React.FC = () => {
    const {
        registerForm,
        isSubmitting,
        handleRegisterSubmit
    } = useAuth()
    
    const { control, handleSubmit, formState: { errors } } = registerForm

    return (
        <AuthForm
            title="Create your account"
            subtitle="Start your cloud journey with CloudBoi"
            onSubmit={handleSubmit(handleRegisterSubmit)}
            footerText="Already have an account?"
            footerLinkText="Sign in"
            footerLinkPath="/login"
        >
            <Controller
                name="email"
                control={control}
                rules={{ 
                    required: 'Email is required',
                    pattern: {
                        // Matches the regex from the backend validator
                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                        message: 'Invalid email format'
                    }
                }}
                render={({ field }) => (
                    <InputField
                        label="Email"
                        type="email"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter your email"
                        icon={<EnvelopeIcon className="h-5 w-5" />}
                        error={errors.email?.message}
                        className="mb-4"
                        data-testid="register-email"
                    />
                )}
            />

            <Controller
                name="username"
                control={control}
                rules={{ 
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Username must be at least 3 characters' },
                    maxLength: { value: 20, message: 'Username must be at most 20 characters' },
                    pattern: {
                        // Username can only contain letters, numbers, underscores, and hyphens
                        value: /^[a-zA-Z0-9_-]+$/,
                        message: 'Username can only contain letters, numbers, underscores, and hyphens'
                    }
                }}
                render={({ field }) => (
                    <InputField
                        label="Username"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Choose a username"
                        icon={<UserIcon className="h-5 w-5" />}
                        error={errors.username?.message}
                        className="mb-4"
                        data-testid="register-username"
                    />
                )}
            />

            <Controller
                name="password"
                control={control}
                rules={{ 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters long' },
                    validate: {
                        hasUppercase: (value) => /[A-Z]/.test(value) || 
                            'Password must contain at least one uppercase letter',
                        hasLowercase: (value) => /[a-z]/.test(value) || 
                            'Password must contain at least one lowercase letter',
                        hasDigit: (value) => /\d/.test(value) || 
                            'Password must contain at least one digit'
                    }
                }}
                render={({ field }) => (
                    <InputField
                        label="Password"
                        type="password"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Create a password"
                        icon={<LockClosedIcon className="h-5 w-5" />}
                        helperText="At least 8 characters with uppercase, lowercase, and a number"
                        error={errors.password?.message}
                        className="mb-4"
                        data-testid="register-password"
                    />
                )}
            />

            <div>
                <Button
                    label={isSubmitting ? "Creating Account..." : "Sign Up"}
                    variant="purple"
                    onClick={handleSubmit(handleRegisterSubmit)}
                    disabled={isSubmitting}
                    className="w-full"
                    data-testid="register"
                />
            </div>
        </AuthForm>
    )
}

export default React.memo(Register)