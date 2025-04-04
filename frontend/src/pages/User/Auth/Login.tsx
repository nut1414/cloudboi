import React from 'react'
import { useAuth } from '../../../hooks/User/useAuth'
import InputField from '../../../components/Common/InputField'
import Button from '../../../components/Common/Button/Button'
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import AuthForm from '../../../components/User/Auth/AuthForm'
import { Controller } from 'react-hook-form'

const Login: React.FC = () => {
  const {
    loginForm,
    isSubmitting,
    error,
    handleLoginSubmit
  } = useAuth()
  
  const { control, handleSubmit, formState: { errors } } = loginForm

  return (
    <AuthForm
      title="Sign in to your account"
      subtitle="Enter your credentials to access your cloud resources"
      onSubmit={handleSubmit(handleLoginSubmit)}
      error={error}
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkPath="/register"
    >
      <Controller
        name="username"
        control={control}
        rules={{ 
          required: 'Username is required',
          minLength: { value: 3, message: 'Username must be at least 3 characters' }
        }}
        render={({ field }) => (
          <InputField
            label="Username"
            value={field.value}
            onChange={field.onChange}
            placeholder="Enter your username"
            icon={<UserIcon className="h-5 w-5" />}
            error={errors.username?.message}
            className="mb-4"
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{ required: 'Password is required' }}
        render={({ field }) => (
          <InputField
            label="Password"
            type="password"
            value={field.value}
            onChange={field.onChange}
            placeholder="Enter your password"
            icon={<LockClosedIcon className="h-5 w-5" />}
            error={errors.password?.message}
            className="mb-4"
          />
        )}
      />

      <div className="mt-6">
        <Button
          label={isSubmitting ? "Signing in..." : "Sign in"}
          variant="purple"
          onClick={handleSubmit(handleLoginSubmit)}
          disabled={isSubmitting}
          className="w-full"
        />
      </div>
    </AuthForm>
  )
}

export default React.memo(Login)