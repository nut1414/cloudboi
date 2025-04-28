import React, { ReactNode, useState, useEffect, useRef, useCallback, memo, useMemo } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import SkeletonLoader from './SkeletonLoader'
import { useTestId } from '../../utils/testUtils'

export interface ItemCardProps {
  title: string
  rightHeader?: ReactNode
  detailItems: {
    label: string
    value: ReactNode
  }[]
  actionButton?: {
    label: string
    onClick: () => void
  } | ReactNode
  className?: string
  isCollapsible?: boolean
  isCollapsed?: boolean
  onCollapseToggle?: () => void
  isLoading?: boolean
}

/**
 * Internal skeleton loader for ItemCard
 */
const ItemCardSkeleton: React.FC<{ detailItemCount?: number }> = ({ detailItemCount = 4 }) => {
  return (
    <>
      {/* Card Header Skeleton */}
      <div className="flex justify-between items-center bg-[#192A51] py-2 px-4 border-b border-blue-900/30">
        <div className="flex items-center space-x-2">
          <SkeletonLoader height="h-5" width="w-5" rounded="rounded-full" variant="light" />
          <SkeletonLoader height="h-5" width="w-40" variant="light" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonLoader height="h-5" width="w-5" rounded="rounded-full" variant="light" />
          <SkeletonLoader height="h-5" width="w-24" variant="light" />
        </div>
      </div>

      {/* Card Content Skeleton */}
      <div className="p-3 text-sm">
        <div className="grid grid-cols-2 gap-y-2">
          {Array(detailItemCount).fill(0).map((_, i) => (
            <React.Fragment key={i}>
              <SkeletonLoader height="h-4" width="w-20" className="mb-1" variant="light" />
              <div className="flex items-center justify-between">
                <SkeletonLoader height="h-5" width="w-24" rounded="rounded-full" variant="light" />
                <SkeletonLoader height="h-4" width="w-16" variant="light" />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Footer Skeleton - Only show if we'd have an action button */}
      <div className="bg-[#192A51]/60 py-2 px-3 text-right border-t border-blue-900/30">
        <SkeletonLoader height="h-8" width="w-24" className="ml-auto" variant="light" />
      </div>
    </>
  )
}

/**
 * A reusable card component for displaying item details
 * Used for instances, users, and other entities in the system
 */
const ItemCard: React.FC<ItemCardProps> = ({
  title,
  rightHeader,
  detailItems,
  actionButton,
  className = '',
  isCollapsible = false,
  isCollapsed = false,
  onCollapseToggle = () => { },
  isLoading = false,
  ...restProps
}) => {
  const { dataTestId } = useTestId(restProps)

  // Ref for content height calculation
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number>(0)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // Calculate content height when visibility changes
  const updateHeight = useCallback(() => {
    if (contentRef.current && !isCollapsed) {
      setContentHeight(contentRef.current.scrollHeight || 0)
    }
  }, [isCollapsed])

  // Setup and cleanup resize observer
  useEffect(() => {
    if (contentRef.current) {
      // Clean up previous observer if it exists
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }

      // Create new observer
      resizeObserverRef.current = new ResizeObserver(() => {
        if (!isCollapsed) {
          updateHeight()
        }
      })

      // Start observing
      resizeObserverRef.current.observe(contentRef.current)

      // Initial height calculation
      updateHeight()

      return () => {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect()
        }
      }
    }
  }, [isCollapsed, updateHeight])

  // Handle toggle click
  const handleToggleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCollapsible) {
      onCollapseToggle()
    }
  }, [isCollapsible, onCollapseToggle])

  // Memoize detail items rendering
  const renderedDetailItems = useMemo(() => {
    return detailItems.map((item, index) => (
      <React.Fragment key={index}>
        <div className="text-gray-400">{item.label}</div>
        <div className="text-gray-200">{item.value}</div>
      </React.Fragment>
    ))
  }, [detailItems])

  // Memoize action button rendering
  const renderedActionButton = useMemo(() => {
    if (!actionButton) return null

    if (React.isValidElement(actionButton)) {
      return (
        <div className="flex justify-end" onClick={e => e.stopPropagation()}>
          {actionButton}
        </div>
      )
    }

    return (
      <button
        className="text-blue-300 text-sm hover:text-blue-100 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          (actionButton as { onClick: () => void }).onClick()
        }}
      >
        {(actionButton as { label: string }).label}
      </button>
    )
  }, [actionButton])

  return (
    <div className={`bg-[#23375F] rounded-lg border border-blue-900/50 overflow-hidden shadow-sm ${className}`}
      data-testid={dataTestId ? `${dataTestId}-item-card` : undefined}
    >
      {isLoading ? (
        // Show the skeleton loader when loading
        <ItemCardSkeleton detailItemCount={detailItems.length || 4} />
      ) : (
        <>
          {/* Card Header */}
          <div
            className={`flex justify-between items-center bg-[#192A51] py-2 px-4 border-b border-blue-900/30 ${isCollapsible ? 'cursor-pointer' : ''}`}
            onClick={handleToggleClick}
            data-testid={dataTestId ? `${dataTestId}-item-card-header` : undefined}
          >
            <div className="flex items-center space-x-2">
              {isCollapsible && (
                <span className="text-gray-400">
                  {isCollapsed ?
                    <ChevronRightIcon className="w-4 h-4" /> :
                    <ChevronDownIcon className="w-4 h-4" />
                  }
                </span>
              )}
              <span className="font-medium text-white">{title}</span>
            </div>
            {rightHeader}
          </div>

          {/* Card Content with height transition */}
          <div
            style={{
              maxHeight: isCollapsed ? '0px' : `${contentHeight}px`,
              opacity: isCollapsed ? 0 : 1,
              overflow: 'hidden',
              transition: 'max-height 0.3s ease-in-out, opacity 0.2s ease-in-out'
            }}
          >
            <div ref={contentRef}>
              {/* Details */}
              <div className="p-3 text-sm">
                <div className="grid grid-cols-2 gap-y-2">
                  {renderedDetailItems}
                </div>
              </div>

              {/* Footer with Action Button */}
              {actionButton && (
                <div className="bg-[#192A51]/60 py-2 px-3 text-right border-t border-blue-900/30">
                  {renderedActionButton}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default memo(ItemCard) 