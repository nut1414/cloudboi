// src/pages/Auth/Register.tsx
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

const Register: React.FC = () => {
    const {
        registerForm,
        isSubmitting,
        error,
        handleRegisterSubmit
    } = useAuth()

    return (
        <AuthForm
            title="Create your account"
            subtitle="Start your cloud journey with CloudBoi"
            onSubmit={handleRegisterSubmit}
            error={error}
            footerText="Already have an account?"
            footerLinkText="Sign in"
            footerLinkPath="/login"
        >
            <InputField
                label="Email"
                type="email"
                value={registerForm.data.email}
                onChange={(value) => registerForm.handleChange('email', value)}
                placeholder="Enter your email"
                icon={<EnvelopeIcon className="h-5 w-5" />}
                error={registerForm.errors.email}
                className="mb-4"
            />

            <InputField
                label="Username"
                value={registerForm.data.username}
                onChange={(value) => registerForm.handleChange('username', value)}
                placeholder="Choose a username"
                icon={<UserIcon className="h-5 w-5" />}
                error={registerForm.errors.username}
                className="mb-4"
            />

            <InputField
                label="Password"
                type="password"
                value={registerForm.data.password}
                onChange={(value) => registerForm.handleChange('password', value)}
                placeholder="Create a password"
                icon={<LockClosedIcon className="h-5 w-5" />}
                helperText="At least 8 characters"
                error={registerForm.errors.password}
                className="mb-4"
            />

            <div>
                <Button
                    label={isSubmitting ? "Creating Account..." : "Sign Up"}
                    variant="purple"
                    onClick={(e) => {
                        e.preventDefault()
                        handleRegisterSubmit(e as any)
                    }}
                    disabled={isSubmitting}
                    className="w-full"
                />
            </div>
        </AuthForm>
    )
}

export default React.memo(Register)