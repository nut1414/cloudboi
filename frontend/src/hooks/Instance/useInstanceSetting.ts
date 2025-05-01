// useInstanceSetting.ts
import { useInstance, INSTANCE_ACTIONS } from "../../contexts/instanceContext"
import { InstanceService } from "../../client"
import { useCallback, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { InstanceStatus } from "../../constant/InstanceConstant"
import { useInstanceList } from "./useInstanceList"
import { formatUptime } from "../../utils/dateTime"
import { parseInstanceState } from "../../utils/systemState"
import useToast from "../useToast"
import { getErrorMessage } from "../../utils/errorHandling"

// 30 seconds
const STATUS_POLLING_INTERVAL = 30000

export const useInstanceSetting = () => {
    const {
        userInstances,
        selectedInstance,
        instanceState,
        statePollingInterval,
        isLoading,
        error,
        dispatch
    } = useInstance()
    const { refreshInstances } = useInstanceList()
    const navigate = useNavigate()
    const { userName, instanceName } = useParams<{ userName: string, instanceName: string }>()
    const toast = useToast()

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
        } catch (error) {
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: getErrorMessage(error, "Failed to fetch instance details")
            })
        }
    }, [selectedInstance, userInstances, dispatch, instanceName])

    const getInstanceStateAndUpdate = useCallback(async () => {
        if (!instanceName) return
        try {
            const response = await InstanceService.instanceGetInstanceState({
                path: { instance_name: instanceName }
            })
            dispatch?.({
                type: INSTANCE_ACTIONS.SET_INSTANCE_STATE,
                payload: response.data
            })
        } catch (error) {
          if (selectedInstance?.instance_status === InstanceStatus.RUNNING) {
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: getErrorMessage(error, "Failed to fetch instance state")
            })
          }
        }
    }, [instanceName, dispatch, selectedInstance])

    
    useEffect(() => {
        if (!selectedInstance || selectedInstance?.instance_name !== instanceName) {
            getInstanceAndUpdate()
        }
    }, [selectedInstance, getInstanceAndUpdate])

    const isInstanceRunning = useMemo(() => {
        return selectedInstance?.instance_status === InstanceStatus.RUNNING
    }, [selectedInstance])

    const isInstanceStopped = useMemo(() => {
        return selectedInstance?.instance_status === InstanceStatus.STOPPED
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
            toast.success(`Instance ${selectedInstance.instance_name} started successfully`)
        } catch (error) {
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: getErrorMessage(error, "Failed to start the instance")
            })
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
            toast.success(`Instance ${selectedInstance.instance_name} stopped successfully`)
        } catch (error) {
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: getErrorMessage(error, "Failed to stop the instance")
            })
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
            toast.success(`Instance ${selectedInstance.instance_name} restarted successfully`)
        } catch (error) {
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: getErrorMessage(error, "Failed to restart the instance")
            })
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
            toast.success(`Instance ${selectedInstance.instance_name} deleted successfully`)
            refreshInstances()
            navigate(`/user/${userName}/instance`)
        } catch (error) {
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: getErrorMessage(error, "Failed to delete the instance")
            })
        }
    }, [selectedInstance, dispatch, refreshInstances, navigate, userName])

    // Reset root password
    const resetPassword = useCallback(async (password: string) => {
        if (!selectedInstance) return

        try {
            dispatch?.({ type: INSTANCE_ACTIONS.START_FETCH })
            await InstanceService.instanceResetInstancePassword({
                path: { instance_name: selectedInstance.instance_name },
                body: { password }
            })
            await getInstanceAndUpdate()
            toast.success(`Root password for ${selectedInstance.instance_name} has been updated successfully`)
        } catch (error) {
            dispatch?.({
                type: INSTANCE_ACTIONS.FETCH_ERROR,
                payload: getErrorMessage(error, "Failed to reset the root password")
            })
        }
    }, [selectedInstance, dispatch, getInstanceAndUpdate])

    // Format instance uptime with user's timezone
    const getFormattedUptime = useCallback((lastUpdatedAt: Date) => {
        if (!selectedInstance) return "N/A"
        return formatUptime(lastUpdatedAt, selectedInstance.instance_status === InstanceStatus.RUNNING)
    }, [selectedInstance])
  
    // Start polling when instance is running
    useEffect(() => {
        // Start new polling interval
        if (!statePollingInterval) {
            getInstanceStateAndUpdate() // Initial fetch
            const interval = window.setInterval(getInstanceStateAndUpdate, STATUS_POLLING_INTERVAL)
            dispatch?.({
                type: INSTANCE_ACTIONS.SET_STATE_POLLING_INTERVAL,
                payload: interval
            })
        }

        // Cleanup function
        return () => {
            if (statePollingInterval) {
                clearInterval(statePollingInterval)
                dispatch?.({
                    type: INSTANCE_ACTIONS.SET_STATE_POLLING_INTERVAL,
                    payload: null
                })
            }
        }
    }, [])

  
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
        getInstanceStateAndUpdate,
        startInstance,
        stopInstance,
        restartInstance,
        deleteInstance,
        resetPassword,
        getFormattedUptime,
    }
}