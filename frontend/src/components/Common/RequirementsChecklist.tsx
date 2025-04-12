import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export interface Requirement {
  key: string;
  label: string;
  passed: boolean;
}

export interface RequirementsChecklistProps {
  requirements: Requirement[];
  title?: string;
  icon?: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  iconSize?: 'sm' | 'md' | 'lg';
  className?: string;
  titleClassName?: string;
}

/**
 * A flexible component for displaying a list of requirements with pass/fail indicators
 * 
 * @param requirements - Array of requirement objects with key, label, and passed status
 * @param title - Optional title for the requirements section
 * @param icon - Optional icon to display next to the title
 * @param columns - Number of columns to display (1-4, default 2)
 * @param iconSize - Size of the check/x icons (sm, md, lg)
 * @param className - Additional CSS classes for the container
 * @param titleClassName - Additional CSS classes for the title
 */
const RequirementsChecklist: React.FC<RequirementsChecklistProps> = ({
  requirements,
  title,
  icon,
  columns = 2,
  iconSize = 'md',
  className = '',
  titleClassName = '',
}) => {
  // Determine the icon size class
  const getIconSizeClass = () => {
    switch (iconSize) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-6 h-6';
      case 'md':
      default: return 'w-5 h-5';
    }
  };

  // Determine grid columns class
  const getColumnsClass = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      case 2:
      default: return 'grid-cols-2';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <p className={`text-md text-white font-medium mb-2 flex items-center gap-2 ${titleClassName}`}>
          {icon && <span className="text-purple-400">{icon}</span>}
          {title}
        </p>
      )}
      <div className={`grid ${getColumnsClass()} gap-y-2 pl-2 mb-4`}>
        {requirements.map(({ key, label, passed }) => (
          <div 
            key={key} 
            className={`flex items-center py-1 transition-colors duration-200
              ${passed ? 'text-green-400' : 'text-gray-400'}`}
          >
            <div className="flex-shrink-0">
              {passed ? (
                <CheckCircleIcon className={getIconSizeClass()} />
              ) : (
                <XCircleIcon className={getIconSizeClass()} />
              )}
            </div>
            <span className="ml-2 text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequirementsChecklist; 