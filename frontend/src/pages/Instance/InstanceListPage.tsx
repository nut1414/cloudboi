import React from "react"
import TopNavbar from "../../components/Navbar/TopNavbar"
import TableSection from "../../components/Common/TableSection"
import { StatusBadge, TableColumn } from "../../components/Common/Table"
import Button from "../../components/Common/Button"
import { UserInstanceResponse } from "../../client"
import { useInstanceList } from "../../hooks/Instance/useInstanceList"
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/24/outline"

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
                    <Button
                        label="View"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation()
                            handleViewInstance(instance)
                        }}
                        variant="secondary"
                    />
                    <Button
                        icon={<EllipsisVerticalIcon className="w-5 h-5" />}
                        label=""
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation()
                            handleInstanceAction('menu', instance)
                        }}
                        className="!p-1 !bg-transparent !border-0"
                        variant="outline"
                    />
                </span>
            )
        }
    ]

    return (
        <>
            <TopNavbar
                onSearch={handleSearch}
                actions={[
                    <Button
                        onClick={handleCreateInstance}
                        label="Create Instance"
                        variant="secondary"
                        icon={<PlusIcon className="w-4 h-4" />}
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