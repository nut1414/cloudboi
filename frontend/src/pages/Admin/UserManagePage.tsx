// pages/Admin/UserManagePage.tsx
import React from "react"
import { AdminUser, UserInstance } from "../../client/types.gen"
import Table, { TableColumn, ExpandIndicator, CardGrid } from "../../components/Common/Table"
import PageContainer from "../../components/Layout/PageContainer"
import TopNavbar from "../../components/Common/Navbar/TopNavbar"
import { UsersIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import InputField from "../../components/Common/InputField"
import StatusBadge from "../../components/Common/StatusBadge"
import Button from "../../components/Common/Button/Button"
import { useUserManage } from "../../hooks/Admin/useUserManage"
import ItemCard from "../../components/Common/ItemCard"

// SearchBar component reusing our InputField - styled like InstanceListPage
interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
  initialValue?: string
  width?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search by username...",
  onSearch = () => { },
  className = "",
  initialValue = "",
  width = "w-64",
}) => {
  const [query, setQuery] = React.useState(initialValue)

  const handleInputChange = (newQuery: string) => {
    setQuery(newQuery)
    onSearch(newQuery)
  }

  return (
    <div className={`${className} ${width}`}>
      <InputField
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        endIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
      />
    </div>
  )
}

// Content for expanded rows - instances in card layout
const InstancesContent = ({ 
  instances, 
  username, 
  navigateToInstanceDetail, 
  getSortedInstances 
}: { 
  instances: UserInstance[], 
  username: string,
  navigateToInstanceDetail: (username: string, instance: UserInstance) => void,
  getSortedInstances: (instances: UserInstance[]) => UserInstance[]
}) => {
  
  if (instances.length === 0) {
    return <div className="text-gray-400 italic py-2">No instances found</div>
  }

  // Get sorted instances by status
  const sortedInstances = getSortedInstances(instances)

  return (
    <CardGrid>
      {sortedInstances.map(instance => (
        <ItemCard
          key={instance.instance_id || instance.hostname}
          title={instance.hostname}
          rightHeader={<StatusBadge status={instance.status} />}
          detailItems={[
            { label: "Plan ID", value: instance.instance_plan_id.toString() },
            { label: "OS Type", value: instance.os_type_id.toString() },
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
              onClick={() => navigateToInstanceDetail(username, instance)}
            />
          }
        />
      ))}
    </CardGrid>
  )
}

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
  const columns: TableColumn<AdminUser>[] = [
    {
      key: "expand",
      label: "",
      render: (user) => <ExpandIndicator isExpanded={isRowExpanded(user)} />,
      width: "20px"
    },
    {
      key: "username",
      label: "Username",
      width: "1fr",
      render: (user) => (
        <div className="truncate max-w-full" title={user.username}>
          {user.username}
        </div>
      )
    },
    {
      key: "email",
      label: "Email",
      width: "1fr",
      render: (user) => (
        <div className="truncate max-w-full" title={user.email}>
          {user.email}
        </div>
      )
    },
    {
      key: "instances_count",
      label: "No. of Instances",
      width: "1fr",
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
      width: "1fr",
      render: (user) => {
        const { running, stopped, frozen, error } = getInstanceStatusCounts(user.instances)
        
        return (
          <div className="flex items-center space-x-2 flex-wrap">
            {running > 0 && (
              <StatusBadge 
                status="Running" 
                variant="table-status"
                showDot={false}
                size="sm"
              >
                {running}
              </StatusBadge>
            )}
            {stopped > 0 && (
              <StatusBadge 
                status="Stopped" 
                variant="table-status"
                showDot={false}
                size="sm"
              >
                {stopped}
              </StatusBadge>
            )}
            {frozen > 0 && (
              <StatusBadge 
                status="Frozen" 
                variant="table-status"
                showDot={false}
                size="sm"
              >
                {frozen}
              </StatusBadge>
            )}
            {error > 0 && (
              <StatusBadge 
                status="Error" 
                variant="table-status"
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
        );
      }
    },
    {
      key: "role",
      label: "Role",
      width: "1fr",
      render: (user) => (
        <div className="flex justify-center items-center">
          <span className={user.role.role_name === 'admin' ? 'text-purple-300' : 'text-blue-300'}>
            {user.role.role_name}
          </span>
        </div>
      )
    },
    {
      key: "actions",
      label: "",
      width: "120px",
      render: (user) => (
        <div className="flex justify-center w-full">
          <Button 
            label="View Instances"
            variant="table-action"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              handleViewUserInstances(user);
            }}
          />
        </div>
      )
    }
  ];

  // Define top navbar leftSection
  const leftSection = (
    <SearchBar
      onSearch={handleSearch}
      width="w-56 md:w-64 lg:w-80"
      placeholder="Search by username, email or role..."
    />
  );

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
        maxWidth="max-w-[1200px]"
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
          renderExpanded={renderExpandedContent}
          isRowExpanded={isRowExpanded}
          onRowExpand={handleRowExpand}
        />
      </PageContainer>
    </>
  )

  // Render expanded row content
  function renderExpandedContent(user: AdminUser) {
    return (
      <InstancesContent 
        instances={user.instances} 
        username={user.username} 
        navigateToInstanceDetail={navigateToInstanceDetail} 
        getSortedInstances={getSortedInstances} 
      />
    )
  }
}

export default React.memo(UserManagePage)
