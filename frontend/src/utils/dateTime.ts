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
};

/**
 * Formats a UTC date to the user's local timezone with a consistent format
 */
export const formatDateTime = (
    utcDate: Date | string | null | undefined,
    options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS
): string => {
    if (!utcDate) return "N/A";
    
    const date = new Date(utcDate);
    return date.toLocaleString(undefined, options);
};

/**
 * Formats a duration from milliseconds into a human-readable string
 */
export const formatDuration = (ms: number): string => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
};

/**
 * Calculates and formats the uptime from a given start date
 */
export const formatUptime = (startDate: Date | string | null | undefined, isRunning: boolean): string => {
    if (!startDate || !isRunning) return "0d 0h 0m";
    
    const start = new Date(startDate);
    const now = new Date();
    const uptime = now.getTime() - start.getTime();
    
    return formatDuration(uptime);
}; 