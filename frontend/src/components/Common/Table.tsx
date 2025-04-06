import React, { useState, ReactNode } from "react"
import { Button } from "./Button/Button" // Import the unified Button component
import SkeletonLoader from "./SkeletonLoader" // Import the skeleton loader
import { ArchiveBoxXMarkIcon, ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline" // Import the icons

// Types for the table
export interface TableColumn<T> {
  key: string
  label: string
  width?: string
  render?: (item: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

export interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  isLoading?: boolean
  onRowClick?: (item: T) => void
  onAction?: (action: string, item: T) => void
  emptyStateMessage?: string
  onCreateNew?: () => void
  keyExtractor?: (item: T, index: number) => string
  skeletonRowCount?: number // Number of skeleton rows to show while loading
  unit?: string
  // Support for expandable rows
  expandableRows?: boolean
  renderExpanded?: (item: T) => React.ReactNode
  isRowExpanded?: (item: T) => boolean
  onRowExpand?: (item: T, isExpanded: boolean) => void
}

// Table Header component
interface TableHeaderProps {
  columns: TableColumn<any>[]
  isLoading?: boolean
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns, isLoading = false }) => {
  // Create the grid template columns based on width properties
  const gridTemplateColumns = React.useMemo(() => {
    return columns.map(col => {
      // If the width is a digit-based value (like px, rem, etc.), use it directly
      if (col.width && /^[0-9]+/.test(col.width)) {
        return col.width;
      }
      // Otherwise use fraction units
      return col.width || '1fr';
    }).join(' ');
  }, [columns]);

  return (
    <div 
      className="grid gap-4 text-gray-300 text-lg py-4 font-medium border-b border-blue-800/30 px-6 bg-[#192A51]"
      style={{ gridTemplateColumns }}
    >
      {columns.map((column) => (
        <span
          key={column.key}
          className={`flex items-center ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : 'justify-start'}`}
        >
          {isLoading ? (
            <SkeletonLoader height="h-6" width="w-24" />
          ) : (
            column.label
          )}
        </span>
      ))}
    </div>
  )
}

// Empty State component
interface EmptyStateProps {
  message?: string
  onCreateNew?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No items found",
  onCreateNew
}) => (
  <div className="flex flex-col items-center justify-center py-12 bg-[#23375F] text-gray-300">
    <ArchiveBoxXMarkIcon className="w-16 h-16 text-gray-400 mb-4" />
    <p className="text-gray-300 mb-4">{message}</p>
    {onCreateNew && (
      <Button
        variant="purple"
        label="Create New"
        onClick={onCreateNew}
      />
    )}
  </div>
)

// Skeleton Row component
interface SkeletonRowProps {
  columns: TableColumn<any>[]
}

export const SkeletonRow: React.FC<SkeletonRowProps> = ({ columns }) => {
  // Create the grid template columns based on width properties
  const gridTemplateColumns = React.useMemo(() => {
    return columns.map(col => {
      // If the width is a digit-based value (like px, rem, etc.), use it directly
      if (col.width && /^[0-9]+/.test(col.width)) {
        return col.width;
      }
      // Otherwise use fraction units
      return col.width || '1fr';
    }).join(' ');
  }, [columns]);

  return (
    <div
      className="grid gap-4 text-gray-300 bg-[#23375F] border-b border-blue-800/30 py-3 px-6"
      style={{ gridTemplateColumns }}
    >
      {columns.map((column, idx) => (
        <span
          key={`skeleton-${column.key}-${idx}`}
          className={`flex items-center ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : 'justify-start'}`}
        >
          <SkeletonLoader
            height="h-4"
            width={idx === 0 ? "w-32" : "w-20"}
            rounded="rounded-md"
          />
        </span>
      ))}
    </div>
  )
}

// Use the shared Button component instead of ActionButton
export const ActionButton = Button // For backward compatibility

