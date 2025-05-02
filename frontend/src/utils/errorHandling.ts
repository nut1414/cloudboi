import { AxiosError } from 'axios';

/**
 * Extracts the error message from an API error response
 * First tries to get error.response?.data?.detail, falls back to error.message
 * 
 * @param error - The error object from a catch block
 * @param defaultMessage - Default message to use if no specific error is found
 * @returns Formatted error message
 */
export const getErrorMessage = (error: unknown, defaultMessage = 'An error occurred'): string => {
  // Handle string errors directly
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle axios errors
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<any>;
    
    if (axiosError.response?.data?.detail) {
      const detail = axiosError.response.data.detail;
      
      // Handle string detail
      if (typeof detail === 'string') {
        return detail;
      }
      
      // Handle array of validation errors
      if (Array.isArray(detail) && detail.length > 0) {
        if (typeof detail[0] === 'object' && detail[0] !== null && 'msg' in detail[0]) {
          return detail[0].msg as string;
        }
        return JSON.stringify(detail);
      }
      
      // Handle object detail
      if (typeof detail === 'object' && detail !== null) {
        return JSON.stringify(detail);
      }
    }
    
    // Fallback to regular error message
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  
  // Handle regular Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  return defaultMessage;
}; 