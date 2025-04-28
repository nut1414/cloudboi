// src/hooks/useInstanceList.ts
import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useInstance, INSTANCE_ACTIONS } from "../../contexts/instanceContext"
import { InstanceService, UserInstanceResponse } from "../../client"

export const useInstanceList = () => {
    const {
        userInstances,
        selectedInstance,
        isLoading,
        error,
        dispatch
    } = useInstance()
    const { userName } = useParams<{ userName: string }>()
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()
    const prevUserNameRef = useRef<string | undefined>(undefined)

    // Fetch instances data
    const fetchInstances = useCallback(async () => {
        if (!userName) return
        
        try {
            dispatch?.({ type: INSTANCE_ACTIONS.START_FETCH })
            const response = await InstanceService.instanceListInstances({
                path: { username: userName }
            })
            dispatch?.({ type: INSTANCE_ACTIONS.FETCH_SUCCESS })
            dispatch?.({ type: INSTANCE_ACTIONS.SET_USER_INSTANCES, payload: response.data })
        } catch (err) {
            dispatch?.({ 
                type: INSTANCE_ACTIONS.FETCH_ERROR, 
                payload: "Failed to load instances. Please try again later." 
            })
        }
    }, [dispatch, userName])

    // Initial data load
    useEffect(() => {
        if (!userInstances || (userName && prevUserNameRef.current !== userName)) {
            fetchInstances()
            prevUserNameRef.current = userName
        }
    }, [userInstances, fetchInstances, userName])

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
    }, [navigate, userName])

    // Handle view instance
    const handleViewInstance = useCallback((instance: UserInstanceResponse) => {
        dispatch?.({ 
            type: INSTANCE_ACTIONS.SET_SELECTED_INSTANCE, 
            payload: instance 
        })
        navigate(`/user/${userName}/instance/${instance.instance_name}`)
    }, [navigate, dispatch, userName])

    // Handle instance actions (like start, stop, restart, delete)
    const handleInstanceAction = useCallback(async (action: string, instance: UserInstanceResponse) => {
        if (!instance) return
        
        try {
            dispatch?.({ type: INSTANCE_ACTIONS.START_FETCH })
            
            switch (action) {
                case "start":
                    await InstanceService.instanceStartInstance({
                        path: { instance_name: instance.instance_name }
                    })
                    alert(`Instance ${instance.instance_name} started successfully`)
                    break
                case "stop":
                    await InstanceService.instanceStopInstance({
                        path: { instance_name: instance.instance_name }
                    })
                    alert(`Instance ${instance.instance_name} stopped successfully`)
                    break
                case "restart":
                    await InstanceService.instanceRestartInstance({
                        path: { instance_name: instance.instance_name }
                    })
                    alert(`Instance ${instance.instance_name} restarted successfully`)
                    break
                case "delete":
                    if (window.confirm(`Are you sure you want to delete instance ${instance.instance_name}?`)) {
                        await InstanceService.instanceDeleteInstance({
                            path: { instance_name: instance.instance_name }
                        })
                        alert(`Instance ${instance.instance_name} deleted successfully`)
                    } else {
                        dispatch?.({ type: INSTANCE_ACTIONS.FETCH_SUCCESS })
                        return
                    }
                    break
                default:
                    dispatch?.({ type: INSTANCE_ACTIONS.FETCH_SUCCESS })
                    return
            }
            
            // Refresh the instances list after action completes
            fetchInstances()
            
        } catch (err) {
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: `Failed to ${action} instance: ${instance.instance_name}`
            })
        }
    }, [dispatch, fetchInstances])

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