// pages/Admin/UserManagePage.tsx
import React, { useMemo, useCallback } from "react"
import { AdminUser, UserInstanceFromDB } from "../../client/types.gen"
import Table, { TableColumn, ExpandIndicator, CardGrid } from "../../components/Common/Table"
import PageContainer from "../../components/Layout/PageContainer"
import TopNavbar from "../../components/Common/Navbar/TopNavbar"
import { UsersIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import StatusBadge from "../../components/Common/StatusBadge"
import Button from "../../components/Common/Button/Button"
import { useUserManage } from "../../hooks/Admin/useUserManage"
import ItemCard from "../../components/Common/ItemCard"
import { CURRENCY } from "../../constant/CurrencyConstant"
import SearchBar from "../../components/Common/SearchBar"

// Content for expanded rows - instances in card layout
const InstancesContent = React.memo(({
  instances,
  username,
  navigateToInstanceDetail,
  getSortedInstances
}: {
  instances: UserInstanceFromDB[],
  username: string,
  navigateToInstanceDetail: (username: string, instance: UserInstanceFromDB) => void,
  getSortedInstances: (instances: UserInstanceFromDB[]) => UserInstanceFromDB[]
}) => {

  // Create a separate state map for each instance's expanded/collapsed state
  const [expandedInstances, setExpandedInstances] = React.useState<{ [key: string]: boolean }>({})

  // Toggle expansion for a specific instance
  const toggleInstanceExpansion = useCallback((instanceId: string) => {
    setExpandedInstances(prev => {
      const newState = { ...prev }
      newState[instanceId] = !prev[instanceId]
      return newState
    })
  }, [])

  if (instances.length === 0) {
    return <div className="text-gray-400 italic py-2">No instances found</div>
  }

  // Get sorted instances by status
  const sortedInstances = useMemo(() => getSortedInstances(instances), [instances, getSortedInstances])

  return (
    <div className="pb-6" onClick={(e) => e.stopPropagation()}>
      <CardGrid>
        {sortedInstances.map(instance => {
          // Use instanceId as a unique key for each instance
          const instanceId = instance.instance_id || instance.hostname
          // Check if this specific instance is expanded
          const isExpanded = !!expandedInstances[instanceId]

          return (
            <div key={instanceId} onClick={(e) => e.stopPropagation()}>
              <ItemCard
                title={instance.hostname}
                rightHeader={<StatusBadge status={instance.status} />}
                isCollapsible={true}
                isCollapsed={!isExpanded}
                onCollapseToggle={() => toggleInstanceExpansion(instanceId)}
                className="w-full transition-all duration-200"
                detailItems={[
                  {
                    label: "Plan",
                    value: `${instance.instance_plan.instance_package_name} (${instance.instance_plan.vcpu_amount} vCPU, ${instance.instance_plan.ram_amount} GB RAM)`
                  },
                  {
                    label: "OS",
                    value: `${instance.os_type.os_image_name} ${instance.os_type.os_image_version}`
                  },
                  {
                    label: "Storage",
                    value: `${instance.instance_plan.storage_amount} GB`
                  },
                  {
                    label: "Cost",
                    value: `${CURRENCY.FORMAT_HOURLY(instance.instance_plan.cost_hour)}`
                  },
                  { label: "Node", value: instance.lxd_node_name },
                  {
                    label: "Created",
                    value: instance.created_at ? new Date(instance.created_at).toLocaleDateString() : "N/A"
                  },
                  {
                    label: "Last Updated",
                    value: new Date(instance.last_updated_at).toLocaleDateString()
                  }
                ]}
                actionButton={
                  <Button
                    label="View Detail"
                    variant="text-link"
                    onClick={(e) => {
                      e.stopPropagation() // Prevent card expansion when clicking the button
                      navigateToInstanceDetail(username, instance)
                    }}
                  />
                }
              />
            </div>
          )
        })}
      </CardGrid>
    </div>
  )
})

const UserManagePage: React.FC = () => {
  const {
    users,
    isLoading,
    error,
    handleSearch,
    handleRowExpand,
    isRowExpanded,
    handleViewUserInstances,
    getInstanceStatusCounts,
    navigateToInstanceDetail,
    getSortedInstances
  } = useUserManage()

  // Define table columns
  const columns: TableColumn<AdminUser>[] = useMemo(() => [
    {
      key: "expand",
      label: "",
      render: (user) => <ExpandIndicator isExpanded={isRowExpanded(user)} />
    },
    {
      key: "username",
      label: "Username",
      render: (user) => (
        <div className="truncate max-w-full" title={user.username}>
          {user.username}
        </div>
      )
    },
    {
      key: "email",
      label: "Email",
      render: (user) => (
        <div className="truncate max-w-full" title={user.email}>
          {user.email}
        </div>
      )
    },
    {
      key: "instances_count",
      label: "No. of Instances",
      align: "center",
      render: (user) => (
        <div className="flex justify-center items-center">
          <span className="text-gray-100">{user.instances.length}</span>
        </div>
      )
    },
    {
      key: "instances_status",
      label: "Status Breakdown",
      render: (user) => {
        const { running, stopped, frozen, error } = getInstanceStatusCounts(user.instances)

        return (
          <div className="flex items-center space-x-2 flex-wrap">
            {running > 0 && (
              <StatusBadge
                status="Running"
                showDot={false}
                size="sm"
              >
                {running}
              </StatusBadge>
            )}
            {stopped > 0 && (
              <StatusBadge
                status="Stopped"
                showDot={false}
                size="sm"
              >
                {stopped}
              </StatusBadge>
            )}
            {frozen > 0 && (
              <StatusBadge
                status="Frozen"
                showDot={false}
                size="sm"
              >
                {frozen}
              </StatusBadge>
            )}
            {error > 0 && (
              <StatusBadge
                status="Error"
                showDot={false}
                size="sm"
              >
                {error}
              </StatusBadge>
            )}
            {user.instances.length === 0 && (
              <span className="text-gray-400">None</span>
            )}
          </div>
        )
      }
    },
    {
      key: "role",
      label: "Role",
      align: "center",
      render: (user) => (
        <div className="flex justify-center items-center">
          <span>
            {user.role.role_name}
          </span>
        </div>
      )
    },
    {
      key: "actions",
      label: "",
      render: (user) => (
        <div className="flex justify-center w-full">
          <Button
            label="View Instances"
            variant="secondary"
            size="small"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation()
              handleViewUserInstances(user)
            }}
          />
        </div>
      )
    }
  ], [isRowExpanded, getInstanceStatusCounts])

  const leftSection = useMemo(() => (
    <SearchBar
      onSearch={handleSearch}
      width="w-56 md:w-64 lg:w-80"
      placeholder="Search by username, email or role..."
    />
  ), [handleSearch])

  return (
    <>
      <TopNavbar
        leftSection={leftSection}
        stickyTop={true}
        variant="default"
      />
      <PageContainer
        title="User Management"
        subtitle="Manage system users and their instances"
        subtitleIcon={<UsersIcon className="w-4 h-4" />}
      >
        {error && (
          <div className="bg-red-500/20 text-red-200 p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        <Table
          columns={columns}
          data={users}
          isLoading={isLoading}
          keyExtractor={(user) => user.user_id}
          unit="user"
          emptyStateMessage="No users found"
          // Expandable rows props
          expandableRows={true}
          renderExpanded={(user: AdminUser) => (
            <InstancesContent
              instances={user.instances}
              username={user.username}
              navigateToInstanceDetail={navigateToInstanceDetail}
              getSortedInstances={getSortedInstances}
            />
          )}
          isRowExpanded={isRowExpanded}
          onRowExpand={handleRowExpand}
        />
      </PageContainer>
    </>
  )
}

export default React.memo(UserManagePage)
