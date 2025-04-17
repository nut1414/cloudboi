import { ReactNode } from 'react'
import { AdminGetAllUsersResponse, ClusterGetMembersStateResponse } from '../client'
import { BaseContextState, createContextProvider, ReducerAction } from './baseContext'

interface AdminContextState extends BaseContextState {
    users: AdminGetAllUsersResponse | null
    clusterStates: ClusterGetMembersStateResponse | null
    isLoading: boolean
    error: string | null
    dispatch?: React.Dispatch<ReducerAction<AdminContextState>>
}

export const ADMIN_ACTIONS = {  
    SET_USERS: 'SET_USERS',
    SET_CLUSTER_STATES: 'SET_CLUSTER_STATES',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    START_FETCH: 'START_FETCH',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',
}

const adminReducer = (
    state: AdminContextState,
    action: ReducerAction<AdminContextState>
): AdminContextState => {
    switch (action.type) {
        case ADMIN_ACTIONS.SET_USERS:
            return {
                ...state,
                users: action.payload,
            }
        case ADMIN_ACTIONS.SET_CLUSTER_STATES:
            return {
                ...state,
                clusterStates: action.payload,
            }
        case ADMIN_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            }
        case ADMIN_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
            }
        case ADMIN_ACTIONS.START_FETCH:
            return {
                ...state,
                isLoading: true,
            }
        case ADMIN_ACTIONS.FETCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                users: action.payload,
            }
        case ADMIN_ACTIONS.FETCH_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
        default:    
            return state
    }
}

const initialState: AdminContextState = {
    users: null,
    clusterStates: null,
    isLoading: false,
    error: null,
}

const { Provider, useContextHook } = createContextProvider<AdminContextState>(
    initialState,
    'Admin',
    adminReducer
)

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    return <Provider>{children}</Provider>
}

export const useAdmin = useContextHook


