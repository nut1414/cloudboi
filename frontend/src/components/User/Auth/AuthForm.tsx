// src/components/Auth/AuthForm.tsx
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

type AuthFormProps = {
  title: string;
  subtitle: string;
  onSubmit: (e: React.FormEvent) => void;
  error?: string | null;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkPath: string;
};

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  subtitle,
  onSubmit,
  error,
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

          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border-l-4 border-red-500 text-red-300 rounded">
              <div className="flex items-center">
                <InformationCircleIcon className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}

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
  );
};

export default AuthForm;
