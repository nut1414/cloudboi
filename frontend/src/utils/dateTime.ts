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
 * Formats a date to YYYY-MM-DD HH:MM:SS in the user's local timezone
 * This is a simpler, more consistent format compared to formatDateTime
 */
export const formatDateTimeSimple = (
    utcDate: Date | string | null | undefined
): string => {
    if (!utcDate) return "N/A"
    
    // Create a date object which will convert UTC to local time
    const date = new Date(utcDate)
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * Formats a date in YYYY-MM-DD HH:MM:SS format for backend API calls
 * Always converts to UTC for consistency with backend
 */
export const formatDateForBackend = (date: Date | null): string => {
    if (!date) return ""
    
    // Convert to UTC
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
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