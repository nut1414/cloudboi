// useInstanceSetting.ts
import { useInstance, INSTANCE_ACTIONS } from "../../contexts/instanceContext"
import { InstanceService } from "../../client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { InstanceStatus } from "../../constant/InstanceConstant"
import { useInstanceList } from "./useInstanceList"
import { formatDateTime, formatUptime } from "../../utils/dateTime"
import { parseInstanceState } from "../../utils/instanceState"

// 5 minutes
const STATUS_POLLING_INTERVAL = 300000

export const useInstanceSetting = () => {
    const {
        userInstances,
        selectedInstance,
        instanceState,
        isLoading,
        error,
        dispatch
    } = useInstance()
    const { refreshInstances } = useInstanceList()
    const navigate = useNavigate()
    const { userName, instanceName } = useParams<{ userName: string, instanceName: string }>()
    const [statePollingInterval, setStatePollingInterval] = useState<number | null>(null)

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
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: "Failed to fetch instance details"
            })
            alert("Failed to fetch instance details")
        }
    }, [selectedInstance, userInstances, dispatch])

    const getInstanceState = useCallback(async () => {
        if (!instanceName) return
        try {
            const response = await InstanceService.instanceGetInstanceState({
                path: { instance_name: instanceName }
            })
            dispatch?.({
                type: INSTANCE_ACTIONS.SET_INSTANCE_STATE,
                payload: response.data
            })
        } catch (err) {
            console.error("Failed to fetch instance state:", err)
        }
    }, [instanceName, dispatch])


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
  
  // Start polling instance state when instance is running
    useEffect(() => {
        if (isInstanceRunning && !statePollingInterval) {
            getInstanceState() // Initial fetch
            const interval = setInterval(getInstanceState, STATUS_POLLING_INTERVAL)
            setStatePollingInterval(interval)
        } else if (!isInstanceRunning && statePollingInterval) {
            clearInterval(statePollingInterval)
            setStatePollingInterval(null)
            dispatch?.({ type: INSTANCE_ACTIONS.SET_INSTANCE_STATE, payload: null })
        }

        return () => {
            if (statePollingInterval) {
                clearInterval(statePollingInterval)
            }
        }
    }, [isInstanceRunning, statePollingInterval, getInstanceState])
            
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
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: "Failed to delete the instance"
            })
            alert("Failed to delete the instance")
        }
    }, [selectedInstance, dispatch, getInstanceAndUpdate, navigate])

    // Format instance uptime with user's timezone
    const getFormattedUptime = useCallback((lastUpdatedAt: Date) => {
        if (!selectedInstance) return "N/A";
        return formatUptime(lastUpdatedAt, selectedInstance.instance_status === InstanceStatus.RUNNING);
    }, [selectedInstance]);

    // Format any date to user's local timezone
    const getFormattedDateTime = useCallback((utcDate: Date | string) => {
        return formatDateTime(utcDate);
    }, []);
  
  const parsedInstanceState = useMemo(() => {
    if (!instanceState) return null
    return parseInstanceState(instanceState)
  }, [instanceState])

    return {
        instance: selectedInstance,
        instanceState: parsedInstanceState,
        isLoading,
        isInstanceRunning,
        isInstanceStopped,
        error,
        getInstanceAndUpdate,
        getInstanceState,
        startInstance,
        stopInstance,
        restartInstance,
        deleteInstance,
        getFormattedUptime,
        getFormattedDateTime,
    }
}