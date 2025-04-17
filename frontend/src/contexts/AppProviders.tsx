// src/contexts/AppProviders.tsx
import { ReactNode } from 'react'
import { UserProvider } from './userContext'
import { InstanceProvider } from './instanceContext'
import { BillingProvider } from './billingContext'
import { AdminProvider } from './adminContext'
import NotificationProvider from './NotificationContext'

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <UserProvider>
      <AdminProvider>
        <BillingProvider>
          <InstanceProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </InstanceProvider>
        </BillingProvider>
      </AdminProvider>
    </UserProvider>
  )
}
