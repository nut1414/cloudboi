// src/contexts/AppProviders.tsx
import { ReactNode } from 'react'
import { UserProvider } from './userContext'
import { InstanceProvider } from './instanceContext'
import { BillingProvider } from './billingContext'

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <UserProvider>
      <BillingProvider>
        <InstanceProvider>
          {children}
        </InstanceProvider>
      </BillingProvider>
    </UserProvider>
  )
}
