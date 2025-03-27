import { useState, useEffect, ReactNode } from 'react'
import { UserService, UserGetUserSessionResponse } from '../client'
import { BaseContextState, createContextProvider } from './baseContext'

interface UserContextState extends BaseContextState {
  user: UserGetUserSessionResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserGetUserSessionResponse | null) => void;
  setError: (error: string | null) => void;
}

const { Provider, useContextHook } = createContextProvider<UserContextState>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  setUser: () => {},
  setError: () => {},
}, 'User');

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserGetUserSessionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const response = await UserService.userGetUserSession();
        setUser(response.data ?? null);
      } catch (error) {
        setError('Session check failed');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  return (
    <Provider value={{ 
      user, 
      isAuthenticated: !!user?.is_authenticated, 
      isLoading, 
      error, 
      setUser, 
      setError 
    }}>
      {children}
    </Provider>
  );
}

export const useUser = useContextHook;