import { useEffect, useState, useMemo, useCallback } from 'react'
import { useAdmin, ADMIN_ACTIONS } from '../../contexts/adminContext'
import { AdminService } from '../../client'
import { AdminUser, UserInstanceFromDB } from '../../client/types.gen'
import { useNavigate } from 'react-router-dom'
import { InstanceStatus } from '../../constant/InstanceConstant'

/**
 * Hook for managing users in the admin section
 * Uses AdminContext to store and manage user data
 */
export const useUserManage = () => {
  const {
    users,
    isLoading,
    error,
    dispatch
  } = useAdmin()
  const navigate = useNavigate()
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers()
  }, [dispatch])

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    if (!dispatch) return

    try {
      dispatch({ type: ADMIN_ACTIONS.START_FETCH })

      const response = await AdminService.adminGetAllUsers()
      const data = response.data

      if (!data) {
        throw new Error("No data received")
      }

      dispatch({
        type: ADMIN_ACTIONS.FETCH_SUCCESS,
        payload: data.users
      })
    } catch (err) {
      console.error("Failed to fetch users:", err)
      dispatch({
        type: ADMIN_ACTIONS.FETCH_ERROR,
        payload: "Failed to load user data. Please try again later."
      })
    }
  }, [dispatch])

  // Handle search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return Array.isArray(users) ? users : []

    const query = searchQuery.toLowerCase()
    return (Array.isArray(users) ? users : []).filter((user: AdminUser) =>
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.role_name.toLowerCase().includes(query)
    )
  }, [users, searchQuery])

  // Handle row expansion
  const handleRowExpand = useCallback((user: AdminUser, isExpanded: boolean) => {
    setExpandedRows(prev => ({
      ...prev,
      [user.user_id]: isExpanded
    }))
  }, [])

  // Check if a row is expanded
  const isRowExpanded = useCallback((user: AdminUser) => {
    return expandedRows[user.user_id] || false
  }, [expandedRows])

  // Navigate to user's instance list page
  const navigateToUserInstances = useCallback((user: AdminUser) => {
    navigate(`/user/${user.username}/instance`)
  }, [navigate])

  // Navigate to specific instance detail page
  const navigateToInstanceDetail = useCallback((username: string, instance: UserInstanceFromDB) => {
    navigate(`/user/${username}/instance/${instance.hostname}`)
  }, [navigate])

  // Handle view instances button click
  const handleViewUserInstances = useCallback((user: AdminUser) => {
    if (expandedRows[user.user_id]) {
      handleRowExpand(user, false)
    } else {
      navigateToUserInstances(user)
    }
  }, [expandedRows, handleRowExpand, navigateToUserInstances])

  // Group and sort instances by status
  const getSortedInstances = useCallback((instances: UserInstanceFromDB[]) => {
    // Group instances by status
    const instancesByStatus = instances.reduce((acc, instance) => {
      const status = instance.status.toLowerCase()
      if (!acc[status]) {
        acc[status] = []
      }
      acc[status].push(instance)
      return acc
    }, {} as Record<string, UserInstanceFromDB[]>)

    // Define status order with values from InstanceStatus constant
    const statusOrder = [
      InstanceStatus.RUNNING.toLowerCase(),
      InstanceStatus.FROZEN.toLowerCase(),
      InstanceStatus.STOPPED.toLowerCase(),
      InstanceStatus.ERROR.toLowerCase()
    ]

    // Sort instances by status
    return Object.entries(instancesByStatus)
      .sort(([statusA], [statusB]) => {
        const indexA = statusOrder.indexOf(statusA) !== -1 ? statusOrder.indexOf(statusA) : 999
        const indexB = statusOrder.indexOf(statusB) !== -1 ? statusOrder.indexOf(statusB) : 999
        return indexA - indexB
      })
      .flatMap(([_, instances]) => instances)
  }, [])

  // Count instances by status - memoized for performance
  const getInstanceStatusCounts = useCallback((instances: UserInstanceFromDB[]) => {
    // Use a single pass through the array instead of multiple filter operations
    const counts = {
      running: 0,
      stopped: 0,
      frozen: 0,
      error: 0
    }

    const runningStatus = InstanceStatus.RUNNING.toLowerCase()
    const stoppedStatus = InstanceStatus.STOPPED.toLowerCase()
    const frozenStatus = InstanceStatus.FROZEN.toLowerCase()
    const errorStatus = InstanceStatus.ERROR.toLowerCase()

    for (let i = 0; i < instances.length; i++) {
      const status = instances[i].status.toLowerCase()
      if (status === runningStatus) counts.running++
      else if (status === stoppedStatus) counts.stopped++
      else if (status === frozenStatus) counts.frozen++
      else if (status === errorStatus) counts.error++
    }

    return counts
  }, [])

  return {
    users: Array.isArray(filteredUsers) ? filteredUsers : [],
    isLoading: isLoading || false,
    error: error || null,
    expandedRows,
    searchQuery,
    handleSearch,
    handleRowExpand,
    isRowExpanded,
    handleViewUserInstances,
    navigateToInstanceDetail,
    getSortedInstances,
    getInstanceStatusCounts
  }
}
