// src/contexts/AppProviders.tsx
import { ReactNode } from 'react'
import { UserProvider } from './userContext'
import { InstanceProvider } from './instanceContext'
import { BillingProvider } from './billingContext'
import { AdminProvider } from './adminContext'

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <UserProvider>
      <AdminProvider>
        <BillingProvider>
          <InstanceProvider>
            {children}
          </InstanceProvider>
        </BillingProvider>
      </AdminProvider>
    </UserProvider>
  )
}
