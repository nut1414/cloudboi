import React, { useState, ReactNode, useEffect, useRef, useMemo, useCallback } from "react"
import { Button } from "./Button/Button" // Import the unified Button component
import SkeletonLoader from "./SkeletonLoader" // Import the skeleton loader
import { ArchiveBoxXMarkIcon, ChevronRightIcon } from "@heroicons/react/24/outline" // Import the icons
import { useTestId } from "../../utils/testUtils"

// Types for the table
export interface TableColumn<T> {
  key: string
  label: string
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

export const TableHeader: React.FC<TableHeaderProps> = React.memo(({ columns, isLoading = false }) => {
  return (
    <thead className="bg-[#192A51]">
      <tr className="text-gray-300 text-lg font-medium border-b border-blue-800/30">
        {columns.map((column, index) => (
          <th
            key={column.key}
            className={`py-4 ${index === 0 ? 'pl-8 pr-4' : 'px-4'} ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
          >
            {isLoading ? (
              <SkeletonLoader height="h-6" width="w-24" />
            ) : (
              column.label
            )}
          </th>
        ))}
      </tr>
    </thead>
  )
})

// Empty State component
interface EmptyStateProps {
  message?: string
  onCreateNew?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(({
  message = "No items found",
  onCreateNew
}) => (
  <tr>
    <td colSpan={100} className="py-12 bg-[#23375F] text-gray-300">
      <div className="flex flex-col items-center justify-center">
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
    </td>
  </tr>
))

// Skeleton Row component
interface SkeletonRowProps {
  columns: TableColumn<any>[]
}

export const SkeletonRow: React.FC<SkeletonRowProps> = React.memo(({ columns }) => {
  return (
    <tr className="text-gray-300 bg-[#23375F] border-b border-blue-800/30">
      {columns.map((column, idx) => (
        <td
          key={`skeleton-${column.key}-${idx}`}
          className={`py-3 ${idx === 0 ? 'pl-8 pr-4' : 'px-4'} ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
        >
          <SkeletonLoader
            height="h-4"
            width={idx === 0 ? "w-32" : "w-20"}
            rounded="rounded-md"
          />
        </td>
      ))}
    </tr>
  )
})

// Use the shared Button component instead of ActionButton
export const ActionButton = Button // For backward compatibility

// Grid for cards in expanded rows
export interface CardGridProps {
  children: ReactNode
  className?: string
}

export const CardGrid: React.FC<CardGridProps> = React.memo(({ children, className = '' }) => {
  return (
    <div className={`grid gap-3 grid-cols-1 md:grid-cols-2 mt-2 ${className}`}>
      {React.Children.map(children, (child) => (
        <div className="flex-1">
          {child}
        </div>
      ))}
    </div>
  )
})

// Animated Expandable Row
interface ExpandableRowProps {
  columns: number
  isExpanded: boolean
  children: React.ReactNode
}

const ExpandableRow: React.FC<ExpandableRowProps> = React.memo(({ columns, isExpanded, children }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (contentRef.current) {
      const updateHeight = () => {
        const contentHeight = contentRef.current?.scrollHeight || 0
        setHeight(isExpanded ? contentHeight : 0)
      }

      // Set height initially
      updateHeight()

      // Add resize observer to handle dynamic content changes
      const resizeObserver = new ResizeObserver(() => {
        if (isExpanded) {
          updateHeight()
        }
      })

      resizeObserver.observe(contentRef.current)

      return () => {
        if (contentRef.current) {
          resizeObserver.unobserve(contentRef.current)
        }
      }
    }
  }, [isExpanded, children])

  return (
    <tr className="bg-[#192A51]/90 border-b border-indigo-600/30 overflow-hidden">
      <td colSpan={columns} className="p-0 transition-all duration-300 ease-in-out">
        <div
          style={{ maxHeight: height ? `${height}px` : '0px' }}
          className="overflow-hidden transition-all duration-300 ease-in-out"
        >
          <div
            ref={contentRef}
            className={`px-6 transition-opacity duration-300 ${isExpanded ? 'opacity-100 py-4' : 'opacity-0'}`}
          >
            {children}
          </div>
        </div>
      </td>
    </tr>
  )
})

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
  ...restProps
}: TableProps<T>) {
  const { dataTestId } = useTestId(restProps)

  // Internal expanded state if not provided externally
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const tableRef = useRef<HTMLDivElement>(null)

  // Handle row click for expansion
  const handleRowClick = useCallback((item: T, index: number) => {
    const rowKey = typeof keyExtractor === 'function'
      ? keyExtractor(item, index)
      : index.toString()

    if (expandableRows && renderExpanded) {
      // Toggle expansion
      const newState = !isRowExpanded(item)

      // If external control is provided, use it
      if (onRowExpand) {
        onRowExpand(item, newState)
      }
      // Otherwise use internal state
      else {
        setExpandedRows(prev => ({
          ...prev,
          [rowKey]: newState
        }))
      }
    }
    // Regular row click handler
    else if (onRowClick) {
      onRowClick(item)
    }
  }, [expandableRows, renderExpanded, isRowExpanded, onRowExpand, onRowClick, keyExtractor])

  // Check if a row is expanded
  const checkRowExpanded = useCallback((item: T, index: number): boolean => {
    if (!expandableRows) return false

    const rowKey = typeof keyExtractor === 'function'
      ? keyExtractor(item, index)
      : index.toString()

    // Use external control if provided
    if (onRowExpand) {
      return isRowExpanded(item)
    }

    // Otherwise use internal state
    return expandedRows[rowKey] || false
  }, [expandableRows, isRowExpanded, onRowExpand, expandedRows, keyExtractor])

  // Render a table row with possible expanded content
  const renderRow = useCallback((item: T, index: number) => {
    const rowKey = typeof keyExtractor === 'function'
      ? keyExtractor(item, index)
      : index.toString()

    const isExpanded = checkRowExpanded(item, index)

    return (
      <React.Fragment key={`row-fragment-${rowKey}`}>
        <tr
          key={rowKey}
          className={`text-gray-300 bg-[#23375F] hover:bg-blue-800/80 transition-colors border-b ${isExpanded ? 'border-indigo-600/50' : 'border-blue-800/30'} ${onRowClick || expandableRows ? 'cursor-pointer' : ''} ${isExpanded ? 'bg-[#2A3C69]' : ''}`}
          onClick={() => handleRowClick(item, index)}
          data-testid={dataTestId ? `${dataTestId}-table-row-${rowKey}` : undefined}
        >
          {columns.map((column, idx) => (
            <td
              key={`${rowKey}-${column.key}`}
              className={`py-3 ${idx === 0 ? 'pl-8 pr-4' : 'px-4'} overflow-hidden ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
            >
              {column.render
                ? column.render(item)
                : (item as any)[column.key] !== undefined
                  ? String((item as any)[column.key])
                  : ''}
            </td>
          ))}
        </tr>

        {/* Always render the expandable row but control its height */}
        {expandableRows && renderExpanded && (
          <ExpandableRow
            columns={columns.length}
            isExpanded={isExpanded}
          >
            {renderExpanded(item)}
          </ExpandableRow>
        )}
      </React.Fragment>
    )
  }, [columns, onRowClick, keyExtractor, expandableRows, renderExpanded, checkRowExpanded, handleRowClick])

  // Render skeleton rows
  const renderSkeletonRows = useCallback(() => {
    return Array(skeletonRowCount).fill(0).map((_, index) => (
      <SkeletonRow key={`skeleton-row-${index}`} columns={columns} />
    ))
  }, [columns, skeletonRowCount])

  return (
    <>
      <p className="text-gray-300 justify-self-end mb-2 text-sm">
        Displaying {data.length} {data.length === 1 ? unit : `${unit}s`}
      </p>
      <div
        className="bg-[#192A51] rounded-xl shadow-lg overflow-hidden border border-blue-900/50"
        ref={tableRef}
      >
        <table className="w-full table-auto">
          {/* Header Row - always visible but with skeleton content when loading */}
          <TableHeader columns={columns} isLoading={isLoading} />

          {/* Content */}
          <tbody>
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
          </tbody>
        </table>
      </div>
    </>
  )
}

// Expansion indicator component
export const ExpandIndicator: React.FC<{ isExpanded: boolean, className?: string }> = React.memo(({
  isExpanded,
  className = ""
}) => (
  <span className={`text-indigo-300 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} ${className}`}>
    <ChevronRightIcon className="h-4 w-4" />
  </span>
))

export default React.memo(Table) as typeof Table