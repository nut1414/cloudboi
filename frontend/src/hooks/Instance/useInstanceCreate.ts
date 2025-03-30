// useInstanceCreate.ts
import { useState, useEffect, useMemo, useCallback } from "react"
import { InstanceService } from "../../client"
import {
    InstanceCreateRequest,
    InstanceDetails,
    OsType,
    InstancePlan
} from "../../client"
import { useInstance } from "../../contexts/instanceContext"
import { INSTANCE_ACTIONS } from "../../contexts/instanceContext"
import { useInstanceList } from "./useInstanceList"

export const useInstanceCreate = () => {
    const {
        instanceDetails,
        isLoading,
        error,
        dispatch
    } = useInstance()
    const {
        refreshInstances
    } = useInstanceList()

    // States
    const [formData, setFormData] = useState<Partial<InstanceCreateRequest>>({})
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [selectedImageName, setSelectedImageName] = useState<string>("")
    const [selectedVersion, setSelectedVersion] = useState<string>("")

    // Fetch instance details on component mount
    useEffect(() => {
        fetchInstanceDetails()
    }, [])

    // Fetch instance details from API
    const fetchInstanceDetails = useCallback(async () => {
        dispatch?.({ type: INSTANCE_ACTIONS.START_FETCH })
        try {
            const response = await InstanceService.instanceInstanceDetails()
            dispatch?.({
                type: INSTANCE_ACTIONS.SET_INSTANCE_DETAILS,
                payload: response.data
            })
            dispatch?.({ type: INSTANCE_ACTIONS.SET_ERROR, payload: null })
        } catch (err) {
            dispatch?.({
                type: INSTANCE_ACTIONS.SET_ERROR,
                payload: "Failed to load instance details. Please try again."
            })
            console.error("Error fetching instance details:", err)
        } finally {
            dispatch?.({ type: INSTANCE_ACTIONS.SET_LOADING, payload: false })
        }
    }, [dispatch])

    // Update form handlers with useCallback
    const handleOsTypeSelect = useCallback((osType: OsType) => {
        setFormData(prev => ({ ...prev, os_type: osType }))
    }, [])

    const handleInstancePlanSelect = useCallback((instancePlan: InstancePlan) => {
        setFormData(prev => ({ ...prev, instance_plan: instancePlan }))
    }, [])

    const handleRootPasswordChange = useCallback((password: string) => {
        setFormData(prev => ({ ...prev, root_password: password }))
    }, [])

    const handleInstanceNameChange = useCallback((name: string) => {
        setFormData(prev => ({ ...prev, instance_name: name }))
    }, [])

    // Get unique image names with useMemo
    const uniqueImageNames = useMemo(() => {
        if (!instanceDetails?.os_image) return []
        return [...new Set(instanceDetails.os_image.map(img => img.os_image_name))]
    }, [instanceDetails?.os_image])

    // Get available versions for selected image with useMemo
    const availableVersions = useMemo(() => {
        if (!selectedImageName || !instanceDetails?.os_image) return []

        return instanceDetails.os_image
            .filter(img => img.os_image_name === selectedImageName)
            .map(img => img.os_image_version)
    }, [selectedImageName, instanceDetails?.os_image])

    // Handle image name selection
    const handleImageNameSelect = useCallback((imageName: string) => {
        setSelectedImageName(imageName)
        setSelectedVersion("") // Reset version when image changes
    }, [])

    // Handle version selection
    const handleVersionSelect = useCallback((version: string) => {
        setSelectedVersion(version)

        // Find the complete OsType object
        const selectedOs = instanceDetails?.os_image.find(
            img => img.os_image_name === selectedImageName && img.os_image_version === version
        )

        if (selectedOs) {
            handleOsTypeSelect(selectedOs)
        }
    }, [instanceDetails?.os_image, selectedImageName, handleOsTypeSelect])

    // Check if all required fields are filled
    const isFormValid = useMemo(() => {
        const requiredFields = [
            formData.os_type,
            formData.instance_plan,
            formData.instance_name,
            formData.root_password
        ]
        return requiredFields.every(field => field != null)
    }, [formData.os_type, formData.instance_plan, formData.instance_name, formData.root_password])

    // Create instance
    const createInstance = useCallback(async () => {
        if (!isFormValid) {
            dispatch?.({
                type: INSTANCE_ACTIONS.SET_ERROR,
                payload: "Please fill all required fields"
            })
            return {
                success: false,
                error: "Please fill all required fields"
            }
        }

        setIsSubmitting(true)
        dispatch?.({ type: INSTANCE_ACTIONS.SET_ERROR, payload: null })

        try {
            const response = await InstanceService.instanceCreateInstance({
                body: formData as InstanceCreateRequest
            })

            refreshInstances()

            return {
                success: true,
                data: response.data
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail?.[0]?.msg ||
                "Failed to create instance. Please try again."

            dispatch?.({ type: INSTANCE_ACTIONS.SET_ERROR, payload: errorMessage })
            return {
                success: false,
                error: errorMessage
            }
        } finally {
            setIsSubmitting(false)
        }
    }, [formData, isFormValid, dispatch])

    return {
        instanceDetails,
        selectedImageName,
        selectedVersion,
        uniqueImageNames,
        availableVersions,
        formData,
        isLoading,
        error,
        isSubmitting,
        isFormValid,
        handleOsTypeSelect,
        handleInstancePlanSelect,
        handleRootPasswordChange,
        handleInstanceNameChange,
        createInstance,
        handleImageNameSelect,
        handleVersionSelect
    }
}