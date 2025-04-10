// useInstanceCreate.ts - updated with react-hook-form
import { useState, useEffect, useMemo, useCallback } from "react"
import { useForm } from "react-hook-form"
import { InstanceService } from "../../client"
import {
    InstanceCreateRequest,
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

    // Form setup with react-hook-form
    const {
        register, 
        handleSubmit: formSubmit, 
        watch, 
        setValue, 
        formState: { errors, isValid }
    } = useForm<InstanceCreateRequest>({
        mode: "onChange",
        defaultValues: {
            root_password: "",
            instance_name: ""
        },
        // Add validation rules
        resolver: (values) => {
            const errors: Record<string, any> = {}
            
            // Validate OS type
            if (!values.os_type) {
                errors.os_type = {
                    type: "required",
                    message: "Please select an operating system"
                }
            }
            
            // Validate instance plan
            if (!values.instance_plan) {
                errors.instance_plan = {
                    type: "required",
                    message: "Please select an instance plan"
                }
            }
            
            // Validate root password
            if (!values.root_password) {
                errors.root_password = {
                    type: "required",
                    message: "Password is required"
                }
            } else {
                const passwordTests = [
                    { test: values.root_password.length >= 8, message: "Password must be at least 8 characters" },
                    { test: /[A-Z]/.test(values.root_password), message: "Password must contain an uppercase letter" },
                    { test: /[a-z]/.test(values.root_password), message: "Password must contain a lowercase letter" },
                    { test: /[0-9]/.test(values.root_password), message: "Password must contain a number" },
                    { test: /[!@#$%^&*()_+\-=\[\]{}':"\\|,.<>\/?]/.test(values.root_password), message: "Password must contain a special character" }
                ]
                
                const failedTest = passwordTests.find(test => !test.test)
                if (failedTest) {
                    errors.root_password = {
                        type: "pattern",
                        message: failedTest.message
                    }
                }
            }
            
            // Validate instance name
            if (!values.instance_name) {
                errors.instance_name = {
                    type: "required",
                    message: "Hostname is required"
                }
            } else if (!/^[a-z0-9-]+$/.test(values.instance_name)) {
                errors.instance_name = {
                    type: "pattern",
                    message: "Hostname can only contain lowercase letters, numbers, and hyphens"
                }
            }
            
            return {
                values,
                errors
            }
        }
    })


    // Get form values
    const formValues = watch()

    // States
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
            alert("Error fetching instance details")
        } finally {
            dispatch?.({ type: INSTANCE_ACTIONS.SET_LOADING, payload: false })
        }
    }, [dispatch])

    // Update form handlers with useCallback and setValue
    const handleOsTypeSelect = useCallback((osType: OsType) => {
        setValue("os_type", osType, { shouldValidate: true })
    }, [setValue])

    const handleInstancePlanSelect = useCallback((instancePlan: InstancePlan) => {
        setValue("instance_plan", instancePlan, { shouldValidate: true })
    }, [setValue])

    const handleRootPasswordChange = useCallback((password: string) => {
        setValue("root_password", password, { shouldValidate: true })
    }, [setValue])

    const handleInstanceNameChange = useCallback((name: string) => {
        setValue("instance_name", name, { shouldValidate: true })
    }, [setValue])

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
        setValue("os_type", null as any, { shouldValidate: true }) // Reset OS type
    }, [setValue])

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

    // Create instance
    const createInstance = useCallback(async () => {
        let result = { success: false, data: null as any, error: null }
        
        await formSubmit(async (data) => {
            setIsSubmitting(true)
            dispatch?.({ type: INSTANCE_ACTIONS.SET_ERROR, payload: null })

            try {
                const response = await InstanceService.instanceCreateInstance({
                    body: data
                })

                refreshInstances()
                result = {
                    success: true,
                    data: response.data,
                    error: null
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.detail?.[0]?.msg ||
                    "Failed to create instance. Please try again."

                dispatch?.({ type: INSTANCE_ACTIONS.SET_ERROR, payload: errorMessage })
                result = {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            } finally {
                setIsSubmitting(false)
            }
        })()
        
        return result
    }, [formSubmit, dispatch, refreshInstances])


    return {
        instanceDetails,
        formValues,
        isLoading,
        error,
        isSubmitting,
        isFormValid: isValid,
        errors,
        register,
        selectedImageName,
        selectedVersion,
        uniqueImageNames,
        availableVersions,
        handleOsTypeSelect,
        handleInstancePlanSelect,
        handleRootPasswordChange,
        handleInstanceNameChange,
        createInstance,
        handleImageNameSelect,
        handleVersionSelect,
        fetchInstanceDetails
    }
}
