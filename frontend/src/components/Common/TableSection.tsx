import React from "react";
import Table, { TableProps } from "./Table";

interface TableSectionProps<T> extends TableProps<T> {
  title?: string;
  showHeader?: boolean;
  headerRight?: React.ReactNode;
  className?: string;
}

function TableSection<T>({
  title,
  showHeader = true,
  headerRight,
  className = "pt-10 px-8 pb-10",
  columns,
  data,
  isLoading = false,
  onRowClick,
  onAction,
  emptyStateMessage = "No items found",
  onCreateNew,
  keyExtractor = (_, index) => index.toString(),
}: TableSectionProps<T>) {
  // Default header right content - shows item count
  const defaultHeaderRight = (
    <p className="text-gray-300">
      Displaying {data.length} {data.length === 1 ? 'item' : 'items'}
    </p>
  );

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex justify-between items-center mb-6">
          {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}
          {headerRight || defaultHeaderRight}
        </div>
      )}

      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        onRowClick={onRowClick}
        onAction={onAction}
        emptyStateMessage={emptyStateMessage}
        onCreateNew={onCreateNew}
        keyExtractor={keyExtractor}
      />
    </div>
  );
}

export default React.memo(TableSection) as typeof TableSection;