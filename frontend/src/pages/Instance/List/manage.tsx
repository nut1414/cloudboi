import React, { useState } from "react";
import TopNavbar,{NavButton} from "../../../components/Navbar/TopNavbar";
import TableSection from "../../../components/Common/TableSection";
import { ActionButton, StatusBadge, TableColumn } from "../../../components/Common/Table";
import { UserInstances } from "../../../constant/PlaceHolderData";
import { Icon } from "../../../assets/Icon";
import { useParams,useNavigate } from "react-router-dom";

interface InstanceListPageProps {
    instances?: any[];
    isLoading?: boolean;
    onSearch?: (query: string) => void;
    onCreateInstance?: () => void;
    onViewInstance?: (instance: any) => void;
    onInstanceAction?: (action: string, instance: any) => void;
    title?: string;
    showTopNav?: boolean;
    topNavProps?: any;
    className?: string;
    emptyStateMessage?: string;
}

function InstanceListPage({
    instances = UserInstances, // Default to the constant if not provided
    isLoading = false,
    onSearch,
    title = "Instance Management",
    showTopNav = true,
}: InstanceListPageProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { userName } = useParams<{ userName: string }>();

    const onCreateInstance = () => {
        // Navigate to the create instance page
        navigate(`/user/${userName}/instance/create`);
    }

    const onViewInstance = (instance: any) => {
        // Navigate to the instance details page
        navigate(`/user/${userName}/instance/${instance}`);
    }

    const onInstanceAction = (action: string, instance: any) => {
        // Handle instance actions
    }

    // Apply filtering directly based on search query
    const filteredInstances = React.useMemo(() => {
        if (!searchQuery.trim()) {
            return instances;
        }

        const lowercaseQuery = searchQuery.toLowerCase();
        return instances.filter(instance =>
            (instance.name && instance.name.toLowerCase().includes(lowercaseQuery)) ||
            (instance.os && instance.os.toLowerCase().includes(lowercaseQuery)) ||
            (instance.type && instance.type.toLowerCase().includes(lowercaseQuery)) ||
            (instance.usage && instance.usage.toLowerCase().includes(lowercaseQuery)) ||
            (instance.status && instance.status.toLowerCase().includes(lowercaseQuery))
        );
    }, [searchQuery, instances]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (onSearch) onSearch(query);
    };

    // Define table columns with rendering functions
    const columns: TableColumn<any>[] = [
        { key: 'name', label: 'Name' },
        { key: 'os', label: 'OS' },
        { key: 'usage', label: 'Usage' },
        { key: 'type', label: 'Instance Type' },
        { 
            key: 'status', 
            label: 'Status',
            render: (instance) => <StatusBadge status={instance.status} />
        },
        { 
            key: 'actions', 
            label: 'Actions',
            render: (instance) => (
                <span className="flex space-x-2">
                    <ActionButton
                        label="View"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewInstance(instance);
                        }}
                        className="py-1 text-sm bg-blue-800 hover:bg-blue-700 text-white" // Updated colors
                    />
                    <button
                        className="text-gray-300 hover:text-white transition-colors" // Updated colors
                        onClick={(e) => {
                            e.stopPropagation();
                            onInstanceAction && onInstanceAction('menu', instance);
                        }}
                    >
                        {Icon.ThreeDots}
                    </button>
                </span>
            )
        }
    ];

    return (
        <>
            {showTopNav && (
                <TopNavbar
                    
                    onSearch={handleSearch}
                    actions={[
                        <NavButton
                            onClick={onCreateInstance}
                            label="Create Instance"
                            variant="secondary"
                            icon={Icon.Plus}
                        />
                    ]}
                />
            )}
            
            {/* Use the new TableSection component */}
            <TableSection
                title={title}
                columns={columns}
                data={filteredInstances}
                isLoading={isLoading}
                onRowClick={onViewInstance}
                emptyStateMessage={"No instances found matching your criteria"}
                onCreateNew={onCreateInstance}
                keyExtractor={(instance) => instance.id || instance.name}
            />
        </>
    );
}

export default React.memo(InstanceListPage);