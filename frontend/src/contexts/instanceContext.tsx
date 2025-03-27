// src/contexts/instanceContext.tsx
import { ReactNode } from "react";
import { UserInstanceResponse } from "../client";
import { createContextProvider, BaseContextState } from './baseContext';

// Define the specific state for instance context
interface InstanceContextState extends BaseContextState {
  userInstances: UserInstanceResponse[] | null;
  selectedInstance: UserInstanceResponse | null;
  isLoading: boolean;
  error: string | null;
  setUserInstances: (userInstances: UserInstanceResponse[] | null) => void;
  setSelectedInstance: (selectedInstance: UserInstanceResponse | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create the context and hook using factory
const { Provider, useContextHook } = createContextProvider<InstanceContextState>({
  userInstances: null,
  selectedInstance: null,
  isLoading: true,
  error: null,
  setUserInstances: () => {},
  setSelectedInstance: () => {},
  setIsLoading: () => {},
  setError: () => {},
}, 'Instance');

export const InstanceProvider = ({ children }: { children: ReactNode }) => {
  return <Provider>{children}</Provider>;
};

export const useInstance = useContextHook;
