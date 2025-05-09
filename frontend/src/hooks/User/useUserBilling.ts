import { useBilling, BILLING_ACTIONS } from "../../contexts/billingContext"
import { BillingService, UserTopUpRequest, UserWalletResponse } from "../../client"
import { useState, useCallback, useEffect } from "react"
import { TransactionStatus, TransactionType } from "../../constant/TransactionConstant"
import { useParams } from "react-router-dom"
import { useUser } from "../../contexts/userContext"
import { CURRENCY } from '../../constant/CurrencyConstant'
import useToast from "../useToast"
import { getErrorMessage } from "../../utils/errorHandling"

export const useUserBilling = () => {
    const {
        userWallet,
        userTransactions,
        userBillingOverview,
        isLoading,
        error,
        dispatch
    } = useBilling()

    const { userName } = useParams<{ userName: string }>()
    const { isAuthenticated } = useUser()
    const toast = useToast()
    
    // Function to fetch user wallet
    const fetchUserWallet = useCallback(async (username: string): Promise<UserWalletResponse | null> => {
        if (!dispatch || !username) return null

        try {
            dispatch({ type: BILLING_ACTIONS.START_FETCH })

            const walletResponse = await BillingService.billingGetUserWallet({
                path: { username }
            })

            const walletData = walletResponse.data ?? null
            
            dispatch({
                type: BILLING_ACTIONS.SET_USER_WALLET,
                payload: walletData
            })

            dispatch({ type: BILLING_ACTIONS.FETCH_SUCCESS })
            return walletData
        } catch (error) {
            dispatch({
                type: BILLING_ACTIONS.FETCH_ERROR,
                payload: getErrorMessage(error, 'Failed to fetch wallet data')
            })
            return null
        }
    }, [dispatch])

    // Format transaction type string for display
    const formatTransactionType = useCallback((type: string) => {
        switch (type) {
            case TransactionType.TOP_UP:
                return "Top Up"
            case TransactionType.SUBSCRIPTION_PAYMENT:
                return "Usage / Subscription"
            default:
                return type
        }
    }, [])

    // Fetch transaction history
    const fetchTransactions = useCallback(async () => {
        if (!dispatch || !userName) return

        try {
            dispatch({ type: BILLING_ACTIONS.START_FETCH })

            const response = await BillingService.billingGetAllUserTransactions({
                path: { username: userName }
            })

            const filteredResponse = response.data?.filter((transaction) => transaction.transaction_status !== TransactionStatus.SCHEDULED)

            dispatch({
                type: BILLING_ACTIONS.SET_USER_TRANSACTIONS,
                payload: filteredResponse ?? null
            })

            dispatch({ type: BILLING_ACTIONS.FETCH_SUCCESS })
        } catch (error) {
            dispatch({
                type: BILLING_ACTIONS.FETCH_ERROR,
                payload: getErrorMessage(error, 'Failed to fetch transaction history')
            })
        }
    }, [dispatch, userName])

    // Basic top up wallet function (used internally)
    const topUpWallet = useCallback(async (amount: number) => {
        if (!dispatch || !userName) return

        try {
            dispatch({ type: BILLING_ACTIONS.START_FETCH })

            const topUpData: UserTopUpRequest = { amount }
            const response = await BillingService.billingTopUp({
                body: topUpData,
                path: { username: userName }
            })

            // Refresh wallet data after successful top-up
            if (response.data) {
                await fetchUserWallet(userName)

                // Also refresh transactions to show the new top-up
                await fetchTransactions()
            }

            dispatch({ type: BILLING_ACTIONS.FETCH_SUCCESS })
            return response.data
        } catch (error) {
            throw error
        }
    }, [dispatch, fetchTransactions, userName, fetchUserWallet])

    // Handler for component top up with success messaging
    const handleTopUp = useCallback(async (amount: number | string) => {
        if (!amount || Number(amount) <= 0) {
            dispatch?.({
                type: BILLING_ACTIONS.SET_ERROR,
                payload: "Please enter a valid amount"
            })
            return false
        }

        try {
            const numericAmount = Number(amount)
            await topUpWallet(numericAmount)
            toast.success(`Successfully added ${numericAmount} ${CURRENCY.SYMBOL} to your wallet`)
            return true
        } catch (error) {
            dispatch?.({
                type: BILLING_ACTIONS.SET_ERROR,
                payload: getErrorMessage(error, "Failed to add credit. Please try again.")
            })
            return false
        }
    }, [topUpWallet, dispatch])

    // Fetch billing overview data
    const fetchBillingOverview = useCallback(async () => {
        if (!dispatch || !userName) return

        try {
            dispatch({ type: BILLING_ACTIONS.START_FETCH })

            const response = await BillingService.billingGetBillingOverview({
                path: { username: userName }
            })

            dispatch({
                type: BILLING_ACTIONS.SET_USER_BILLING_OVERVIEW,
                payload: response.data ?? null
            })

            dispatch({ type: BILLING_ACTIONS.FETCH_SUCCESS })
        } catch (error) {
            const errorMessage = getErrorMessage(error, 'Failed to fetch billing overview')
            dispatch({
                type: BILLING_ACTIONS.FETCH_ERROR,
                payload: errorMessage
            })
            throw error
        }
    }, [dispatch, userName])

    // Utility for navigating to TopUp tab
    const navigateToTopUp = useCallback(() => {
        const tabElement = document.querySelector("[data-tab-id='TopUpMenu']")
        if (tabElement) {
            const tab = tabElement as HTMLButtonElement
            tab.click()
        }
    }, [])

    // Sanitize input to only allow numbers
    const sanitizeNumericInput = useCallback((value: string) => {
        return value.replace(/\D/g, "")
    }, [])

    // Fetch wallet data when the username changes
    useEffect(() => {
        if (userName && isAuthenticated && (!userWallet || userWallet?.username !== userName)) {
            fetchUserWallet(userName)
            fetchTransactions()
            fetchBillingOverview()
        }
    }, [userName, fetchUserWallet, isAuthenticated, fetchTransactions, fetchBillingOverview])

    return {
        // State from context
        userWallet,
        userTransactions,
        userBillingOverview,
        isLoading,
        error,

        // API functions
        fetchTransactions,
        topUpWallet,
        handleTopUp,
        fetchBillingOverview,
        fetchUserWallet,

        // Utility functions
        formatTransactionType,
        navigateToTopUp,
        sanitizeNumericInput
    }
}