// Grid for cards in expanded rows
export interface CardGridProps {
  children: ReactNode;
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({ children, className = '' }) => {
  return (
    <div className={`grid gap-3 grid-cols-1 md:grid-cols-2 mt-2 ${className}`}>
      {children}
    </div>
  );
};

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
  skeletonRowCount = 5,
  unit = "item",
  // Support for expandable rows
  expandableRows = false,
  renderExpanded,
  isRowExpanded = () => false,
  onRowExpand,
}: TableProps<T>) {
  // Create the grid template columns based on width properties
  const gridTemplateColumns = React.useMemo(() => {
    return columns.map(col => {
      // If the width is a digit-based value (like px, rem, etc.), use it directly
      if (col.width && /^[0-9]+/.test(col.width)) {
        return col.width;
      }
      // Otherwise use fraction units
      return col.width || '1fr';
    }).join(' ');
  }, [columns]);

  // Internal expanded state if not provided externally
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Handle row click for expansion
  const handleRowClick = (item: T, index: number) => {
    const rowKey = typeof keyExtractor === 'function'
      ? keyExtractor(item, index)
      : index.toString();

    if (expandableRows && renderExpanded) {
      // Toggle expansion
      const newState = !isRowExpanded(item);
      
      // If external control is provided, use it
      if (onRowExpand) {
        onRowExpand(item, newState);
      } 
      // Otherwise use internal state
      else {
        setExpandedRows(prev => ({
          ...prev,
          [rowKey]: newState
        }));
      }
    } 
    // Regular row click handler
    else if (onRowClick) {
      onRowClick(item);
    }
  };

  // Check if a row is expanded
  const checkRowExpanded = (item: T, index: number): boolean => {
    if (!expandableRows) return false;
    
    const rowKey = typeof keyExtractor === 'function'
      ? keyExtractor(item, index)
      : index.toString();
      
    // Use external control if provided
    if (onRowExpand) {
      return isRowExpanded(item);
    }
    
    // Otherwise use internal state
    return expandedRows[rowKey] || false;
  };

  // Render a table row with possible expanded content
  const renderRow = React.useCallback((item: T, index: number) => {
    const rowKey = typeof keyExtractor === 'function'
      ? keyExtractor(item, index)
      : index.toString();
    
    const isExpanded = checkRowExpanded(item, index);

    return (
      <React.Fragment key={`row-fragment-${rowKey}`}>
        <div
          key={rowKey}
          className={`grid gap-4 text-gray-300 bg-[#23375F] hover:bg-blue-800/80 transition-colors border-b ${isExpanded ? 'border-indigo-600/50' : 'border-blue-800/30'} py-3 px-6 ${onRowClick || expandableRows ? 'cursor-pointer' : ''} ${isExpanded ? 'bg-[#2A3C69]' : ''}`}
          style={{ gridTemplateColumns }}
          onClick={() => handleRowClick(item, index)}
        >
          {columns.map((column) => (
            <span
              key={`${rowKey}-${column.key}`}
              className={`flex items-center overflow-hidden ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : 'justify-start'}`}
            >
              {column.render
                ? column.render(item)
                : (item as any)[column.key] !== undefined
                  ? String((item as any)[column.key])
                  : ''}
            </span>
          ))}
        </div>
        
        {/* Expanded content with transition */}
        {expandableRows && renderExpanded && (
          <div 
            className={`transition-all duration-300 ease-in-out overflow-hidden
              ${isExpanded 
                ? 'max-h-[2000px] border-b border-indigo-600/30 bg-[#192A51]/90 py-4 opacity-100' 
                : 'max-h-0 py-0 border-transparent opacity-0'}`}
          >
            {isExpanded && (
              <div className="px-6 pb-2">
                {renderExpanded(item)}
              </div>
            )}
          </div>
        )}
      </React.Fragment>
    )
  }, [columns, onRowClick, keyExtractor, gridTemplateColumns, expandableRows, renderExpanded, isRowExpanded, onRowExpand, expandedRows])

  // Render skeleton rows
  const renderSkeletonRows = React.useCallback(() => {
    return Array(skeletonRowCount).fill(0).map((_, index) => (
      <SkeletonRow key={`skeleton-row-${index}`} columns={columns} />
    ))
  }, [columns, skeletonRowCount])

  return (
    <>
      <p className="text-gray-300 justify-self-end mb-2 text-sm">
        Displaying {data.length} {data.length === 1 ? unit : `${unit}s`}
      </p>
      <div className="bg-[#192A51] rounded-xl shadow-lg overflow-hidden border border-blue-900/50">
        {/* Header Row - always visible but with skeleton content when loading */}
        <TableHeader columns={columns} isLoading={isLoading} />

        {/* Content */}
        {isLoading ? (
          // Show skeleton rows instead of the spinning loader
          renderSkeletonRows()
        ) : data.length === 0 ? (
          <EmptyState
            message={emptyStateMessage}
            onCreateNew={onCreateNew}
          />
        ) : (
          data.map(renderRow)
        )}
      </div>
    </>
  )
}

// Expansion indicator component
export const ExpandIndicator: React.FC<{ isExpanded: boolean, className?: string }> = ({ 
  isExpanded, 
  className = "" 
}) => (
  <span className={`text-indigo-300 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} ${className}`}>
    <ChevronRightIcon className="h-4 w-4" />
  </span>
);

export default React.memo(Table) as typeof Table