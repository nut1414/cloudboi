import { useCallback, useEffect, useMemo } from "react"
import { ClusterService } from "../../client"
import { useAdmin, ADMIN_ACTIONS } from "../../contexts/adminContext"
import { groupClusterMemberStateInfo } from "../../utils/systemState"
import useToast from "../useToast"
import { getErrorMessage } from "../../utils/errorHandling"
/**
 * Hook for managing users in the admin section
 * Uses AdminContext to store and manage user data
 */
export const useClusterState = () => {
  const {
    clusterStates,
    dispatch,
    isLoading,
    error
  } = useAdmin()
  const toast = useToast()

  const getClusterStateResponse = useCallback(async () => {
    try {
      dispatch?.({ type: ADMIN_ACTIONS.SET_LOADING, payload: true })
      const response = await ClusterService.clusterGetMembersState()
      if (response.data) {
        dispatch?.({ type: ADMIN_ACTIONS.SET_LOADING, payload: false })
        dispatch?.({ type: ADMIN_ACTIONS.SET_CLUSTER_STATES, payload: response.data })
        toast.success("Cluster state updated successfully")
      }
    } catch (error) {
      dispatch?.({ type: ADMIN_ACTIONS.FETCH_ERROR, payload: getErrorMessage(error, "Failed to update cluster state") })
    }
  }, [dispatch, toast])

  const clusterMembers = useMemo(() => {
    if (!clusterStates) return []

    return groupClusterMemberStateInfo(clusterStates)
  }, [clusterStates])

  useEffect(() => {
    const interval = setInterval(() => {
      getClusterStateResponse()
    }, 10000)

    return () => clearInterval(interval)
  }, [getClusterStateResponse])

  return {
    clusterMembers,
    updateClusterState: getClusterStateResponse,
    isLoading,
    error
  }
}
