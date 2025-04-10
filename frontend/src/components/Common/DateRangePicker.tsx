import React, { useCallback, useMemo, useState, useEffect } from 'react'
import InputField from './InputField'
import { CalendarIcon, ArrowPathIcon, ClockIcon } from '@heroicons/react/24/outline'
import Button from './Button/Button'
import Section from './Section'
import { formatDateForInput } from '../../utils/dateTime'

interface DateRangePickerProps {
  isAllTime: boolean
  startDate: Date | null
  endDate: Date | null
  onToggleTimeRange: (allTime: boolean) => void
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void
  onApplyFilter: () => void
  className?: string
}

const DateRangePicker: React.FC<DateRangePickerProps> = React.memo(({
  isAllTime,
  startDate,
  endDate,
  onToggleTimeRange,
  onDateRangeChange,
  onApplyFilter,
  className = ''
}) => {
  const [dateError, setDateError] = useState<string | undefined>(undefined)
  // Track previous all-time state to detect changes
  const [prevIsAllTime, setPrevIsAllTime] = useState(isAllTime)

  // Effect to detect changes in isAllTime and apply filter when switching to All Time
  useEffect(() => {
    // Only trigger if changing from custom to all time
    if (isAllTime && !prevIsAllTime) {
      // Apply filter when switching to All Time
      onApplyFilter()
    }
    // Update previous state
    setPrevIsAllTime(isAllTime)
  }, [isAllTime, prevIsAllTime, onApplyFilter])

  // Validate date range
  const validateDateRange = useCallback((start: Date | null, end: Date | null) => {
    if (!start || !end) return true
    
    // Reset error if both dates are valid
    if (end >= start) {
      setDateError(undefined)
      return true
    } else {
      setDateError('End date must be after or equal to start date')
      return false
    }
  }, [])

  // Handle date input changes with useCallback
  const handleStartDateChange = useCallback((value: string) => {
    const newDate = value ? new Date(value) : null
    // Validate when changing start date
    if (validateDateRange(newDate, endDate)) {
      onDateRangeChange(newDate, endDate)
    }
  }, [endDate, onDateRangeChange, validateDateRange])

  const handleEndDateChange = useCallback((value: string) => {
    const newDate = value ? new Date(value) : null
    // Validate when changing end date
    if (validateDateRange(startDate, newDate)) {
      onDateRangeChange(startDate, newDate)
    }
  }, [startDate, onDateRangeChange, validateDateRange])

  // Handle toggle to All Time
  const handleToggleAllTime = useCallback(() => {
    // Only do something if we're not already in All Time mode
    if (!isAllTime) {
      // Clear any validation errors
      setDateError(undefined)
      // Toggle to all time
      onToggleTimeRange(true)
      // No need to call onApplyFilter here, the useEffect will handle it
    }
  }, [isAllTime, onToggleTimeRange])

  // Handle toggle to custom date range
  const handleToggleCustomRange = useCallback(() => {
    // Only do something if we're not already in Custom mode
    if (isAllTime) {
      onToggleTimeRange(false)
    }
  }, [isAllTime, onToggleTimeRange])

  // Validate before applying filter
  const handleApplyFilter = useCallback(() => {
    // Only apply if validation passes
    if (validateDateRange(startDate, endDate)) {
      onApplyFilter()
    }
  }, [onApplyFilter, startDate, endDate, validateDateRange])

  // Memoize button classes for better performance
  const buttonClasses = useMemo(() => ({
    allTime: `${isAllTime ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/10' : ''}`,
    customRange: `${!isAllTime ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/10' : ''}`
  }), [isAllTime])

  // Memoize style for the date inputs container
  const dateInputsContainerStyle = useMemo(() => ({
    maxHeight: !isAllTime ? '200px' : '0',
    opacity: !isAllTime ? 1 : 0,
    marginBottom: !isAllTime ? '1rem' : '0'
  }), [isAllTime])

  // Memoize the formatted date values
  const formattedDates = useMemo(() => ({
    start: formatDateForInput(startDate),
    end: formatDateForInput(endDate)
  }), [startDate, endDate])

  return (
    <Section
      title="Time Period Filter"
      icon={<ClockIcon className="w-5 h-5" />}
      description="Filter billing data by time period"
      className={`${className}`}
    >
      <div className="flex gap-3 mb-4">
        <Button
          label="All Time"
          variant={isAllTime ? "primary" : "secondary"}
          onClick={handleToggleAllTime}
          size="small"
          className={buttonClasses.allTime}
        />
        <Button
          label="Custom Date Range"
          variant={!isAllTime ? "primary" : "secondary"}
          onClick={handleToggleCustomRange}
          size="small"
          className={buttonClasses.customRange}
        />
      </div>

      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out" 
        style={dateInputsContainerStyle}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            className="p-2"
            label="Start Date"
            type="date"
            value={formattedDates.start}
            onChange={handleStartDateChange}
            icon={<CalendarIcon className="w-5 h-5" />}
            disabled={isAllTime}
          />
          <InputField
            className="p-2"
            label="End Date"
            type="date"
            value={formattedDates.end}
            onChange={handleEndDateChange}
            icon={<CalendarIcon className="w-5 h-5" />}
            disabled={isAllTime}
            error={dateError}
          />
        </div>
        
        {!isAllTime && (
          <div className="mt-4 flex justify-end">
            <Button 
              label="Apply Filter"
              variant="primary"
              onClick={handleApplyFilter}
              size="small"
              icon={<ArrowPathIcon className="w-4 h-4" />}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              disabled={!!dateError || !startDate || !endDate}
            />
          </div>
        )}
      </div>
    </Section>
  )
})

export default DateRangePicker 