import React, { useMemo, useCallback } from "react"
import PageContainer from "../../components/Layout/PageContainer"
import Button from "../../components/Common/Button/Button"
import Table, { TableColumn } from "../../components/Common/Table"
import { AdminInstancePlan } from "../../client"
import { useInstancePlanManage, InstancePlanFormData } from "../../hooks/Admin/useInstancePlanManage"
import Modal from "../../components/Common/Modal/Modal"
import InputField from "../../components/Common/InputField"
import { Controller } from "react-hook-form"
import { TrashIcon, PencilIcon, CheckCircleIcon, ExclamationCircleIcon, ClipboardDocumentIcon, EyeIcon } from "@heroicons/react/24/outline"
import { CURRENCY } from "../../constant/CurrencyConstant"

const InstancePlanManagePage: React.FC = () => {
    const {
        instancePlans,
        isLoading,
        isSubmitting,
        actionError,
        actionSuccess,
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
    } = useInstancePlanManage()

    // Table columns definition
    const columns: TableColumn<AdminInstancePlan>[] = useMemo(() => [
        {
            key: "instance_package_name",
            label: "Package Name"
        },
        {
            key: "vcpu_amount",
            label: "CPUs",
            render: (plan) => `${plan.vcpu_amount} vCPUs`
        },
        {
            key: "ram_amount",
            label: "RAM",
            render: (plan) => `${plan.ram_amount} GBs`
        },
        {
            key: "storage_amount",
            label: "Storage",
            render: (plan) => `${plan.storage_amount} GBs`
        },
        {
            key: "cost_hour",
            label: "Price(CBC)",
            render: (plan) => `${CURRENCY.FORMAT_HOURLY(plan.cost_hour)}`
        },
        {
            key: "actions",
            label: "Actions",
            render: (plan) => (
                <div className="flex space-x-2">
                    {plan.is_editable ? (
                        <>
                            <Button
                                icon={<PencilIcon className="w-4 h-4" />}
                                variant="secondary"
                                label="Edit"
                                onClick={() => openUpdateModal(plan)}
                            />
                            <Button
                                icon={<TrashIcon className="w-4 h-4" />}
                                variant="danger"
                                label="Delete"
                                onClick={() => openDeleteModal(plan)}
                            />
                        </>
                    ) : (
                        <Button
                            icon={<EyeIcon className="w-4 h-4" />}
                            variant="info"
                            label="View"
                            onClick={() => openViewModal(plan)}
                        />
                    )}
                </div>
            )
        }
    ], [openUpdateModal, openDeleteModal, openViewModal])

    // Form field components for Create/Update modals
    const renderFormFields = useCallback((formType: 'create' | 'update' | 'view') => {
        const form = formType === 'create' ? createForm : updateForm
        const { control, formState: { errors } } = form
        const isViewOnly = formType === 'view'

        return (
            <div className="space-y-4">
                <Controller
                    name="instance_package_name"
                    control={control}
                    rules={{ required: 'Package name is required' }}
                    render={({ field }) => (
                        <InputField
                            label="Package Name"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter package name"
                            error={errors.instance_package_name?.message}
                            disabled={isViewOnly}
                        />
                    )}
                />

                {(formType === 'update' || formType === 'view') && (
                    <Controller
                        name="instance_plan_id"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                label="Instance Plan ID"
                                value={field.value?.toString() || ''}
                                onChange={field.onChange}
                                disabled={true}
                                className="opacity-70"
                            />
                        )}
                    />
                )}

                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        name="vcpu_amount"
                        control={control}
                        rules={{ 
                            required: 'vCPU amount is required',
                            min: { value: 1, message: 'Minimum 1 vCPU' } 
                        }}
                        render={({ field }) => (
                            <InputField
                                label="vCPU Amount"
                                type="number"
                                value={field.value?.toString()}
                                onChange={(value) => field.onChange(parseInt(value) || 1)}
                                placeholder="Enter vCPU amount"
                                error={errors.vcpu_amount?.message}
                                disabled={isViewOnly}
                            />
                        )}
                    />

                    <Controller
                        name="ram_amount"
                        control={control}
                        rules={{ 
                            required: 'RAM amount is required',
                            min: { value: 1, message: 'Minimum 1 GB RAM' } 
                        }}
                        render={({ field }) => (
                            <InputField
                                label="RAM Amount (GB)"
                                type="number"
                                value={field.value?.toString()}
                                onChange={(value) => field.onChange(parseInt(value) || 1)}
                                placeholder="Enter RAM amount"
                                error={errors.ram_amount?.message}
                                disabled={isViewOnly}
                            />
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        name="storage_amount"
                        control={control}
                        rules={{ 
                            required: 'Storage amount is required',
                            min: { value: 5, message: 'Minimum 5 GB storage' } 
                        }}
                        render={({ field }) => (
                            <InputField
                                label="Storage Amount (GB)"
                                type="number"
                                value={field.value?.toString()}
                                onChange={(value) => field.onChange(parseInt(value) || 10)}
                                placeholder="Enter storage amount"
                                error={errors.storage_amount?.message}
                                disabled={isViewOnly}
                            />
                        )}
                    />

                    <Controller
                        name="cost_hour"
                        control={control}
                        rules={{ 
                            required: 'Cost is required',
                            min: { value: 0.001, message: 'Minimum 0.001 CBC' } 
                        }}
                        render={({ field }) => (
                            <InputField
                                label="Cost per Hour (CBC)"
                                type="number"
                                step="0.001"
                                value={field.value?.toString()}
                                onChange={(value) => field.onChange(parseFloat(value) || 0.01)}
                                placeholder="Enter hourly cost"
                                error={errors.cost_hour?.message}
                                disabled={isViewOnly}
                            />
                        )}
                    />
                </div>
            </div>
        )
    }, [createForm, updateForm])

    // Render error or success message
    const renderStatusMessage = useMemo(() => {
        if (actionSuccess) {
            return (
                <div className="mb-4 p-3 bg-green-900/30 border-l-4 border-green-500 text-green-300 rounded flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <p>{actionSuccess}</p>
                </div>
            )
        }

        if (actionError) {
            return (
                <div className="mb-4 p-3 bg-red-900/30 border-l-4 border-red-500 text-red-300 rounded flex items-center">
                    <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                    <p>{actionError}</p>
                </div>
            )
        }

        return null
    }, [actionSuccess, actionError])

    // Create Plan Modal
    const renderCreateModal = useMemo(() => (
        <Modal
            isOpen={modalType === 'create'}
            onClose={closeModal}
            title="Create New Instance Plan"
            footer={
                <>
                    <Button
                        label="Cancel"
                        variant="outline"
                        onClick={closeModal}
                    />
                    <Button
                        label={isSubmitting ? "Creating..." : "Create Plan"}
                        variant="purple"
                        onClick={createForm.handleSubmit(handleCreatePlan)}
                        disabled={isSubmitting}
                    />
                </>
            }
        >
            {renderStatusMessage}
            {renderFormFields('create')}
        </Modal>
    ), [modalType, closeModal, isSubmitting, createForm, handleCreatePlan, renderStatusMessage, renderFormFields])

    // Update Plan Modal
    const renderUpdateModal = useMemo(() => (
        <Modal
            isOpen={modalType === 'update'}
            onClose={closeModal}
            title={`Edit Plan: ${selectedPlan?.instance_package_name}`}
            footer={
                <>
                    <Button
                        label="Cancel"
                        variant="outline"
                        onClick={closeModal}
                    />
                    <Button
                        label={isSubmitting ? "Updating..." : "Update Plan"}
                        variant="purple"
                        onClick={updateForm.handleSubmit(handleUpdatePlan)}
                        disabled={isSubmitting}
                    />
                </>
            }
        >
            {renderStatusMessage}
            {renderFormFields('update')}
        </Modal>
    ), [modalType, closeModal, selectedPlan, isSubmitting, updateForm, handleUpdatePlan, renderStatusMessage, renderFormFields])

    // View Plan Modal (Read-only)
    const renderViewModal = useMemo(() => (
        <Modal
            isOpen={modalType === 'view'}
            onClose={closeModal}
            title={`View Plan: ${selectedPlan?.instance_package_name}`}
            footer={
                <Button
                    label="Close"
                    variant="outline"
                    onClick={closeModal}
                />
            }
        >
            {renderFormFields('view')}
        </Modal>
    ), [modalType, closeModal, selectedPlan, renderFormFields])

    // Delete Plan Modal
    const renderDeleteModal = useMemo(() => (
        <Modal
            isOpen={modalType === 'delete'}
            onClose={closeModal}
            title="Confirm Delete"
            size="sm"
            footer={
                <>
                    <Button
                        label="Cancel"
                        variant="outline"
                        onClick={closeModal}
                    />
                    <Button
                        label={isSubmitting ? "Deleting..." : "Delete Plan"}
                        variant="danger"
                        onClick={deleteForm.handleSubmit(handleDeletePlan)}
                        disabled={isSubmitting}
                    />
                </>
            }
        >
            {renderStatusMessage}
            <div className="text-center">
                <p className="text-gray-300 mb-4">
                    Are you sure you want to delete plan "{selectedPlan?.instance_package_name}"?
                </p>
                <p className="text-red-400 text-sm">
                    This action cannot be undone.
                </p>
            </div>
        </Modal>
    ), [modalType, closeModal, isSubmitting, deleteForm, handleDeletePlan, selectedPlan, renderStatusMessage])

    const headerContent = useMemo(() => (
        <Button label="Create Instance Plan" variant="purple" onClick={openCreateModal} />
    ), [openCreateModal])

    return (
        <>
            <PageContainer
                title="Instance Plan Manage"
                subtitle="Manage your instance plans"
                subtitleIcon={<ClipboardDocumentIcon className="w-4 h-4" />}
                rightContent={headerContent}
            >
                <Table
                    columns={columns}
                    data={instancePlans}
                    isLoading={isLoading}
                    emptyStateMessage="No instance plans found"
                    onCreateNew={openCreateModal}
                    keyExtractor={(plan) => plan.instance_plan_id.toString()}
                    unit="plan"
                />
            </PageContainer>

            {/* Render Modals */}
            {renderCreateModal}
            {renderUpdateModal}
            {renderViewModal}
            {renderDeleteModal}
        </>
    )
}

export default React.memo(InstancePlanManagePage)