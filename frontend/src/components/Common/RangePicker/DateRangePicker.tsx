import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { CalendarIcon } from '@heroicons/react/24/outline'
import InputField from '../InputField'
import Button from '../Button/Button'
import { formatDateForInput, formatMonthForInput, getMonthDateRange } from '../../../utils/dateTime'
import MonthPicker from './MonthPicker'

interface DateRangePickerProps {
  isAllTime: boolean
  startDate: Date | null
  endDate: Date | null
  onToggleTimeRange: (allTime: boolean) => void
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void
  onApplyFilter: () => void
  className?: string
}

type FilterType = 'allTime' | 'customDate' | 'month';

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
  const [filterType, setFilterType] = useState<FilterType>(isAllTime ? 'allTime' : 'customDate')
  const [startMonth, setStartMonth] = useState<string>('')
  const [endMonth, setEndMonth] = useState<string>('')
  
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

  // Handle month selection from MonthPicker
  const handleMonthSelect = useCallback((newStartMonth: string, newEndMonth: string) => {
    setStartMonth(newStartMonth)
    setEndMonth(newEndMonth)
    
    // Convert month selection to dates
    if (newStartMonth) {
      const startMonthRange = getMonthDateRange(newStartMonth)
      
      if (newEndMonth) {
        const endMonthRange = getMonthDateRange(newEndMonth)
        if (startMonthRange && endMonthRange && validateDateRange(startMonthRange.start, endMonthRange.end)) {
          onDateRangeChange(startMonthRange.start, endMonthRange.end)
        }
      } else {
        // If only one month is selected, set both start and end date to that month's range
        if (startMonthRange && validateDateRange(startMonthRange.start, startMonthRange.end)) {
          onDateRangeChange(startMonthRange.start, startMonthRange.end)
        }
      }
    }
  }, [onDateRangeChange, validateDateRange])

  // Handle toggle to All Time - optimized with fewer operations
  const handleToggleAllTime = useCallback(() => {
    if (filterType !== 'allTime') {
      setFilterType('allTime')
      setDateError(undefined)
      onToggleTimeRange(true)
    }
  }, [filterType, onToggleTimeRange])

  // Handle toggle to custom date range - optimized
  const handleToggleCustomRange = useCallback(() => {
    if (filterType !== 'customDate') {
      setFilterType('customDate')
      onToggleTimeRange(false)
    }
  }, [filterType, onToggleTimeRange])

  // Handle toggle to month selection
  const handleToggleMonthRange = useCallback(() => {
    if (filterType !== 'month') {
      setFilterType('month')
      onToggleTimeRange(false)
      
      // Initialize with current month if no selection yet
      if (!startMonth) {
        const now = new Date()
        
        const currentMonth = formatMonthForInput(now)
        setStartMonth(currentMonth)
        
        const monthRange = getMonthDateRange(currentMonth)
        if (monthRange) {
          onDateRangeChange(monthRange.start, monthRange.end)
        }
      }
    }
  }, [filterType, onToggleTimeRange, startMonth, onDateRangeChange])

  // Memoized UI-related values
  const uiProps = useMemo(() => ({
    buttonClasses: {
      allTime: filterType === 'allTime' ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/10' : '',
      customRange: filterType === 'customDate' ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/10' : '',
      monthRange: filterType === 'month' ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/10' : ''
    },
    dateInputsContainerStyle: {
      maxHeight: filterType === 'customDate' ? '200px' : '0',
      opacity: filterType === 'customDate' ? 1 : 0,
      marginBottom: filterType === 'customDate' ? '1rem' : '0'
    },
    monthInputsContainerStyle: {
      maxHeight: filterType === 'month' ? '340px' : '0',
      opacity: filterType === 'month' ? 1 : 0,
      marginBottom: filterType === 'month' ? '1rem' : '0'
    },
    formattedDates: {
      start: formatDateForInput(startDate),
      end: formatDateForInput(endDate)
    }
  }), [filterType, startDate, endDate])

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-3 mb-4">
        <Button
          label="All Time"
          variant={filterType === 'allTime' ? "primary" : "secondary"}
          onClick={handleToggleAllTime}
          size="small"
          className={uiProps.buttonClasses.allTime}
          data-testid="date-range-picker-all-time"
        />
        <Button
          label="Custom Date Range"
          variant={filterType === 'customDate' ? "primary" : "secondary"}
          onClick={handleToggleCustomRange}
          size="small"
          className={uiProps.buttonClasses.customRange}
          data-testid="date-range-picker-custom-range"
        />
        <Button
          label="Monthly"
          variant={filterType === 'month' ? "primary" : "secondary"}
          onClick={handleToggleMonthRange}
          size="small"
          className={uiProps.buttonClasses.monthRange}
          data-testid="date-range-picker-monthly"
        />
      </div>

      {/* Custom Date Range Inputs */}
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
            disabled={filterType !== 'customDate'}
            data-testid="date-range-picker-start-date"
          />
          <InputField
            className="p-2"
            label="End Date"
            type="date"
            value={uiProps.formattedDates.end}
            onChange={handleEndDateChange}
            icon={<CalendarIcon className="w-5 h-5" />}
            disabled={filterType !== 'customDate'}
            error={dateError}
            data-testid="date-range-picker-end-date"
          />
        </div>
      </div>

      {/* Month Selection Interface */}
      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out" 
        style={uiProps.monthInputsContainerStyle}
      >
        <MonthPicker
          startMonth={startMonth}
          endMonth={endMonth}
          onMonthSelect={handleMonthSelect}
        />
      </div>
    </div>
  )
})

export default DateRangePicker 