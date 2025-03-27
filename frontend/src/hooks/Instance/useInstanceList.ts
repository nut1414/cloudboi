import { useEffect, useState, useCallback, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useInstance } from "../../contexts/instanceContext"
import { InstanceService, UserInstanceResponse } from "../../client"

export const useInstanceList = () => {
    const {
        userInstances,
        setUserInstances,
        selectedInstance,
        setSelectedInstance,
        isLoading,
        setIsLoading,
        error,
        setError
    } = useInstance()
    const { userName } = useParams<{ userName: string }>()
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    // Fetch instances data
    const fetchInstances = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await InstanceService.instanceListInstances()
            setUserInstances(response.data || [])
        } catch (err) {
            setError("Failed to load instances. Please try again later.")
            console.error("Error fetching instances:", err)
        } finally {
            setIsLoading(false)
        }
    }, [setIsLoading, setError, setUserInstances])

    // Initial data load
    useEffect(() => {
        if (!userInstances) {
            fetchInstances()
        }
    }, [userInstances, fetchInstances])

    // Filter instances based on search query
    const filteredInstances = useMemo(() => {
        if (!userInstances || !searchQuery.trim()) {
            return userInstances || []
        }

        const lowercaseQuery = searchQuery.toLowerCase()
        return userInstances.filter(instance =>
            (instance.instance_name && instance.instance_name.toLowerCase().includes(lowercaseQuery)) ||
            (instance.os_type?.os_image_name && instance.os_type.os_image_name.toLowerCase().includes(lowercaseQuery)) ||
            (instance.instance_plan?.instance_package_name && instance.instance_plan.instance_package_name.toLowerCase().includes(lowercaseQuery)) ||
            (instance.instance_status && instance.instance_status.toLowerCase().includes(lowercaseQuery))
        )
    }, [searchQuery, userInstances])

    // Handle search
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query)
    }, [])

    // Handle create instance
    const handleCreateInstance = useCallback(() => {
        navigate(`/user/${userName}/instance/create`)
    }, [navigate])

    // Handle view instance
    const handleViewInstance = useCallback((instance: UserInstanceResponse) => {
        setSelectedInstance(instance)
        navigate(`/user/${userName}/instance/${instance.instance_name}`)
    }, [navigate, setSelectedInstance])

    // Handle instance actions (like start, stop, restart, delete)
    const handleInstanceAction = useCallback((action: string, instance: UserInstanceResponse) => {
        switch (action) {
            case "start":
                // Start instance logic here
                console.log("Starting instance:", instance.instance_id)
                break
            case "stop":
                // Stop instance logic here
                console.log("Stopping instance:", instance.instance_id)
                break
            case "restart":
                // Restart instance logic here
                console.log("Restarting instance:", instance.instance_id)
                break
            case "delete":
                // Delete instance logic here
                console.log("Deleting instance:", instance.instance_id)
                break
            default:
                console.log(`Performing action ${action} on instance:`, instance.instance_id)
        }
    }, [])

    // Force refresh instances
    const refreshInstances = useCallback(() => {
        fetchInstances()
    }, [fetchInstances])

    return {
        instances: userInstances,
        filteredInstances,
        selectedInstance,
        isLoading,
        error,
        handleSearch,
        searchQuery,
        handleCreateInstance,
        handleViewInstance,
        handleInstanceAction,
        refreshInstances
    }
}
