import React, { ReactNode } from 'react';

interface ItemCardProps {
  title: string;
  rightHeader?: ReactNode;
  detailItems: {
    label: string;
    value: ReactNode;
  }[];
  actionButton?: {
    label: string;
    onClick: () => void;
  } | ReactNode;
  className?: string;
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
}) => {
  return (
    <div className={`bg-[#23375F] rounded-lg border border-blue-900/50 overflow-hidden shadow-sm ${className}`}>
      {/* Card Header */}
      <div className="flex justify-between items-center bg-[#192A51] py-2 px-4 border-b border-blue-900/30">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-white">{title}</span>
        </div>
        {rightHeader}
      </div>
      
      {/* Card Content */}
      <div className="p-3 text-sm">
        <div className="grid grid-cols-2 gap-y-2">
          {detailItems.map((item, index) => (
            <React.Fragment key={index}>
              <div className="text-gray-400">{item.label}</div>
              <div className="text-gray-200">{item.value}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Card Footer with Action Button */}
      {actionButton && (
        <div className="bg-[#192A51]/60 py-2 px-3 text-right border-t border-blue-900/30">
          {React.isValidElement(actionButton) ? (
            <div className="flex justify-end">
              {actionButton}
            </div>
          ) : (
            <button 
              className="text-blue-300 text-sm hover:text-blue-100 transition-colors"
              onClick={(actionButton as {onClick: () => void}).onClick}
            >
              {(actionButton as {label: string}).label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemCard; 