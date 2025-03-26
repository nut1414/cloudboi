import React from "react";

// Types for the table
export interface TableColumn<T> {
  key: string;
  label: string;
  width?: string;
  render?: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  onAction?: (action: string, item: T) => void;
  emptyStateMessage?: string;
  onCreateNew?: () => void;
  keyExtractor?: (item: T, index: number) => string;
}

// Table Header component
interface TableHeaderProps {
  columns: TableColumn<any>[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns }) => (
  <div className="grid grid-cols-6 text-gray-300 text-lg py-4 font-medium border-b border-blue-800/30 px-6 bg-[#192A51]">
    {columns.map((column) => (
      <span key={column.key} style={column.width ? { width: column.width } : {}}>
        {column.label}
      </span>
    ))}
  </div>
);

// Status Badge component
interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles = {
    Running: "bg-green-700 text-green-100",
    Stopped: "bg-red-700 text-red-100",
    Pending: "bg-yellow-700 text-yellow-100",
    Failed: "bg-gray-700 text-gray-100",
    Completed: "bg-green-700 text-green-100",
    Processing: "bg-blue-700 text-blue-100",
    Cancelled: "bg-red-700 text-red-100",
  };

  const style = statusStyles[status as keyof typeof statusStyles] || "bg-gray-700 text-gray-100";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
};

// Empty State component
interface EmptyStateProps {
  message?: string;
  onCreateNew?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No items found",
  onCreateNew
}) => (
  <div className="flex flex-col items-center justify-center py-12 bg-[#23375F] rounded-xl text-gray-300">
    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
    </svg>
    <p className="text-gray-300 mb-4">{message}</p>
    {onCreateNew && (
      <button
        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
        onClick={onCreateNew}
      >
        Create New
      </button>
    )}
  </div>
);

// Loading State component
export const LoadingState: React.FC = () => (
  <div className="flex justify-center items-center py-12 bg-[#23375F] rounded-xl">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

// Default action button component
interface ActionButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; 
  className?: string;
  icon?: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  label, 
  onClick, 
  className = "",
  icon 
}) => (
  <button
    onClick={onClick}
    className={`bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center space-x-1 ${className}`}
  >
    {icon && <span>{icon}</span>}
    <span>{label}</span>
  </button>
);

// Generic Table component
function Table<T>({
  columns,
  data,
  isLoading = false,
  onRowClick,
  onAction,
  emptyStateMessage = "No items found",
  onCreateNew,
  keyExtractor = (_, index) => index.toString(),
}: TableProps<T>) {
  // Render a table row
  const renderRow = React.useCallback((item: T, index: number) => {
    const rowKey = typeof keyExtractor === 'function'
      ? keyExtractor(item, index)
      : index.toString();

    return (
      <div
        key={rowKey}
        className={`grid grid-cols-6 text-gray-300 bg-[#23375F] hover:bg-blue-800 transition-colors border-b border-blue-800/30 py-3 px-6 ${onRowClick ? 'cursor-pointer' : ''}`}
        onClick={() => onRowClick && onRowClick(item)}
      >
        {columns.map((column) => (
          <span key={`${rowKey}-${column.key}`}>
            {column.render 
              ? column.render(item)
              : (item as any)[column.key] !== undefined 
                ? String((item as any)[column.key]) 
                : ''}
          </span>
        ))}
      </div>
    );
  }, [columns, onRowClick, keyExtractor]);

  return (
    <div className="bg-[#192A51] rounded-xl shadow-lg overflow-hidden border border-blue-900/50">
      {/* Header Row */}
      <TableHeader columns={columns} />

      {/* Content - shows either loading, empty state, or items */}
      {isLoading ? (
        <LoadingState />
      ) : data.length === 0 ? (
        <EmptyState
          message={emptyStateMessage}
          onCreateNew={onCreateNew}
        />
      ) : (
        data.map(renderRow)
      )}
    </div>
  );
}

export default React.memo(Table) as typeof Table;