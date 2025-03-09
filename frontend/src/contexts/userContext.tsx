import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserService, UserGetUserSessionResponse } from '../client'

interface UserContextType {
    user: UserGetUserSessionResponse | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    setUser: (user: UserGetUserSessionResponse | null) => void
    setError: (error: string | null) => void
}

interface UserProviderProps {
    children: ReactNode
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<UserGetUserSessionResponse | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
  
    // Check if user is authenticated on mount
    useEffect(() => {
      const checkSession = async () => {
        try {
          setIsLoading(true)
          const response = await UserService.userGetUserSession()
          setUser(response.data ?? null)
        } catch (error) {
          setError('Session check failed')
          setUser(null)
        } finally {
          setIsLoading(false)
        }
      }
  
      checkSession()
    }, [])

    return (
        <UserContext.Provider value={{ 
            user, 
            isAuthenticated: !!user?.is_authenticated, 
            isLoading, 
            error, 
            setUser, 
            setError 
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}