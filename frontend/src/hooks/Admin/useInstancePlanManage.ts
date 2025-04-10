import { useInstanceCreate } from "../Instance/useInstanceCreate"
import { useInstance } from "../../contexts/instanceContext"
import { useEffect, useState, useCallback, useMemo } from "react"
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

export type ModalType = 'create' | 'update' | 'delete' | 'view' | null

export const useInstancePlanManage = () => {
    const {
        fetchInstanceDetails
    } = useInstanceCreate()
    const {
        allInstancePlans,
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

    const fetchAllInstancePlans = useCallback(async () => {
        try {
            dispatch?.({ type: INSTANCE_ACTIONS.START_FETCH })
            const result = await AdminService.adminGetInstancePlans()
            dispatch?.({ type: INSTANCE_ACTIONS.SET_ALL_INSTANCE_PLANS, payload: result?.data })
            dispatch?.({ type: INSTANCE_ACTIONS.FETCH_SUCCESS })
        } catch (error) {
            dispatch?.({ type: INSTANCE_ACTIONS.SET_ERROR, payload: error })
            console.error(error)
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
        setActionError(null)
        setActionSuccess(null)
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
        setActionError(null)
        setActionSuccess(null)
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
        setActionError(null)
        setActionSuccess(null)
        setModalType('view')
    }, [updateForm])
    
    const openDeleteModal = useCallback((plan: InstancePlan) => {
        deleteForm.reset(plan)
        setSelectedPlan(plan)
        setActionError(null)
        setActionSuccess(null)
        setModalType('delete')
    }, [deleteForm])
    
    const closeModal = useCallback(() => {
        setModalType(null)
        setSelectedPlan(null)
        setActionError(null)
        setActionSuccess(null)
    }, [])
    
    const handleCreatePlan = useCallback(async (data: InstancePlanFormData) => {
        try {
            setIsSubmitting(true)
            setActionError(null)
            
            const result = await AdminService.adminCreateInstancePlan({
                body: data
            })
            
            // Refresh instance plans after creating
            await fetchAllInstancePlans()
            setActionSuccess(`Plan "${result?.data?.instance_package_name}" created successfully`)
            
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
    }, [closeModal, fetchAllInstancePlans])
    
    const handleUpdatePlan = useCallback(async (data: InstancePlanFormData) => {
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
            
            // Refresh instance plans after updating
            await fetchAllInstancePlans()
            setActionSuccess(`Plan "${result?.data?.instance_package_name}" updated successfully`)
            
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
    }, [closeModal, fetchAllInstancePlans])
    
    const handleDeletePlan = useCallback(async (data: InstancePlanFormData) => {
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
            
            // Refresh instance plans after deleting
            await fetchAllInstancePlans()
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
    }, [closeModal, fetchAllInstancePlans, selectedPlan])
    
    return {
        instancePlans: allInstancePlans || [],
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
        openViewModal,
        closeModal,
        handleCreatePlan,
        handleUpdatePlan,
        handleDeletePlan
    }
}
