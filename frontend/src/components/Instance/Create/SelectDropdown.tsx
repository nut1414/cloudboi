// components/Common/SelectDropdown.tsx
import React, { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface SelectDropdownProps {
  label: string
  options: string[]
  selectedOption: string
  onSelect: (option: string) => void
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({ 
  label, 
  options, 
  selectedOption, 
  onSelect 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle option selection
  const handleSelect = (option: string) => {
    onSelect(option)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative w-full max-w-xs">
      <label className="block text-gray-300 mb-2">{label}</label>
      
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-2.5 bg-[#23375F] border border-blue-800/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption || `Select ${label}`}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDownIcon className="w-5 h-5" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 w-full mt-1 bg-[#23375F] border border-blue-800/30 rounded-lg shadow-lg max-h-56 overflow-auto">
          {options.map((option, index) => (
            <div
              key={index}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-800 transition-colors ${
                option === selectedOption ? 'bg-purple-900 text-white' : 'text-gray-300'
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectDropdown
