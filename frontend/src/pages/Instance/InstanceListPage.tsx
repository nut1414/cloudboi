import React from "react"
import TopNavbar, { NavButton } from "../../components/Navbar/TopNavbar"
import TableSection from "../../components/Common/TableSection"
import { ActionButton, StatusBadge, TableColumn } from "../../components/Common/Table"
import { Icon } from "../../assets/Icon"
import { UserInstanceResponse } from "../../client"
import { useInstanceList } from "../../hooks/Instance/useInstanceList"

function InstanceListPage() {
    const {
        filteredInstances,
        isLoading,
        handleSearch,
        handleCreateInstance,
        handleViewInstance,
        handleInstanceAction
    } = useInstanceList()

    // Define table columns with rendering functions
    const columns: TableColumn<UserInstanceResponse>[] = [
        {
            key: 'instance_name',
            label: 'Name'
        },
        {
            key: 'os_type',
            label: 'OS',
            render: (instance) => instance.os_type?.os_image_name || "N/A"
        },
        {
            key: 'instance_plan',
            label: 'Instance Plan',
            render: (instance) => instance.instance_plan?.instance_package_name || "N/A"
        },
        {
            key: 'instance_status',
            label: 'Status',
            render: (instance) => <StatusBadge status={instance.instance_status} />
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (instance) => (
                <span className="flex space-x-2">
                    <ActionButton
                        label="View"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleViewInstance(instance)
                        }}
                        className="py-1 text-sm bg-blue-800 hover:bg-blue-700 text-white"
                    />
                    <button
                        className="text-gray-300 hover:text-white transition-colors"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleInstanceAction('menu', instance)
                        }}
                    >
                        {Icon.ThreeDots}
                    </button>
                </span>
            )
        }
    ]

    return (
        <>
            <TopNavbar
                onSearch={handleSearch}
                actions={[
                    <NavButton
                        onClick={handleCreateInstance}
                        label="Create Instance"
                        variant="secondary"
                        icon={Icon.Plus}
                    />
                ]}
            />

            <TableSection
                title="Instance Management"
                columns={columns}
                data={filteredInstances}
                isLoading={isLoading}
                onRowClick={handleViewInstance}
                emptyStateMessage="No instances found matching your criteria"
                onCreateNew={handleCreateInstance}
                keyExtractor={(instance) => instance.instance_id}
            />
        </>
    )
}

export default React.memo(InstanceListPage)
