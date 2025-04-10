/**
 * Format options for displaying date in user's locale and timezone
 */
const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
}

/**
 * Formats a date to the standard format string used across the application
 * @param date The date to format
 * @param nullValue What to return when date is null/undefined (defaults to empty string)
 * @returns Formatted date string in YYYY-MM-DD HH:MM:SS format
 */
export const formatStandardDate = (
    date: Date | string | null | undefined, 
    nullValue: string = ""
): string => {
    if (!date) return nullValue
    
    // Convert to Date if string is provided
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    const hours = String(dateObj.getHours()).padStart(2, '0')
    const minutes = String(dateObj.getMinutes()).padStart(2, '0')
    const seconds = String(dateObj.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * Formats a UTC date to the user's local timezone with a consistent format
 * When displaying dates to users, always use this function to ensure consistent formatting
 * and proper timezone conversion.
 */
export const formatDateTime = (
    utcDate: Date | string | null | undefined,
    options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS
): string => {
    if (!utcDate) return "N/A"
    
    // Create a new Date object which will automatically convert to local time
    const date = new Date(utcDate)
    
    // Use toLocaleString with undefined locale to use the user's browser locale
    // This ensures dates are displayed in the user's preferred format and timezone
    return date.toLocaleString(undefined, options)
}

/**
 * Formats a date for input fields in YYYY-MM-DD format
 */
export const formatDateForInput = (date: Date | null): string => {
    if (!date) return ''
    return date.toISOString().split('T')[0] // Format as YYYY-MM-DD
}

/**
 * Formats a duration from milliseconds into a human-readable string
 */
export const formatDuration = (ms: number): string => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

    return `${days}d ${hours}h ${minutes}m`
}

/**
 * Calculates and formats the uptime from a given start date
 */
export const formatUptime = (startDate: Date | string | null | undefined, isRunning: boolean): string => {
    if (!startDate || !isRunning) return "0d 0h 0m"
    
    const start = new Date(startDate)
    const now = new Date()
    const uptime = now.getTime() - start.getTime()
    
    return formatDuration(uptime)
}

/**
 * Gets the first day of a given month and year
 */
export const getFirstDayOfMonth = (year: number, month: number): Date => {
    return new Date(year, month, 1);
}

/**
 * Gets the last day of a given month and year
 */
export const getLastDayOfMonth = (year: number, month: number): Date => {
    return new Date(year, month + 1, 0);
}

/**
 * Formats a month for input fields in YYYY-MM format
 */
export const formatMonthForInput = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

/**
 * Parses a month input (YYYY-MM) and returns first and last day of that month
 */
export const getMonthDateRange = (monthInput: string): { start: Date, end: Date } | null => {
    if (!monthInput) return null;
    
    const [year, month] = monthInput.split('-').map(Number);
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) return null;
    
    const start = getFirstDayOfMonth(year, month - 1);
    const end = getLastDayOfMonth(year, month - 1);
    
    return { start, end };
} 