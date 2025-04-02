import { useBilling, BILLING_ACTIONS } from "../../contexts/billingContext"
import { BillingService, UserTopUpRequest } from "../../client"
import { useState, useCallback, useMemo } from "react"

export const useUserBilling = () => {
    const {
        userWallet,
        userTransactions,
        userBillingOverview,
        isLoading,
        error,
        dispatch
    } = useBilling()

    // Format transaction type string for display
    const formatTransactionType = useCallback((type: string) => {
        switch (type) {
            case "TOP_UP":
                return "Top Up"
            case "SUBSCRIPTION_PAYMENT":
                return "Usage / Subscription"
            default:
                return type
        }
    }, [])

    // Fetch transaction history
    const fetchTransactions = useCallback(async () => {
        if (!dispatch) return

        try {
            dispatch({ type: BILLING_ACTIONS.START_FETCH })

            const response = await BillingService.billingGetAllUserTransactions()

            dispatch({
                type: BILLING_ACTIONS.SET_USER_TRANSACTIONS,
                payload: response.data ?? null
            })

            dispatch({ type: BILLING_ACTIONS.FETCH_SUCCESS })
        } catch (err) {
            dispatch({
                type: BILLING_ACTIONS.FETCH_ERROR,
                payload: 'Failed to fetch transaction history'
            })
            alert('Error fetching transactions')
        }
    }, [dispatch])

    // Basic top up wallet function (used internally)
    const topUpWallet = useCallback(async (amount: number) => {
        if (!dispatch) return

        try {
            dispatch({ type: BILLING_ACTIONS.START_FETCH })

            const topUpData: UserTopUpRequest = { amount }
            const response = await BillingService.billingTopUp({
                body: topUpData
            })

            // Refresh wallet data after successful top-up
            if (response.data) {
                const walletResponse = await BillingService.billingGetUserWallet()
                dispatch({
                    type: BILLING_ACTIONS.SET_USER_WALLET,
                    payload: walletResponse.data ?? null
                })

                // Also refresh transactions to show the new top-up
                await fetchTransactions()
            }

            dispatch({ type: BILLING_ACTIONS.FETCH_SUCCESS })
            return response.data
        } catch (err) {
            dispatch({
                type: BILLING_ACTIONS.FETCH_ERROR,
                payload: 'Failed to process top-up request'
            })
            alert('Error topping up wallet')
            throw err
        }
    }, [dispatch, fetchTransactions])

    // Handler for component top up with success messaging
    const handleTopUp = useCallback(async (amount: number | string) => {
        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount")
            return false
        }

        try {
            const numericAmount = Number(amount)
            await topUpWallet(numericAmount)
            alert(`Successfully added ${numericAmount} CBC to your wallet`)
            return true
        } catch (err) {
            alert("Failed to add credit. Please try again.")
            return false
        }
    }, [topUpWallet])

    // Fetch billing overview data
    const fetchBillingOverview = useCallback(async () => {
        if (!dispatch) return

        try {
            dispatch({ type: BILLING_ACTIONS.START_FETCH })

            const response = await BillingService.billingGetBillingOverview()

            dispatch({
                type: BILLING_ACTIONS.SET_USER_BILLING_OVERVIEW,
                payload: response.data ?? null
            })

            dispatch({ type: BILLING_ACTIONS.FETCH_SUCCESS })
        } catch (err) {
            dispatch({
                type: BILLING_ACTIONS.FETCH_ERROR,
                payload: 'Failed to fetch billing overview'
            })
            alert('Error fetching billing overview')
            throw err
        }
    }, [dispatch])

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

        // Utility functions
        formatTransactionType,
        navigateToTopUp,
        sanitizeNumericInput
    }
}