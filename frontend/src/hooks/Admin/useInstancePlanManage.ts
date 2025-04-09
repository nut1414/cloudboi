import { useInstanceCreate } from "../Instance/useInstanceCreate"
import { useInstance } from "../../contexts/instanceContext"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { InstancePlan, AdminService } from "../../client"
import { INSTANCE_ACTIONS } from "../../contexts/instanceContext"

export type InstancePlanFormData = {
    instance_plan_id?: number | null
    instance_package_name: string
    vcpu_amount: number
    ram_amount: number
    storage_amount: number
    cost_hour: number
}

export type ModalType = 'create' | 'update' | 'delete' | null

export const useInstancePlanManage = () => {
    const {
        fetchInstanceDetails
    } = useInstanceCreate()
    const {
        instanceDetails,
        isLoading,
        error,
        dispatch
    } = useInstance()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [modalType, setModalType] = useState<ModalType>(null)
    const [selectedPlan, setSelectedPlan] = useState<InstancePlan | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)
    const [actionSuccess, setActionSuccess] = useState<string | null>(null)
    
    const createForm = useForm<InstancePlanFormData>({
        defaultValues: {
            instance_package_name: '',
            vcpu_amount: 1,
            ram_amount: 1,
            storage_amount: 10,
            cost_hour: 0.01
        }
    })

    const updateForm = useForm<InstancePlanFormData>({
        defaultValues: {
            instance_plan_id: null,
            instance_package_name: '',
            vcpu_amount: 1,
            ram_amount: 1,
            storage_amount: 10,
            cost_hour: 0.01
        }
    })

    const deleteForm = useForm<InstancePlanFormData>()
    
    useEffect(() => {
        if (!instanceDetails) {
            fetchInstanceDetails()
        }
    }, [instanceDetails, fetchInstanceDetails])
    
    const openCreateModal = () => {
        createForm.reset({
            instance_package_name: '',
            vcpu_amount: 1,
            ram_amount: 1,
            storage_amount: 10,
            cost_hour: 0.01
        })
        setActionError(null)
        setActionSuccess(null)
        setModalType('create')
    }
    
    const openUpdateModal = (plan: InstancePlan) => {
        updateForm.reset({
            instance_plan_id: plan.instance_plan_id,
            instance_package_name: plan.instance_package_name,
            vcpu_amount: plan.vcpu_amount,
            ram_amount: plan.ram_amount,
            storage_amount: plan.storage_amount,
            cost_hour: plan.cost_hour
        })
        setSelectedPlan(plan)
        setActionError(null)
        setActionSuccess(null)
        setModalType('update')
    }
    
    const openDeleteModal = (plan: InstancePlan) => {
        deleteForm.reset(plan)
        setSelectedPlan(plan)
        setActionError(null)
        setActionSuccess(null)
        setModalType('delete')
    }
    
    const closeModal = () => {
        setModalType(null)
        setSelectedPlan(null)
        setActionError(null)
        setActionSuccess(null)
    }
    
    const handleCreatePlan = async (data: InstancePlanFormData) => {
        try {
            setIsSubmitting(true)
            setActionError(null)
            
            const result = await AdminService.adminCreateInstancePlan({
                body: data
            })
            
            // Refresh instance details after creating
            setActionSuccess(`Plan "${result?.data?.instance_package_name}" created successfully`)
            dispatch?.({
                type: INSTANCE_ACTIONS.SET_INSTANCE_DETAILS,
                payload: {
                    ...instanceDetails,
                    instance_package: [
                        ...(instanceDetails?.instance_package || []),
                        result?.data
                    ]
                }
            })
            
            // Close modal after a short delay
            setTimeout(() => {
                closeModal()
            }, 1500)
        } catch (err: any) {
            setActionError(err.message || 'Failed to create instance plan')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }
    
    const handleUpdatePlan = async (data: InstancePlanFormData) => {
        try {
            setIsSubmitting(true)
            setActionError(null)
            
            // Ensure instance_plan_id is a number
            if (!data.instance_plan_id) {
                throw new Error('Instance plan ID is required')
            }
            
            const result = await AdminService.adminUpdateInstancePlan({
                body: {
                    ...data,
                    instance_plan_id: data.instance_plan_id
                }
            })
            
            // Refresh instance details after updating
            setActionSuccess(`Plan "${result?.data?.instance_package_name}" updated successfully`)
            dispatch?.({
                type: INSTANCE_ACTIONS.SET_INSTANCE_DETAILS,
                payload: {
                    ...instanceDetails,
                    instance_package: instanceDetails?.instance_package?.map(plan => plan.instance_plan_id === data.instance_plan_id ? result?.data : plan)
                }
            })
            
            // Close modal after a short delay
            setTimeout(() => {
                closeModal()
            }, 1500)
        } catch (err: any) {
            setActionError(err.message || 'Failed to update instance plan')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }
    
    const handleDeletePlan = async (data: InstancePlanFormData) => {
        try {
            setIsSubmitting(true)
            setActionError(null)
            
            if (!selectedPlan?.instance_plan_id) {
                throw new Error('Instance plan ID is required')
            }
            
            await AdminService.adminDeleteInstancePlan({
                body: {
                    ...data,
                    instance_plan_id: selectedPlan.instance_plan_id
                }
            })
            
            // Refresh instance details after deleting
            dispatch?.({
                type: INSTANCE_ACTIONS.SET_INSTANCE_DETAILS,
                payload: {
                    ...instanceDetails,
                    instance_package: instanceDetails?.instance_package?.filter(plan => plan.instance_plan_id !== selectedPlan.instance_plan_id)
                }
            })
            setActionSuccess(`Plan "${selectedPlan?.instance_package_name}" deleted successfully`)
            
            // Close modal after a short delay
            setTimeout(() => {
                closeModal()
            }, 1500)
        } catch (err: any) {
            setActionError(err.message || 'Failed to delete instance plan')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }
    
    return {
        instancePlans: instanceDetails?.instance_package || [],
        isLoading,
        error,
        actionError,
        actionSuccess,
        isSubmitting,
        createForm,
        updateForm,
        deleteForm,
        modalType,
        selectedPlan,
        openCreateModal,
        openUpdateModal,
        openDeleteModal,
        closeModal,
        handleCreatePlan,
        handleUpdatePlan,
        handleDeletePlan
    }
}
