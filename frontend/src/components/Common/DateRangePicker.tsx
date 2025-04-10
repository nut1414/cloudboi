import React, { useCallback, useMemo, useState, useEffect } from 'react'
import InputField from './InputField'
import { CalendarIcon } from '@heroicons/react/24/outline'
import Button from './Button/Button'
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
  
  // Memoize trigger conditions to avoid unnecessary recalculations
  const { triggerAllTime, triggerCustomRange } = useMemo(() => ({
    triggerAllTime: isAllTime && !startDate && !endDate,
    triggerCustomRange: !isAllTime && startDate !== null && endDate !== null
  }), [isAllTime, startDate, endDate])

  // Apply filter when conditions change
  useEffect(() => {
    if (triggerAllTime || triggerCustomRange) {
      onApplyFilter()
    }
  }, [triggerAllTime, triggerCustomRange, onApplyFilter])

  // Validate date range - optimized to run only when needed
  const validateDateRange = useCallback((start: Date | null, end: Date | null): boolean => {
    // If either date is null, validation passes
    if (!start || !end) {
      setDateError(undefined)
      return true
    }
    
    // Check if end date is after or equal to start date
    const isValid = end >= start
    setDateError(isValid ? undefined : 'End date must be after or equal to start date')
    return isValid
  }, [])

  // Handle date input changes with useCallback
  const handleStartDateChange = useCallback((value: string) => {
    const newDate = value ? new Date(value) : null
    // Only call onDateRangeChange if validation passes
    if (validateDateRange(newDate, endDate)) {
      onDateRangeChange(newDate, endDate)
    }
  }, [endDate, onDateRangeChange, validateDateRange])

  const handleEndDateChange = useCallback((value: string) => {
    const newDate = value ? new Date(value) : null
    // Only call onDateRangeChange if validation passes
    if (validateDateRange(startDate, newDate)) {
      onDateRangeChange(startDate, newDate)
    }
  }, [startDate, onDateRangeChange, validateDateRange])

  // Handle toggle to All Time - optimized with fewer operations
  const handleToggleAllTime = useCallback(() => {
    if (!isAllTime) {
      setDateError(undefined)
      onToggleTimeRange(true)
    }
  }, [isAllTime, onToggleTimeRange])

  // Handle toggle to custom date range - optimized
  const handleToggleCustomRange = useCallback(() => {
    if (isAllTime) {
      onToggleTimeRange(false)
    }
  }, [isAllTime, onToggleTimeRange])

  // Memoized UI-related values
  const uiProps = useMemo(() => ({
    buttonClasses: {
      allTime: isAllTime ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/10' : '',
      customRange: !isAllTime ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/10' : ''
    },
    dateInputsContainerStyle: {
      maxHeight: !isAllTime ? '200px' : '0',
      opacity: !isAllTime ? 1 : 0,
      marginBottom: !isAllTime ? '1rem' : '0'
    },
    formattedDates: {
      start: formatDateForInput(startDate),
      end: formatDateForInput(endDate)
    }
  }), [isAllTime, startDate, endDate])

  return (
    <div className={className}>
      <div className="flex gap-3 mb-4">
        <Button
          label="All Time"
          variant={isAllTime ? "primary" : "secondary"}
          onClick={handleToggleAllTime}
          size="small"
          className={uiProps.buttonClasses.allTime}
        />
        <Button
          label="Custom Date Range"
          variant={!isAllTime ? "primary" : "secondary"}
          onClick={handleToggleCustomRange}
          size="small"
          className={uiProps.buttonClasses.customRange}
        />
      </div>

      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out" 
        style={uiProps.dateInputsContainerStyle}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            className="p-2"
            label="Start Date"
            type="date"
            value={uiProps.formattedDates.start}
            onChange={handleStartDateChange}
            icon={<CalendarIcon className="w-5 h-5" />}
            disabled={isAllTime}
          />
          <InputField
            className="p-2"
            label="End Date"
            type="date"
            value={uiProps.formattedDates.end}
            onChange={handleEndDateChange}
            icon={<CalendarIcon className="w-5 h-5" />}
            disabled={isAllTime}
            error={dateError}
          />
        </div>
      </div>
    </div>
  )
})

export default DateRangePicker 