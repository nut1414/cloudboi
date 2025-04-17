import { useInstance } from "../../contexts/instanceContext"
import { useEffect, useState, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { InstancePlan, AdminService } from "../../client"
import { INSTANCE_ACTIONS } from "../../contexts/instanceContext"
import useToast from "../useToast"

export type InstancePlanFormData = {
    instance_plan_id?: number | null
    instance_package_name: string
    vcpu_amount: number
    ram_amount: number
    storage_amount: number
    cost_hour: number
}

export type ModalType = 'create' | 'update' | 'delete' | 'view' | null

export const useInstancePlanManage = () => {
    const {
        allInstancePlans,
        isLoading,
        error,
        dispatch
    } = useInstance()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [modalType, setModalType] = useState<ModalType>(null)
    const [selectedPlan, setSelectedPlan] = useState<InstancePlan | null>(null)
    const toast = useToast()
    
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

    const fetchAllInstancePlans = useCallback(async () => {
        try {
            dispatch?.({ type: INSTANCE_ACTIONS.START_FETCH })
            const result = await AdminService.adminGetInstancePlans()
            dispatch?.({ type: INSTANCE_ACTIONS.SET_ALL_INSTANCE_PLANS, payload: result?.data })
            dispatch?.({ type: INSTANCE_ACTIONS.FETCH_SUCCESS })
        } catch (error) {
            dispatch?.({ type: INSTANCE_ACTIONS.SET_ERROR, payload: error })
        }
    }, [dispatch])
    
    useEffect(() => {
        if (!allInstancePlans) {
            fetchAllInstancePlans()
        }
    }, [allInstancePlans, fetchAllInstancePlans])
    
    const openCreateModal = useCallback(() => {
        createForm.reset({
            instance_package_name: '',
            vcpu_amount: 1,
            ram_amount: 1,
            storage_amount: 10,
            cost_hour: 0.01
        })
        setModalType('create')
    }, [createForm])
    
    const openUpdateModal = useCallback((plan: InstancePlan) => {
        updateForm.reset({
            instance_plan_id: plan.instance_plan_id,
            instance_package_name: plan.instance_package_name,
            vcpu_amount: plan.vcpu_amount,
            ram_amount: plan.ram_amount,
            storage_amount: plan.storage_amount,
            cost_hour: plan.cost_hour
        })
        setSelectedPlan(plan)
        setModalType('update')
    }, [updateForm])
    
    const openViewModal = useCallback((plan: InstancePlan) => {
        updateForm.reset({
            instance_plan_id: plan.instance_plan_id,
            instance_package_name: plan.instance_package_name,
            vcpu_amount: plan.vcpu_amount,
            ram_amount: plan.ram_amount,
            storage_amount: plan.storage_amount,
            cost_hour: plan.cost_hour
        })
        setSelectedPlan(plan)
        setModalType('view')
    }, [updateForm])
    
    const openDeleteModal = useCallback((plan: InstancePlan) => {
        deleteForm.reset(plan)
        setSelectedPlan(plan)
        setModalType('delete')
    }, [deleteForm])
    
    const closeModal = useCallback(() => {
        setModalType(null)
        setSelectedPlan(null)
    }, [])
    
    const handleCreatePlan = useCallback(async (data: InstancePlanFormData) => {
        try {
            setIsSubmitting(true)
            
            const result = await AdminService.adminCreateInstancePlan({
                body: data
            })
            
            // Refresh instance plans after creating
            await fetchAllInstancePlans()
            toast.success(`Plan "${result?.data?.instance_package_name}" created successfully`)
            
            // Close modal after a short delay
            setTimeout(() => {
                closeModal()
            }, 1500)
        } catch (err: any) {
            dispatch?.({ type: INSTANCE_ACTIONS.SET_ERROR, payload: err.message || 'Failed to create instance plan' })
        } finally {
            setIsSubmitting(false)
        }
    }, [closeModal, fetchAllInstancePlans])
    
    const handleUpdatePlan = useCallback(async (data: InstancePlanFormData) => {
        try {
            setIsSubmitting(true)
            
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
            
            // Refresh instance plans after updating
            await fetchAllInstancePlans()
            toast.success(`Plan "${result?.data?.instance_package_name}" updated successfully`)
            
            // Close modal after a short delay
            setTimeout(() => {
                closeModal()
            }, 1500)
        } catch (err: any) {
            dispatch?.({ type: INSTANCE_ACTIONS.SET_ERROR, payload: err.message || 'Failed to update instance plan' })
        } finally {
            setIsSubmitting(false)
        }
    }, [closeModal, fetchAllInstancePlans])
    
    const handleDeletePlan = useCallback(async (data: InstancePlanFormData) => {
        try {
            setIsSubmitting(true)
            
            if (!selectedPlan?.instance_plan_id) {
                throw new Error('Instance plan ID is required')
            }
            
            await AdminService.adminDeleteInstancePlan({
                body: {
                    ...data,
                    instance_plan_id: selectedPlan.instance_plan_id
                }
            })
            
            // Refresh instance plans after deleting
            await fetchAllInstancePlans()
            toast.success(`Plan "${selectedPlan?.instance_package_name}" deleted successfully`)
            
            // Close modal after a short delay
            setTimeout(() => {
                closeModal()
            }, 1500)
        } catch (err: any) {
            dispatch?.({ type: INSTANCE_ACTIONS.SET_ERROR, payload: err.message || 'Failed to delete instance plan' })
        } finally {
            setIsSubmitting(false)
        }
    }, [closeModal, fetchAllInstancePlans, selectedPlan])
    
    return {
        instancePlans: allInstancePlans || [],
        isLoading,
        error,
        isSubmitting,
        createForm,
        updateForm,
        deleteForm,
        modalType,
        selectedPlan,
        openCreateModal,
        openUpdateModal,
        openDeleteModal,
        openViewModal,
        closeModal,
        handleCreatePlan,
        handleUpdatePlan,
        handleDeletePlan
    }
}
