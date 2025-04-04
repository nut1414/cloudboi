import React from "react"
import { Button } from "./Button/Button" // Import the unified Button component
import SkeletonLoader from "./SkeletonLoader" // Import the skeleton loader
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline" // Import the icon for the empty state

// Types for the table
export interface TableColumn<T> {
  key: string
  label: string
  width?: string
  render?: (item: T) => React.ReactNode
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
}

// Table Header component
interface TableHeaderProps {
  columns: TableColumn<any>[]
  isLoading?: boolean
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns, isLoading = false }) => (
  <div className={`grid grid-cols-${columns.length} text-gray-300 text-lg py-4 font-medium border-b border-blue-800/30 px-6 bg-[#192A51]`}
    style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
    {columns.map((column) => (
      <span
        key={column.key}
        className="flex justify-between items-center"
        style={column.width ? { width: column.width } : {}}
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

export const SkeletonRow: React.FC<SkeletonRowProps> = ({ columns }) => (
  <div
    className="grid text-gray-300 bg-[#23375F] border-b border-blue-800/30 py-3 px-6"
    style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
  >
    {columns.map((column, idx) => (
      <span
        key={`skeleton-${column.key}-${idx}`}
        className="flex justify-between items-center"
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

// Use the shared Button component instead of ActionButton
export const ActionButton = Button // For backward compatibility

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
}: TableProps<T>) {
  // Render a table row
  const renderRow = React.useCallback((item: T, index: number) => {
    const rowKey = typeof keyExtractor === 'function'
      ? keyExtractor(item, index)
      : index.toString()

    return (
      <div
        key={rowKey}
        className={`grid text-gray-300 bg-[#23375F] hover:bg-blue-800 transition-colors border-b border-blue-800/30 py-3 px-6 ${onRowClick ? 'cursor-pointer' : ''}`}
        style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
        onClick={() => onRowClick && onRowClick(item)}
      >
        {columns.map((column) => (
          <span
            key={`${rowKey}-${column.key}`}
            className="flex justify-between items-center"
          >
            {column.render
              ? column.render(item)
              : (item as any)[column.key] !== undefined
                ? String((item as any)[column.key])
                : ''}
          </span>
        ))}
      </div>
    )
  }, [columns, onRowClick, keyExtractor])

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

export default React.memo(Table) as typeof Table