// src/components/Auth/AuthForm.tsx
import React, { ReactNode, useEffect } from 'react'
import { Link } from 'react-router-dom'

type AuthFormProps = {
  title: string
  subtitle: string
  onSubmit: (e: React.FormEvent) => void
  children: ReactNode
  footerText: string
  footerLinkText: string
  footerLinkPath: string
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  subtitle,
  onSubmit,
  children,
  footerText,
  footerLinkText,
  footerLinkPath,
}) => {
  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#192A51] rounded-xl p-8 shadow-lg border border-blue-900/30">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">{title}</h2>
            <p className="text-gray-300 mt-2">{subtitle}</p>
          </div>

          <form onSubmit={onSubmit}>{children}</form>

          <div className="text-center mt-6">
            <p className="text-gray-300">
              {footerText}{" "}
              <Link to={footerLinkPath} className="text-purple-400 hover:underline font-medium">
                {footerLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
