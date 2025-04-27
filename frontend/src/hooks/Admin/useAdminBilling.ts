import { useBilling } from "../../contexts/billingContext"
import { useEffect, useState, useCallback, useMemo } from "react"
import { AdminService } from "../../client/services.gen"
import { BILLING_ACTIONS } from "../../contexts/billingContext"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { formatStandardDate, convertToUTC } from "../../utils/dateTime"
import useToast from "../useToast"

// Define form type for date range
type DateRangeFormType = {
    isAllTime: boolean;
    startDate: Date | null;
    endDate: Date | null;
}

export const useAdminBilling = () => {
    const {
        adminBillingStats,
        allTransactions,
        isLoading,
        error,
        dispatch
    } = useBilling()
    
    const [searchQuery, setSearchQuery] = useState("")
    const toast = useToast()
    
    // Initialize form using react-hook-form
    const { 
        watch, 
        setValue,
        formState: { errors } 
    } = useForm<DateRangeFormType>({
        defaultValues: {
            isAllTime: true,
            startDate: null,
            endDate: null
        },
        mode: "onChange"
    })
    
    // Watch form values
    const isAllTime = watch("isAllTime")
    const dateRange = {
        startDate: watch("startDate"),
        endDate: watch("endDate")
    }
    
    const navigate = useNavigate()
    
    // Memoized filtered transactions based on search query
    const filteredTransactions = useMemo(() => 
        allTransactions 
            ? allTransactions.filter(transaction => 
                transaction.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.instance_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.transaction_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.transaction_status.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : []
    , [allTransactions, searchQuery])
    
    // Separate function to fetch transaction data only
    const fetchTransactions = useCallback(async () => {
        if (!dispatch) return
        
        try {
            dispatch({ type: BILLING_ACTIONS.START_FETCH })

            const { data: transactionsData } = await AdminService.adminGetAllTransactions()
            
            dispatch({ 
                type: BILLING_ACTIONS.SET_ALL_TRANSACTIONS, 
                payload: transactionsData 
            })
            dispatch({ type: BILLING_ACTIONS.FETCH_SUCCESS})
            toast.success("Transactions fetched successfully")
            
            return transactionsData
        } catch (err) {
            dispatch({ type: BILLING_ACTIONS.FETCH_ERROR, payload: err })
            return null
        }
    }, [dispatch])
    
    // Simplified function to fetch billing stats
    const fetchBillingStats = useCallback(async () => {
        if (!dispatch) return
        
        try {
            dispatch({ type: BILLING_ACTIONS.START_FETCH })

            let startDateStr = ""
            let endDateStr = ""
            
            // If custom date range selected, prepare the date strings
            if (!isAllTime && dateRange.startDate && dateRange.endDate) {
                // Set time to midnight for start date and convert to UTC
                const startDateTime = new Date(dateRange.startDate)
                startDateTime.setHours(0, 0, 0, 0)
                
                // Set time to end of day for end date and convert to UTC
                const endDateTime = new Date(dateRange.endDate)
                endDateTime.setHours(23, 59, 59, 999)
                
                // Convert to proper UTC time strings
                const startUTC = convertToUTC(startDateTime)
                const endUTC = convertToUTC(endDateTime)
                
                startDateStr = formatStandardDate(startUTC)
                endDateStr = formatStandardDate(endUTC)
            } else {
                // Default empty date strings
                startDateStr = ""
                endDateStr = ""
            }
            
            // Make the API call with query parameters that match AdminGetBillingStatsData
            const response = await AdminService.adminGetBillingStats({
                query: {
                    is_alltime: isAllTime || (!dateRange.startDate || !dateRange.endDate),
                    start_date: startDateStr,
                    end_date: endDateStr
                }
            })

            dispatch({ type: BILLING_ACTIONS.SET_ADMIN_BILLING_STATS, payload: response.data })
            dispatch({ type: BILLING_ACTIONS.FETCH_SUCCESS })
            toast.success("Billing stats fetched successfully")

            return response.data
        } catch (err) {
            dispatch({ type: BILLING_ACTIONS.FETCH_ERROR, payload: err })
            return null
        }
    }, [dispatch, isAllTime, dateRange.startDate, dateRange.endDate])
    
    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }
    
    const toggleTimeRange = (allTime: boolean) => {
        setValue("isAllTime", allTime)
        // Reset date range if switching to all time
        if (allTime) {
            setValue("startDate", null)
            setValue("endDate", null)
        }
    }
    
    const updateDateRange = (startDate: Date | null, endDate: Date | null) => {
        setValue("startDate", startDate)
        setValue("endDate", endDate)
        if (startDate && endDate) {
            setValue("isAllTime", false)
        }
    }

    const handleViewInstance = (username: string, instance_name: string) => {
        navigate(`/user/${username}/instance/${instance_name}`)
    }
    
    useEffect(() => {
        if (!allTransactions) {
            fetchTransactions()
        }
        if (!adminBillingStats) {
            fetchBillingStats()
        }
    }, [fetchTransactions, fetchBillingStats, allTransactions, adminBillingStats])
    
    return {
        adminBillingStats,
        allTransactions: filteredTransactions,
        isLoading,
        error,
        searchQuery,
        isAllTime,
        dateRange,
        formErrors: errors,
        handleSearch,
        toggleTimeRange,
        updateDateRange,
        fetchBillingStats,
        handleViewInstance
    }
}