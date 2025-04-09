import { useBilling } from "../../contexts/billingContext"
import { useEffect, useState, useCallback } from "react"
import { AdminService } from "../../client/services.gen"
import { BILLING_ACTIONS } from "../../contexts/billingContext"
import { AdminBillingStatsRequest, Transaction } from "../../client/types.gen"
import { CURRENCY } from "../../constant/CurrencyConstant"

export const useAdminBilling = () => {
    const {
        adminBillingStats,
        allTransactions,
        isLoading,
        error,
        dispatch
    } = useBilling()
    
    const [searchQuery, setSearchQuery] = useState("")
    const [isAllTime, setIsAllTime] = useState(true)
    const [dateRange, setDateRange] = useState<{
        startDate: Date | null,
        endDate: Date | null
    }>({ startDate: null, endDate: null })
    
    // Flag to control when to fetch data
    const [shouldFetch, setShouldFetch] = useState(true)
    
    // Filtered transactions based on search query
    const filteredTransactions = allTransactions 
        ? allTransactions.filter(transaction => 
            transaction.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.reference_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.transaction_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.transaction_status.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : []
    
    // Separate function to fetch transaction data only
    const fetchTransactions = useCallback(async () => {
        if (!dispatch) return
        
        try {
            const { data: transactionsData } = await AdminService.adminGetAllTransactions()
            
            dispatch({ 
                type: BILLING_ACTIONS.SET_ALL_TRANSACTIONS, 
                payload: transactionsData 
            })
            
            return transactionsData
        } catch (err) {
            console.error("Error fetching transactions:", err)
            return null
        }
    }, [dispatch])
    
    // Simplified function to fetch billing stats only
    const fetchBillingStatsOnly = useCallback(async () => {
        if (!dispatch) return null
        
        try {
            // Default to all-time stats
            const requestBody: any = {
                is_alltime: isAllTime
            }
            
            // Only add date range if not all-time and both dates are selected
            if (!isAllTime && dateRange.startDate && dateRange.endDate) {
                // Set time to midnight for start date and end of day for end date
                const startDateTime = new Date(dateRange.startDate)
                startDateTime.setHours(0, 0, 0, 0)
                
                const endDateTime = new Date(dateRange.endDate)
                endDateTime.setHours(23, 59, 59, 999)
                
                // Format dates as strings in the format expected by the backend
                const formatDate = (date: Date) => {
                    const year = date.getFullYear()
                    const month = String(date.getMonth() + 1).padStart(2, '0')
                    const day = String(date.getDate()).padStart(2, '0')
                    const hours = String(date.getHours()).padStart(2, '0')
                    const minutes = String(date.getMinutes()).padStart(2, '0')
                    const seconds = String(date.getSeconds()).padStart(2, '0')
                    
                    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
                }
                
                requestBody.start_date = formatDate(startDateTime)
                requestBody.end_date = formatDate(endDateTime)
                requestBody.is_alltime = false
            } else if (!isAllTime && (!dateRange.startDate || !dateRange.endDate)) {
                // If custom range is selected but dates are incomplete, default to all-time
                requestBody.is_alltime = true
            }
            
            // Make the API call
            const response = await AdminService.adminGetBillingStats({
                body: requestBody
            })
            
            return response.data
        } catch (err) {
            throw err
        }
    }, [dispatch, isAllTime, dateRange])
    
    // Main fetch function that coordinates both data fetches
    const fetchBillingStats = useCallback(async () => {
        if (!dispatch || isLoading) return
        
        // Turn off the fetch flag to prevent additional fetches
        setShouldFetch(false)
        
        dispatch({ type: BILLING_ACTIONS.START_FETCH })
        
        try {
            // First fetch transactions - this is more likely to succeed
            await fetchTransactions()
            
            // Then attempt to fetch billing stats
            try {
                const statsData = await fetchBillingStatsOnly()
                
                if (statsData) {
                    dispatch({ 
                        type: BILLING_ACTIONS.SET_ADMIN_BILLING_STATS, 
                        payload: statsData 
                    })
                }
            } catch (statsErr) {
                console.error("Error fetching billing stats:", statsErr)
                dispatch({ 
                    type: BILLING_ACTIONS.FETCH_ERROR, 
                    payload: statsErr instanceof Error ? statsErr.message : 'Error fetching billing statistics'
                })
            }
            
            dispatch({ type: BILLING_ACTIONS.FETCH_SUCCESS })
        } catch (err) {
            console.error("Error in fetch operation:", err)
            dispatch({ 
                type: BILLING_ACTIONS.FETCH_ERROR, 
                payload: err instanceof Error ? err.message : 'Unknown error occurred' 
            })
        }
    }, [dispatch, fetchTransactions, fetchBillingStatsOnly, isLoading])
    
    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }
    
    const toggleTimeRange = (allTime: boolean) => {
        setIsAllTime(allTime)
        // Reset date range if switching to all time
        if (allTime) {
            setDateRange({ startDate: null, endDate: null })
        }
        setShouldFetch(true)
    }
    
    const updateDateRange = (startDate: Date | null, endDate: Date | null) => {
        setDateRange({ startDate, endDate })
        if (startDate && endDate) {
            setIsAllTime(false)
            setShouldFetch(true)
        }
    }
    
    // Calculate total revenue statistics without converting to thousands
    const calculateRevenueStats = () => {
        if (!allTransactions) return { paid: 0, pending: 0, canceled: 0 }
        
        let paid = 0
        let pending = 0
        let canceled = 0
        
        allTransactions.forEach(transaction => {
            if (transaction.transaction_status === 'SUCCESS' || 
                transaction.transaction_status === 'PAID') {
                paid += transaction.amount
            } else if (transaction.transaction_status === 'PENDING' || 
                       transaction.transaction_status === 'SCHEDULED') {
                pending += transaction.amount
            } else if (transaction.transaction_status === 'FAILED' ||
                      transaction.transaction_status === 'EXPIRED' ||
                      transaction.transaction_status === 'OVERDUE') {
                canceled += transaction.amount
            }
        })
        
        return { paid, pending, canceled }
    }
    
    // Simplified single useEffect for data fetching
    useEffect(() => {
        // Only fetch if the flag is true and not already loading
        if (shouldFetch && !isLoading) {
            fetchBillingStats()
        }
    }, [shouldFetch, fetchBillingStats, isLoading])
    
    // Manual refresh function for user-triggered refreshes
    const refreshData = () => {
        setShouldFetch(true)
    }
    
    return {
        adminBillingStats,
        allTransactions: filteredTransactions,
        isLoading,
        error,
        searchQuery,
        isAllTime,
        dateRange,
        revenueStats: calculateRevenueStats(),
        handleSearch,
        toggleTimeRange,
        updateDateRange,
        fetchBillingStats: refreshData
    }
}