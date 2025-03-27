// src/contexts/contextFactory.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// Generic type for context state
export interface BaseContextState {
  isLoading?: boolean;
  error?: string | null;
}

// Factory function to create context and provider
export function createContextProvider<T extends BaseContextState>(
  initialState: T,
  displayName: string
) {
  // Create the context
  const Context = createContext<T | undefined>(undefined);
  Context.displayName = displayName;

  // Create the provider component
  const Provider = ({ children, value }: { children: ReactNode; value?: Partial<T> }) => {
    const [state, setState] = useState<T>({ ...initialState, ...(value || {}) });

    // Create setter functions for each property
    const setters: Record<string, any> = {};
    Object.keys(initialState).forEach(key => {
      setters[`set${key.charAt(0).toUpperCase() + key.slice(1)}`] = (value: any) => {
        setState(prev => ({ ...prev, [key]: value }));
      };
    });

    return (
      <Context.Provider value={{ ...state, ...setters }}>
        {children}
      </Context.Provider>
    );
  };

  // Create the context hook
  const useContextHook = () => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${displayName} must be used within a ${displayName}Provider`);
    }
    return context;
  };

  return { Provider, useContextHook };
}
