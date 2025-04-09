// src/contexts/billingContext.tsx
import { ReactNode } from "react"
import {
    UserWalletResponse,
    UserTransactionResponse,
    UserBillingOverviewResponse,
    AdminBillingStatsResponse,
    AdminTransactionResponse,
} from "../client"
import { createContextProvider, BaseContextState, ReducerAction } from './baseContext'

// Define the specific state for billing context
interface BillingContextState extends BaseContextState {
    userWallets: Record<string, UserWalletResponse | null>
    userTransactions: UserTransactionResponse[] | null
    userBillingOverview: UserBillingOverviewResponse | null
    adminBillingStats: AdminBillingStatsResponse | null
    allTransactions: AdminTransactionResponse[] | null
    isLoading: boolean
    error: string | null
    dispatch?: React.Dispatch<ReducerAction<BillingContextState>>
}

// Define action types
export const BILLING_ACTIONS = {
    SET_USER_WALLET: 'SET_USER_WALLET',
    SET_USER_TRANSACTIONS: 'SET_USER_TRANSACTIONS',
    SET_USER_BILLING_OVERVIEW: 'SET_USER_BILLING_OVERVIEW',
    SET_ADMIN_BILLING_STATS: 'SET_ADMIN_BILLING_STATS',
    SET_ALL_TRANSACTIONS: 'SET_ALL_TRANSACTIONS',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    START_FETCH: 'START_FETCH',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',
}

// Define the reducer
const billingReducer = (
    state: BillingContextState,
    action: ReducerAction<BillingContextState>
): BillingContextState => {
    switch (action.type) {
        case BILLING_ACTIONS.SET_USER_WALLET:
            return {
                ...state,
                userWallets: {
                    ...state.userWallets,
                    [action.payload?.username || '']: action.payload,
                },
            }
        case BILLING_ACTIONS.SET_USER_TRANSACTIONS:
            return {
                ...state,
                userTransactions: action.payload,
            }
        case BILLING_ACTIONS.SET_USER_BILLING_OVERVIEW:
            return {
                ...state,
                userBillingOverview: action.payload,
            }
        case BILLING_ACTIONS.SET_ADMIN_BILLING_STATS:
            return {
                ...state,
                adminBillingStats: action.payload,
            }
        case BILLING_ACTIONS.SET_ALL_TRANSACTIONS:
            return {
                ...state,
                allTransactions: action.payload,
            }
        case BILLING_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            }
        case BILLING_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
            }
        case BILLING_ACTIONS.START_FETCH:
            return {
                ...state,
                isLoading: true,
                error: null,
            }
        case BILLING_ACTIONS.FETCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
            }
        case BILLING_ACTIONS.FETCH_ERROR:
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
const initialState: BillingContextState = {
    userWallets: {},
    userTransactions: null,
    userBillingOverview: null,
    adminBillingStats: null,
    allTransactions: null,
    isLoading: false,
    error: null,
}

// Create the context and hook using factory
const { Provider, useContextHook } = createContextProvider<BillingContextState>(
    initialState,
    'Billing',
    billingReducer
)

export const BillingProvider = ({ children }: { children: ReactNode }) => {
    return <Provider>{children}</Provider>
}

export const useBilling = useContextHook