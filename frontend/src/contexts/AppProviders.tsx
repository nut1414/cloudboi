// src/contexts/AppProviders.tsx
import { ReactNode } from 'react'
import { UserProvider } from './userContext'
import { InstanceProvider } from './instanceContext'

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <UserProvider>
      <InstanceProvider>
        {children}
      </InstanceProvider>
    </UserProvider>
  )
}
