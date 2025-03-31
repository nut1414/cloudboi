// useInstanceSetting.ts
import { useInstance, INSTANCE_ACTIONS } from "../../contexts/instanceContext"
import { InstanceService } from "../../client"
import { useCallback, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { InstanceStatus } from "../../constant/InstanceConstant"
import { useInstanceList } from "./useInstanceList"

export const useInstanceSetting = () => {
    const {
        userInstances,
        selectedInstance,
        isLoading,
        error,
        dispatch
    } = useInstance()
    const { refreshInstances } = useInstanceList()

    const navigate = useNavigate()
    const { userName, instanceName } = useParams<{ userName: string, instanceName: string }>()

    const getInstanceAndUpdate = useCallback(async () => {
        if (!instanceName) return
        try {
            dispatch?.({ type: INSTANCE_ACTIONS.START_FETCH })
            const response = await InstanceService.instanceGetInstance({
                path: { instance_name: instanceName }
            })

            const filteredInstances = userInstances?.filter(
                (instance) => instance.instance_name !== instanceName
            )

            dispatch?.({ type: INSTANCE_ACTIONS.FETCH_SUCCESS })
            dispatch?.({
                type: INSTANCE_ACTIONS.SET_USER_INSTANCES,
                payload: [
                    ...(filteredInstances || []),
                    response.data
                ]
            })
            dispatch?.({
                type: INSTANCE_ACTIONS.SET_SELECTED_INSTANCE,
                payload: response.data
            })
        } catch (err) {
            console.error("Failed to fetch instance details:", err)
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: "Failed to fetch instance details"
            })
            alert("Failed to fetch instance details")
        }
    }, [selectedInstance, userInstances, dispatch])

    useEffect(() => {
        if (!selectedInstance) {
            getInstanceAndUpdate()
        }
    }, [selectedInstance, getInstanceAndUpdate])

    const isInstanceRunning = useMemo(() => {
        return selectedInstance && selectedInstance.instance_status === InstanceStatus.RUNNING
    }, [selectedInstance])
    const isInstanceStopped = useMemo(() => {
        return selectedInstance && selectedInstance.instance_status === InstanceStatus.STOPPED
    }, [selectedInstance])
            
    // Start instance
    const startInstance = useCallback(async () => {
        if (!selectedInstance) return

        try {
            dispatch?.({ type: INSTANCE_ACTIONS.START_FETCH })
            await InstanceService.instanceStartInstance({
                path: { instance_name: selectedInstance.instance_name }
            })
            await getInstanceAndUpdate()
            alert(`Instance ${selectedInstance.instance_name} started successfully`)
        } catch (err) {
            console.error("Failed to start instance:", err)
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: "Failed to start the instance"
            })
            alert("Failed to start the instance")
        }
    }, [selectedInstance, dispatch, getInstanceAndUpdate])

    // Stop instance
    const stopInstance = useCallback(async () => {
        if (!selectedInstance) return

        try {
            dispatch?.({ type: INSTANCE_ACTIONS.START_FETCH })
            await InstanceService.instanceStopInstance({
                path: { instance_name: selectedInstance.instance_name }
            })
            await getInstanceAndUpdate()
            alert(`Instance ${selectedInstance.instance_name} stopped successfully`)
        } catch (err) {
            console.error("Failed to stop instance:", err)
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: "Failed to stop the instance"
            })
            alert("Failed to stop the instance")
        }
    }, [selectedInstance, dispatch, getInstanceAndUpdate])

    // Restart instance
    const restartInstance = useCallback(async () => {
        if (!selectedInstance) return

        try {
            dispatch?.({ type: INSTANCE_ACTIONS.START_FETCH })
            await InstanceService.instanceRestartInstance({
                path: { instance_name: selectedInstance.instance_name }
            })
            await getInstanceAndUpdate()
            alert(`Instance ${selectedInstance.instance_name} restarted successfully`)
        } catch (err) {
            console.error("Failed to restart instance:", err)
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: "Failed to restart the instance"
            })
            alert("Failed to restart the instance")
        }
    }, [selectedInstance, dispatch, getInstanceAndUpdate])

    // Delete instance
    const deleteInstance = useCallback(async () => {
        if (!selectedInstance) return

        try {
            dispatch?.({ type: INSTANCE_ACTIONS.START_FETCH })
            await InstanceService.instanceDeleteInstance({
                path: { instance_name: selectedInstance.instance_name }
            })
            alert(`Instance ${selectedInstance.instance_name} deleted successfully`)
            refreshInstances()
            navigate(`/user/${userName}/instance`)
        } catch (err) {
            console.error("Failed to delete instance:", err)
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: "Failed to delete the instance"
            })
            alert("Failed to delete the instance")
        }
    }, [selectedInstance, dispatch, getInstanceAndUpdate, navigate])

    // Format instance uptime with user's timezone
    const formatUptime = useCallback((lastUpdatedAt: Date) => {
        if (!lastUpdatedAt) return "N/A"

        // Check if instance is not running
        if (selectedInstance && selectedInstance.instance_status !== InstanceStatus.RUNNING) {
            return "0d 0h 0m"
        }

        // Convert UTC date to user's local timezone
        const lastUpdatedLocal = new Date(lastUpdatedAt)
        const now = new Date()
        const uptime = now.getTime() - lastUpdatedLocal.getTime()

        const days = Math.floor(uptime / (1000 * 60 * 60 * 24))
        const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60))

        return `${days}d ${hours}h ${minutes}m`
    }, [])

    // Format any date to user's local timezone
    const formatDateTime = useCallback((utcDate: Date | string) => {
        if (!utcDate) return "N/A"
        
        const date = new Date(utcDate)
        
        // Format options for displaying date in user's locale and timezone
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZoneName: 'short'
        }
        
        return date.toLocaleString(undefined, options)
    }, [])

    return {
        instance: selectedInstance,
        isLoading,
        isInstanceRunning,
        isInstanceStopped,
        error,
        getInstanceAndUpdate,
        startInstance,
        stopInstance,
        restartInstance,
        deleteInstance,
        formatUptime,
        formatDateTime
    }
}