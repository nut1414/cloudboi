import React, { useState } from "react"
import TopNavbar from "../../components/Common/Navbar/TopNavbar"
import Table from "../../components/Common/Table"
import { TableColumn } from "../../components/Common/Table"
import StatusBadge from "../../components/Common/StatusBadge"
import Button from "../../components/Common/Button/Button"
import { UserInstanceResponse } from "../../client"
import { useInstanceList } from "../../hooks/Instance/useInstanceList"
import { EllipsisVerticalIcon, ServerIcon, PlusIcon, MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline"
import PageContainer from "../../components/Layout/PageContainer"
import { useParams, useNavigate } from "react-router-dom"
import SearchBar from "../../components/Common/SearchBar"

// Notification Badge component
interface NotificationBadgeProps {
    count: number
    onClick?: () => void
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, onClick }) => (
    <button
        className="relative hover:opacity-80 transition-opacity w-6 h-6 text-gray-300"
        onClick={onClick}
        aria-label={`Notifications: ${count} unread`}
    >
        <BellIcon />
        {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {count > 9 ? '9+' : count}
            </span>
        )}
    </button>
)

const InstanceListPage: React.FC = () => {
    const {
        filteredInstances,
        isLoading,
        handleSearch,
        handleCreateInstance,
        handleViewInstance,
        handleInstanceAction
    } = useInstanceList()

    const { userName } = useParams<{ userName: string }>()
    const navigate = useNavigate()
    const [notificationCount] = useState(3) // Example notification count

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
                        data-testid={`view-instance-button-${instance.instance_name}`}
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

    // Define left and right sections for TopNavbar
    const leftSection = (
        <SearchBar
            onSearch={handleSearch}
            width="w-56 md:w-64 lg:w-80"
            placeholder="Search by instance name..."
        />
    )

    const rightSection = (
        <div className="flex items-center gap-3">
            <Button
                href={`/user/${userName}/instance/create`}
                label="Create Instance"
                variant="secondary"
                icon={<PlusIcon className="w-4 h-4" />}
                data-testid="top-navbar-create-instance"
            />
            <NotificationBadge
                count={notificationCount}
                onClick={() => navigate(`/user/${userName}/notifications`)}
            />
        </div>
    )

    return (
        <>
            <TopNavbar
                leftSection={leftSection}
                rightSection={rightSection}
                variant="default"
                stickyTop={true}
            />
            <PageContainer
                title="Instance Management"
                subtitle="Manage your cloud instances"
                subtitleIcon={<ServerIcon className="w-4 h-4" />}
            >
                <Table
                    columns={columns}
                    data={filteredInstances}
                    isLoading={isLoading}
                    onRowClick={handleViewInstance}
                    emptyStateMessage="No instances found"
                    onCreateNew={handleCreateInstance}
                    keyExtractor={(instance) => instance.instance_id}
                    unit="instance"
                />
            </PageContainer>
        </>
    )
}

export default React.memo(InstanceListPage)