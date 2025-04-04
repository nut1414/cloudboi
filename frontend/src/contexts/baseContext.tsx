import { createContext, useContext, useState, useReducer, ReactNode, Reducer } from 'react'

// Generic type for context state
export interface BaseContextState {
  isLoading?: boolean
  error?: string | null
}

// Type for actions
export type ReducerAction<T> = {
  type: string
  payload?: Partial<T> | any
}

// Factory function to create context with useReducer support
export function createContextProvider<T extends BaseContextState>(
  initialState: T,
  displayName: string,
  reducer?: Reducer<T, ReducerAction<T>>
) {
  // Create the context
  const Context = createContext<T | undefined>(undefined)
  Context.displayName = displayName

  // Create the provider component
  const Provider = ({ children, value }: { children: ReactNode; value?: Partial<T> }) => {
    // We need to separate the implementations to avoid conditional hook calls
    if (reducer) {
      return <ReducerProvider initialState={initialState} value={value} reducer={reducer}>{children}</ReducerProvider>
    } else {
      return <StateProvider initialState={initialState} value={value}>{children}</StateProvider>
    }
  }

  // Provider implementation using useReducer
  const ReducerProvider = ({ 
    children, 
    initialState, 
    value, 
    reducer 
  }: { 
    children: ReactNode 
    initialState: T 
    value?: Partial<T> 
    reducer: Reducer<T, ReducerAction<T>> 
  }) => {
    const [state, dispatch] = useReducer(reducer, { ...initialState, ...(value || {}) })
    
    const contextValue = {
      ...state,
      dispatch
    } as T

    return (
      <Context.Provider value={contextValue}>
        {children}
      </Context.Provider>
    )
  }

  // Provider implementation using useState
  const StateProvider = ({ 
    children, 
    initialState, 
    value 
  }: { 
    children: ReactNode 
    initialState: T 
    value?: Partial<T> 
  }) => {
    const [state, setState] = useState<T>({ ...initialState, ...(value || {}) })
    
    // Create setter functions for each property
    const setters: Record<string, any> = {}
    
    Object.keys(initialState).forEach(key => {
      setters[`set${key.charAt(0).toUpperCase() + key.slice(1)}`] = (value: any) => {
        setState(prev => ({ ...prev, [key]: value }))
      }
    })

    const contextValue = {
      ...state,
      ...setters
    } as T

    return (
      <Context.Provider value={contextValue}>
        {children}
      </Context.Provider>
    )
  }

  // Create the context hook
  const useContextHook = () => {
    const context = useContext(Context)
    if (context === undefined) {
      throw new Error(`use${displayName} must be used within a ${displayName}Provider`)
    }
    return context
  }

  return { Provider, useContextHook }
}