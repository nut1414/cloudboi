import React, { useCallback, useMemo, useState } from 'react'
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '@heroicons/react/24/outline'

interface MonthPickerProps {
  startMonth: string
  endMonth: string
  onMonthSelect: (startMonth: string, endMonth: string) => void
  className?: string
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

const MonthPicker: React.FC<MonthPickerProps> = ({
  startMonth,
  endMonth,
  onMonthSelect,
  className = ''
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    if (startMonth) {
      return parseInt(startMonth.split('-')[0], 10)
    }
    return new Date().getFullYear()
  })
  const [hoverMonth, setHoverMonth] = useState<number | null>(null)

  // Handle month selection in the grid
  const handleMonthSelect = useCallback((monthIndex: number) => {
    const monthStr = `${selectedYear}-${String(monthIndex + 1).padStart(2, '0')}`
    
    // If no month selected yet or we're restarting selection
    if (!startMonth || (startMonth && endMonth)) {
      onMonthSelect(monthStr, '')
    } 
    // If start month is selected but not end month
    else if (startMonth && !endMonth) {
      const startMonthDate = new Date(startMonth + '-01')
      const currentMonthDate = new Date(monthStr + '-01')
      
      // If selected month is before start month, make it the new start month
      if (currentMonthDate < startMonthDate) {
        onMonthSelect(monthStr, startMonth)
      } else {
        onMonthSelect(startMonth, monthStr)
      }
    }
  }, [startMonth, endMonth, selectedYear, onMonthSelect])

  // Handle mouse hover for visual feedback
  const handleMonthHover = useCallback((monthIndex: number | null) => {
    setHoverMonth(monthIndex)
  }, [])

  // Handle year change
  const handleYearChange = useCallback((change: number) => {
    setSelectedYear(prev => prev + change)
  }, [])

  // Memoized UI-related values
  const uiProps = useMemo(() => {
    // Parse selected months into indices for highlighting
    const startMonthIndex = startMonth ? parseInt(startMonth.split('-')[1], 10) - 1 : -1
    const endMonthIndex = endMonth ? parseInt(endMonth.split('-')[1], 10) - 1 : -1
    const startYear = startMonth ? parseInt(startMonth.split('-')[0], 10) : null
    const endYear = endMonth ? parseInt(endMonth.split('-')[0], 10) : null

    return {
      monthStyles: MONTHS.map((_, index) => {
        // Determine if this month should be highlighted
        const isSelectedYear = selectedYear === startYear || selectedYear === endYear
        
        // Single month selection
        if (startMonthIndex === index && !endMonth && isSelectedYear && selectedYear === startYear) {
          return 'bg-purple-500 text-white'
        }
        
        // Month range selection - both in same year
        if (startYear === endYear && selectedYear === startYear) {
          if (index >= startMonthIndex && index <= endMonthIndex) {
            return 'bg-purple-500 text-white'
          }
        }
        
        // Month range selection - spans multiple years
        if (startYear !== null && endYear !== null && startYear !== endYear) {
          if ((selectedYear === startYear && index >= startMonthIndex) || 
              (selectedYear === endYear && index <= endMonthIndex) ||
              (selectedYear > startYear && selectedYear < endYear)) {
            return 'bg-purple-500 text-white'
          }
        }
        
        // Hover effect for in-between months when selecting a range
        if (startMonth && !endMonth && hoverMonth !== null) {
          if (selectedYear === startYear && (
              (index >= startMonthIndex && index <= hoverMonth && hoverMonth > startMonthIndex) ||
              (index <= startMonthIndex && index >= hoverMonth && hoverMonth < startMonthIndex)
          )) {
            return 'bg-[#23375F] text-white'
          }
        }
        
        return ''
      })
    }
  }, [startMonth, endMonth, selectedYear, hoverMonth])

  // Helper to render the current selection text
  const getSelectionText = useMemo(() => {
    if (!startMonth) return 'Select a month'
    
    const startMonthDate = new Date(startMonth + '-01')
    const startMonthName = startMonthDate.toLocaleString('default', { month: 'long' })
    const startYear = startMonthDate.getFullYear()
    
    if (!endMonth) return `${startMonthName} ${startYear}`
    
    const endMonthDate = new Date(endMonth + '-01')
    const endMonthName = endMonthDate.toLocaleString('default', { month: 'long' })
    const endYear = endMonthDate.getFullYear()
    
    if (startYear === endYear) {
      return `${startMonthName} - ${endMonthName} ${startYear}`
    } else {
      return `${startMonthName} ${startYear} - ${endMonthName} ${endYear}`
    }
  }, [startMonth, endMonth])

  return (
    <div className={`bg-[#23375F] rounded-lg border border-blue-900/50 overflow-hidden shadow-sm ${className}`}>
      <div className="flex justify-between items-center bg-[#192A51] py-2 px-4 border-b border-blue-900/30">
        <div className="flex items-center space-x-2">
          <span className="text-purple-400">
            <CalendarIcon className="w-5 h-5" />
          </span>
          <span className="font-medium text-white">Month Selection</span>
        </div>
        <div className="text-sm font-medium text-gray-300">
          {getSelectionText}
        </div>
      </div>
      
      <div className="p-4">
        {/* Year selector */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleYearChange(-1)}
              className="p-1 rounded-full hover:bg-[#192A51] transition-colors"
              aria-label="Previous year"
              data-testid="month-picker-previous-year"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-300" />
            </button>
            <span className="font-medium text-white text-lg">{selectedYear}</span>
            <button 
              onClick={() => handleYearChange(1)}
              className="p-1 rounded-full hover:bg-[#192A51] transition-colors"
              aria-label="Next year"
              data-testid="month-picker-next-year"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {MONTHS.map((month, index) => (
            <button
              key={month}
              onClick={() => handleMonthSelect(index)}
              onMouseEnter={() => handleMonthHover(index)}
              onMouseLeave={() => handleMonthHover(null)}
              className={`
                py-2 px-3 rounded-md text-center transition-colors
                ${uiProps.monthStyles[index] ? uiProps.monthStyles[index] : 'hover:bg-[#192A51] text-gray-300'}
              `}
              data-testid={`month-picker-month-${month}`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-[#192A51]/60 py-2 px-4 text-xs text-gray-400 border-t border-blue-900/30">
        {!startMonth 
          ? "Click to select a month" 
          : !endMonth 
            ? "Click to select end month or click the same month for single month" 
            : "Click to start a new selection"}
      </div>
    </div>
  )
}

export default React.memo(MonthPicker) 