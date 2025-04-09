import React from "react"
import PageContainer from "../../components/Layout/PageContainer"
import Button from "../../components/Common/Button/Button"
import Table, { TableColumn } from "../../components/Common/Table"
import { InstancePlan } from "../../client"
import { useInstancePlanManage, InstancePlanFormData } from "../../hooks/Admin/useInstancePlanManage"
import Modal from "../../components/Common/Modal/Modal"
import InputField from "../../components/Common/InputField"
import { Controller } from "react-hook-form"
import { TrashIcon, PencilIcon, CheckCircleIcon, ExclamationCircleIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline"
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
        closeModal,
        handleCreatePlan,
        handleUpdatePlan,
        handleDeletePlan
    } = useInstancePlanManage()

    // Table columns definition
    const columns: TableColumn<InstancePlan>[] = [
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
                </div>
            )
        }
    ]

    // Form field components for Create/Update modals
    const renderFormFields = (formType: 'create' | 'update') => {
        const form = formType === 'create' ? createForm : updateForm
        const { control, formState: { errors } } = form

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
                        />
                    )}
                />

                {formType === 'update' && (
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
                            />
                        )}
                    />
                </div>
            </div>
        )
    }

    // Render error or success message
    const renderStatusMessage = () => {
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
    }

    // Create Plan Modal
    const renderCreateModal = () => (
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
            {renderStatusMessage()}
            {renderFormFields('create')}
        </Modal>
    )

    // Update Plan Modal
    const renderUpdateModal = () => (
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
            {renderStatusMessage()}
            {renderFormFields('update')}
        </Modal>
    )

    // Delete Plan Modal
    const renderDeleteModal = () => (
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
            {renderStatusMessage()}
            <div className="text-center">
                <p className="text-gray-300 mb-4">
                    Are you sure you want to delete plan "{selectedPlan?.instance_package_name}"?
                </p>
                <p className="text-red-400 text-sm">
                    This action cannot be undone.
                </p>
            </div>
        </Modal>
    )

    return (
        <>
            <PageContainer
                title="Instance Plan Manage"
                subtitle="Manage your instance plans"
                subtitleIcon={<ClipboardDocumentIcon className="w-4 h-4" />}
                rightContent={<Button label="Create Instance Plan" variant="purple" onClick={openCreateModal} />}
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
            {renderCreateModal()}
            {renderUpdateModal()}
            {renderDeleteModal()}
        </>
    )
}

export default React.memo(InstancePlanManagePage)