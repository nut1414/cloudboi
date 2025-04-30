import React, { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useTestId } from '../../utils/testUtils'

interface DropdownOption {
  value: string
  label: string
  sublabel?: string
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange: (value: string) => void
  onSearch?: (query: string) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  disabled?: boolean
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  onSearch,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  className = '',
  disabled = false,
  ...restProps
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { dataTestId } = useTestId(restProps)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`w-full px-4 py-2.5 text-left bg-[#1B2B4E] border border-blue-800/30 rounded-lg flex items-center justify-between ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-700/50'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        data-testid={`${dataTestId}-dropdown-button`}
      >
        <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#1B2B4E] border border-blue-800/30 rounded-lg shadow-lg">
          {onSearch && (
            <div className="p-2 border-b border-blue-800/30">
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23375F] border border-blue-800/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-700/50"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                data-testid={`${dataTestId}-dropdown-search`}
              />
            </div>
          )}
          <ul className="max-h-60 overflow-y-auto py-2">
            {options.map((option) => (
              <li
                key={option.value}
                className="px-4 py-2 hover:bg-blue-800/20 cursor-pointer"
                onClick={() => handleOptionClick(option.value)}
                data-testid={`${dataTestId}-dropdown-option-${option.label}`}
              >
                <div className="flex flex-col">
                  <span className="text-white">{option.label}</span>
                  {option.sublabel && (
                    <span className="text-gray-400 text-sm">{option.sublabel}</span>
                  )}
                </div>
              </li>
            ))}
            {options.length === 0 && (
              <li className="px-4 py-2 text-gray-400">No options available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Dropdown 