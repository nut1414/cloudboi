// src/contexts/billingContext.tsx
import { ReactNode, useEffect } from "react"
import {
    BillingService,
    UserWalletResponse,
    UserTransactionResponse,
    UserBillingOverviewResponse,
} from "../client"
import { createContextProvider, BaseContextState, ReducerAction } from './baseContext'
import { useUser } from './userContext'

// Define the specific state for billing context
interface BillingContextState extends BaseContextState {
    userWallet: UserWalletResponse | null
    userTransactions: UserTransactionResponse[] | null
    userBillingOverview: UserBillingOverviewResponse | null
    isLoading: boolean
    error: string | null
    dispatch?: React.Dispatch<ReducerAction<BillingContextState>>
}

// Define action types
export const BILLING_ACTIONS = {
    SET_USER_WALLET: 'SET_USER_WALLET',
    SET_USER_TRANSACTIONS: 'SET_USER_TRANSACTIONS',
    SET_USER_BILLING_OVERVIEW: 'SET_USER_BILLING_OVERVIEW',
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
                userWallet: action.payload,
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
    userWallet: null,
    userTransactions: null,
    userBillingOverview: null,
    isLoading: false, // Changed from true to false as we'll only start loading when authenticated
    error: null,
}

// Create the context and hook using factory
const { Provider, useContextHook } = createContextProvider<BillingContextState>(
    initialState,
    'Billing',
    billingReducer
)

export const BillingProvider = ({ children }: { children: ReactNode }) => {
    return (
        <Provider>
            <BillingInitializer>{children}</BillingInitializer>
        </Provider>
    )
}

// Separate component to handle wallet data initialization
const BillingInitializer = ({ children }: { children: ReactNode }) => {
    const billingContext = useContextHook()
    const { dispatch } = billingContext
    const { isAuthenticated, isLoading: isUserLoading } = useUser()

    useEffect(() => {
        // Only fetch wallet data when user is authenticated and not in loading state
        if (!dispatch || !isAuthenticated || isUserLoading) return

        const fetchWalletData = async () => {
            try {
                dispatch({ type: BILLING_ACTIONS.START_FETCH })

                // Fetch wallet data
                const walletResponse = await BillingService.billingGetUserWallet()

                // Update state with fetched data
                dispatch({
                    type: BILLING_ACTIONS.SET_USER_WALLET,
                    payload: walletResponse.data ?? null
                })

                dispatch({ type: BILLING_ACTIONS.FETCH_SUCCESS })
            } catch (error) {
                dispatch({
                    type: BILLING_ACTIONS.FETCH_ERROR,
                    payload: 'Failed to fetch wallet data'
                })
                alert('Error fetching wallet data')
            }
        }

        fetchWalletData()
    }, [dispatch, isAuthenticated, isUserLoading])

    return <>{children}</>
}

export const useBilling = useContextHook