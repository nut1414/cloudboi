// components/Common/Dropdown.tsx
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export interface DropdownOption {
  id: string | number;
  label: ReactNode;
  value: any;
}

interface DropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  selectedOption?: DropdownOption;
  onSelect: (option: DropdownOption) => void;
  buttonClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
  selectedOptionClassName?: string;
  icon?: ReactNode;
  renderOption?: (option: DropdownOption, isSelected: boolean) => ReactNode;
  renderTrigger?: (selectedOption: DropdownOption | undefined, isOpen: boolean) => ReactNode;
  position?: 'bottom' | 'top';
  fullWidth?: boolean;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = 'Select an option',
  options,
  selectedOption,
  onSelect,
  buttonClassName = '',
  menuClassName = '',
  optionClassName = '',
  selectedOptionClassName = '',
  icon = <ChevronDownIcon className="w-5 h-5" />,
  renderOption,
  renderTrigger,
  position = 'bottom',
  fullWidth = true,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleSelect = (option: DropdownOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  // Default button style - can be overridden with buttonClassName
  const defaultButtonClass = `
    flex items-center justify-between 
    px-4 py-2.5 
    bg-[#23375F] 
    border border-blue-800/30 
    rounded-lg 
    text-white 
    focus:outline-none focus:ring-2 focus:ring-purple-500
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    ${fullWidth ? 'w-full' : ''}
  `;

  // Default menu style - can be overridden with menuClassName
  const defaultMenuClass = `
    absolute 
    ${position === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'} 
    left-0 
    z-10 
    ${fullWidth ? 'w-full' : 'min-w-max'} 
    bg-[#23375F] 
    border border-blue-800/30 
    rounded-lg 
    shadow-lg 
    max-h-56 
    overflow-auto
  `;

  // Default option style - can be overridden with optionClassName
  const defaultOptionClass = `
    px-4 py-2 
    cursor-pointer 
    hover:bg-blue-800 
    transition-colors 
    text-gray-300
  `;

  // Default selected option style - can be overridden with selectedOptionClassName
  const defaultSelectedOptionClass = `
    bg-purple-900 
    text-white
  `;

  return (
    <div ref={dropdownRef} className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-gray-300 mb-2">{label}</label>
      )}
      
      {renderTrigger ? (
        <div onClick={() => !disabled && setIsOpen(!isOpen)}>
          {renderTrigger(selectedOption, isOpen)}
        </div>
      ) : (
        <button
          type="button"
          className={buttonClassName || defaultButtonClass}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span>{selectedOption?.label || placeholder}</span>
          <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            {icon}
          </span>
        </button>
      )}

      {isOpen && (
        <div className={menuClassName || defaultMenuClass}>
          {options.map((option) => {
            const isSelected = selectedOption?.id === option.id;
            
            return renderOption ? (
              <div 
                key={option.id} 
                onClick={() => handleSelect(option)}
              >
                {renderOption(option, isSelected)}
              </div>
            ) : (
              <div
                key={option.id}
                className={`
                  ${optionClassName || defaultOptionClass}
                  ${isSelected ? (selectedOptionClassName || defaultSelectedOptionClass) : ''}
                `}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;