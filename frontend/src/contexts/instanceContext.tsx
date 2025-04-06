// src/contexts/instanceContext.tsx
import { ReactNode } from "react"
import { UserInstanceResponse, InstanceDetails, BaseInstanceState } from "../client"
import { createContextProvider, BaseContextState, ReducerAction } from './baseContext'

// Define the specific state for instance context
interface InstanceContextState extends BaseContextState {
  userInstances: UserInstanceResponse[] | null
  selectedInstance: UserInstanceResponse | null
  instanceDetails: InstanceDetails | null
  instanceState: BaseInstanceState | null
  statePollingInterval: number | null
  isLoading: boolean
  error: string | null
  dispatch?: React.Dispatch<ReducerAction<InstanceContextState>>
}

// Define action types
export const INSTANCE_ACTIONS = {
  SET_USER_INSTANCES: 'SET_USER_INSTANCES',
  SET_SELECTED_INSTANCE: 'SET_SELECTED_INSTANCE',
  SET_INSTANCE_DETAILS: 'SET_INSTANCE_DETAILS',
  SET_INSTANCE_STATE: 'SET_INSTANCE_STATE',
  SET_STATE_POLLING_INTERVAL: 'SET_STATE_POLLING_INTERVAL',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  START_FETCH: 'START_FETCH',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
}

// Define the reducer
const instanceReducer = (
  state: InstanceContextState, 
  action: ReducerAction<InstanceContextState>
): InstanceContextState => {
  switch (action.type) {
    case INSTANCE_ACTIONS.SET_USER_INSTANCES:
      return {
        ...state,
        userInstances: action.payload,
      }
    case INSTANCE_ACTIONS.SET_SELECTED_INSTANCE:
      return {
        ...state,
        selectedInstance: action.payload,
      }
    case INSTANCE_ACTIONS.SET_INSTANCE_DETAILS:
      return {
        ...state,
        instanceDetails: action.payload,
      }
    case INSTANCE_ACTIONS.SET_INSTANCE_STATE:
      return {
        ...state,
        instanceState: action.payload,
      }
    case INSTANCE_ACTIONS.SET_STATE_POLLING_INTERVAL:
      return {
        ...state,
        statePollingInterval: action.payload,
      }
    case INSTANCE_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }
    case INSTANCE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      }
    case INSTANCE_ACTIONS.START_FETCH:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case INSTANCE_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      }
    case INSTANCE_ACTIONS.FETCH_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

// Initial state
const initialState: InstanceContextState = {
  userInstances: null,
  selectedInstance: null,
  instanceDetails: null,
  instanceState: null,
  statePollingInterval: null,
  isLoading: true,
  error: null,
}

// Create the context and hook using factory
const { Provider, useContextHook } = createContextProvider<InstanceContextState>(
  initialState,
  'Instance',
  instanceReducer
)

export const InstanceProvider = ({ children }: { children: ReactNode }) => {
  return <Provider>{children}</Provider>
}

export const useInstance = useContextHook
