// src/pages/Auth/Login.tsx
import React from 'react'
import { useAuth } from '../../../hooks/User/useAuth'
import InputField from '../../../components/Common/InputField'
import Button from '../../../components/Common/Button/Button'
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import AuthForm from '../../../components/User/Auth/AuthForm'

const Login: React.FC = () => {
  const {
    loginForm,
    isSubmitting,
    error,
    handleLoginSubmit
  } = useAuth()

  return (
    <AuthForm
      title="Sign in to your account"
      subtitle="Enter your credentials to access your cloud resources"
      onSubmit={handleLoginSubmit}
      error={error}
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkPath="/register"
    >
      <InputField
        label="Username"
        value={loginForm.data.username}
        onChange={(value) => loginForm.handleChange('username', value)}
        placeholder="Enter your username"
        icon={<UserIcon className="h-5 w-5" />}
        error={loginForm.errors.username}
        className="mb-4"
      />

      <InputField
        label="Password"
        type="password"
        value={loginForm.data.password}
        onChange={(value) => loginForm.handleChange('password', value)}
        placeholder="Enter your password"
        icon={<LockClosedIcon className="h-5 w-5" />}
        error={loginForm.errors.password}
        className="mb-4"
      />

      <div className="mt-6">
        <Button
          label={isSubmitting ? "Signing in..." : "Sign in"}
          variant="purple"
          onClick={(e) => {
            e.preventDefault()
            handleLoginSubmit(e as any)
          }}
          disabled={isSubmitting}
          className="w-full"
        />
      </div>
    </AuthForm>
  )
}

export default React.memo(Login)