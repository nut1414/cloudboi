import { useState, useCallback } from 'react'
import { AdminService } from '../../client'
import { CURRENCY } from '../../constant/CurrencyConstant'
import { AdminUser } from '../../client/types.gen'
import useToast from '../../hooks/useToast'
import { getErrorMessage } from '../../utils/errorHandling'

export const useAdminCredit = () => {
    const toast = useToast()

    const [username, setUsername] = useState("")
    const [creditValue, setCreditValue] = useState<number | "">("")
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [users, setUsers] = useState<AdminUser[]>([])

    // Predefined amounts for quick selection
    const predefinedAmounts = [100, 200, 500, 1000, 2000, 5000, 10000]

    // Search users
    const searchUsers = useCallback(async (query: string) => {
        if (!query.trim()) {
            setUsers([])
            return
        }

        try {
            const response = await AdminService.adminGetAllUsers()
            if (response.data?.users) {
                const filteredUsers = response.data.users.filter(user =>
                    user.username.toLowerCase().includes(query.toLowerCase()) ||
                    user.email.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 5)
                setUsers(filteredUsers)
            }
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to search users"))
            setUsers([])
        }
    }, [])

    // Handle search input change
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query)
        searchUsers(query)
    }, [searchUsers])

    // Handle user selection
    const handleSelectUser = useCallback((user: AdminUser) => {
        setUsername(user.username)
        setUsers([]) // Clear search results
        setSearchQuery("") // Clear search query
    }, [])

    // Sanitize input to only allow numbers
    const sanitizeNumericInput = useCallback((value: string) => {
        return value.replace(/\D/g, "")
    }, [])

    // Handle input change for credit amount
    const handleInputChange = useCallback((value: string) => {
        const rawValue = sanitizeNumericInput(value)
        setCreditValue(rawValue === "" ? "" : Number(rawValue))
    }, [sanitizeNumericInput])

    // Process credit request
    const processCredit = useCallback(async () => {
        if (!username.trim()) {
            toast.error("Please enter a username")
            return false
        }

        if (!creditValue || Number(creditValue) <= 0) {
            toast.error("Please enter a valid amount")
            return false
        }

        setIsLoading(true)

        try {
            const response = await AdminService.adminTopup({
                body: {
                    username: username.trim(),
                    amount: Number(creditValue)
                }
            })

            if (response.data) {
                toast.success(`Successfully added ${creditValue} ${CURRENCY.SYMBOL} to ${username}'s wallet`)
                setCreditValue("")
                return true
            }
            return false
        } catch (error) {
            const errorMessage = getErrorMessage(error, "Failed to add credit. Please check the username and try again.")
            toast.error(errorMessage)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [username, creditValue])

    return {
        username,
        creditValue,
        isLoading,
        predefinedAmounts,
        searchQuery,
        users,
        handleInputChange,
        processCredit,
        handleSearch,
        handleSelectUser
    }
} 