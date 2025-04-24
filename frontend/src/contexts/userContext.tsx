// src/contexts/userContext.tsx
import { ReactNode, useEffect } from 'react'
import { UserService, UserGetUserSessionResponse } from '../client'
import { BaseContextState, createContextProvider, ReducerAction } from './baseContext'

interface UserContextState extends BaseContextState {
  user: UserGetUserSessionResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  dispatch?: React.Dispatch<ReducerAction<UserContextState>>
}

// Define action types
export const USER_ACTIONS = {
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  START_SESSION_CHECK: 'START_SESSION_CHECK',
  SESSION_CHECK_SUCCESS: 'SESSION_CHECK_SUCCESS',
  SESSION_CHECK_FAILURE: 'SESSION_CHECK_FAILURE',
  LOGOUT: 'LOGOUT',
}

// Define the reducer
const userReducer = (
  state: UserContextState,
  action: ReducerAction<UserContextState>
): UserContextState => {
  switch (action.type) {
    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload?.is_authenticated,
      }
    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      }
    case USER_ACTIONS.START_SESSION_CHECK:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case USER_ACTIONS.SESSION_CHECK_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload?.is_authenticated,
        isLoading: false,
        error: null,
      }
    case USER_ACTIONS.SESSION_CHECK_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case USER_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      }
    default:
      return state
  }
}

// Initial state
const initialState: UserContextState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Create the context and hook using factory
const { Provider, useContextHook } = createContextProvider<UserContextState>(
  initialState,
  'User',
  userReducer
)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Create the actual provider component
  return (
    <Provider>
      <SessionInitializer>{children}</SessionInitializer>
    </Provider>
  )
}

// Separate component to handle session initialization to avoid circular dependencies
const SessionInitializer = ({ children }: { children: ReactNode }) => {
  const context = useContextHook()
  const { dispatch } = context

  useEffect(() => {
    const checkSession = async () => {
      if (!dispatch) return
      
      try {
        dispatch({ type: USER_ACTIONS.START_SESSION_CHECK })
        const response = await UserService.userGetUserSession()
        dispatch({ 
          type: USER_ACTIONS.SESSION_CHECK_SUCCESS, 
          payload: response.data ?? null 
        })
      } catch (error) {
        // // Hide error on session check, we don't want to show the user an error message
        dispatch({ 
          type: USER_ACTIONS.SESSION_CHECK_FAILURE, 
          payload: 'Unauthorized. Please sign in or register.' 
        })
      }
    }

    checkSession()
  }, [dispatch])

  return <>{children}</>
}

export const useUser = useContextHook