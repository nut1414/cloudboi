import React from 'react';
import { CloudIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Button from './Common/Button/Button';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

// Shared error UI component
interface ErrorUIProps {
  error: unknown;
  onReload?: () => void;
  onGoHome?: () => void;
}

export const ErrorUI: React.FC<ErrorUIProps> = ({ error, onReload, onGoHome }) => {
  // Safely extract error message based on error type
  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      return err.message;
    } else if (isRouteErrorResponse(err)) {
      return `${err.status} ${err.statusText}`;
    } else if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
      return err.message;
    } else if (typeof err === 'string') {
      return err;
    }
    return 'An unknown error occurred';
  };
  
  const errorMessage = getErrorMessage(error);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1A33] p-4">
      <div className="bg-[#192A51] rounded-xl p-8 border border-blue-900/30 max-w-2xl w-full shadow-xl">
        <div className="flex items-center justify-center mb-6">
          <ExclamationTriangleIcon className="h-16 w-16 text-purple-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Something went wrong</h1>
        <p className="text-xl text-gray-300 mb-6 text-center">
          We're sorry, but an error has occurred.
        </p>
        
        {errorMessage && (
          <div className="bg-[#23375F] rounded-xl p-6 border border-blue-900/30 mb-8 hover:bg-[#23375F]/80 transition-colors">
            <p className="text-gray-300 mb-3 font-semibold">Error details:</p>
            <p className="text-gray-300 bg-[#0F1A33] p-4 rounded-lg overflow-auto font-mono text-sm border border-blue-900/20">
              {errorMessage}
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          {onReload && (
            <Button
              label="Reload Page"
              onClick={onReload}
              variant="purple"
              icon={<ArrowPathIcon className="h-5 w-5" />}
            />
          )}
          {onGoHome && (
            <Button
              label="Go Home"
              onClick={onGoHome}
              variant="outline"
              icon={<CloudIcon className="h-5 w-5" />}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// React Router error component
export const RouterErrorBoundary: React.FC = () => {
  const error = useRouteError();
  
  const handleReload = () => {
    window.location.reload();
  };
  
  const handleGoHome = () => {
    window.location.href = '/';
  };
  
  return <ErrorUI error={error} onReload={handleReload} onGoHome={handleGoHome} />;
};