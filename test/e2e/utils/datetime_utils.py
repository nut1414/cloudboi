from datetime import datetime, timedelta
import re

# Bangkok timezone is UTC+7
BANGKOK_TIMEZONE_OFFSET = 7

def to_bangkok_timezone(dt: datetime) -> datetime:
    """
    Convert datetime to Bangkok timezone (UTC+7)
    
    Args:
        dt: The datetime object in UTC
        
    Returns:
        Datetime object adjusted to Bangkok timezone
    """
    # Add 7 hours to UTC time to get Bangkok time
    return dt + timedelta(hours=BANGKOK_TIMEZONE_OFFSET)

def from_bangkok_timezone(dt: datetime) -> datetime:
    """
    Convert datetime from Bangkok timezone to UTC
    
    Args:
        dt: The datetime object in Bangkok timezone
        
    Returns:
        Datetime object adjusted to UTC
    """
    # Subtract 7 hours from Bangkok time to get UTC time
    return dt - timedelta(hours=BANGKOK_TIMEZONE_OFFSET)

def format_datetime(dt: datetime, use_bangkok_tz: bool = True) -> str:
    """
    Format datetime to the specified format: 'YYYY-MM-DD HH:MM:SS'
    
    Args:
        dt: The datetime object to format
        use_bangkok_tz: Whether to convert to Bangkok timezone first (default: True)
        
    Returns:
        Formatted datetime string
    """
    if use_bangkok_tz:
        dt = to_bangkok_timezone(dt)
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def format_datetime_for_billing(dt: datetime, use_bangkok_tz: bool = True) -> str:
    """
    Format datetime specifically for billing date format expected by the application
    
    Args:
        dt: The datetime object to format
        use_bangkok_tz: Whether to convert to Bangkok timezone first (default: True)
        
    Returns:
        Formatted datetime string in the expected billing date format
    """
    if use_bangkok_tz:
        dt = to_bangkok_timezone(dt)
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def now_formatted(use_bangkok_tz: bool = True) -> str:
    """
    Get current datetime formatted as 'YYYY-MM-DD HH:MM:SS'
    
    Args:
        use_bangkok_tz: Whether to convert to Bangkok timezone (default: True)
        
    Returns:
        Current datetime formatted as string
    """
    return format_datetime(datetime.now(), use_bangkok_tz)

def future_date_formatted(days_from_now: int = 30, use_bangkok_tz: bool = True) -> str:
    """
    Get a future date formatted as 'YYYY-MM-DD HH:MM:SS'
    
    Args:
        days_from_now: Number of days in the future (default: 30)
        use_bangkok_tz: Whether to convert to Bangkok timezone (default: True)
        
    Returns:
        Future date formatted as string
    """
    return format_datetime(datetime.now() + timedelta(days=days_from_now), use_bangkok_tz)

def extract_datetime_from_text(text: str) -> str:
    """
    Extract a datetime string in format 'YYYY-MM-DD HH:MM:SS' from text
    
    Args:
        text: Text that may contain a datetime string
        
    Returns:
        Extracted datetime string or None if not found
    
    Raises:
        ValueError: If no datetime string is found in the text
    """
    date_pattern = r'\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}'
    match = re.search(date_pattern, text)
    
    if not match:
        raise ValueError(f"Could not find date in format 'YYYY-MM-DD HH:MM:SS' in text: '{text}'")
    
    return match.group(0)

def parse_datetime(dt_str: str) -> datetime:
    """
    Parse a datetime string in format 'YYYY-MM-DD HH:MM:SS'
    
    Args:
        dt_str: Datetime string to parse
        
    Returns:
        Datetime object
        
    Raises:
        ValueError: If the string format is incorrect
    """
    try:
        return datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
    except ValueError as e:
        raise ValueError(f"Error parsing datetime string: {e}. Expected format: 'YYYY-MM-DD HH:MM:SS'") from e

def compare_datetimes_with_tolerance(dt1_str: str, dt2_str: str, tolerance_minutes: int = 2) -> bool:
    """
    Compare two datetime strings with a specified tolerance in minutes
    
    Args:
        dt1_str: First datetime string in format 'YYYY-MM-DD HH:MM:SS'
        dt2_str: Second datetime string in format 'YYYY-MM-DD HH:MM:SS'
        tolerance_minutes: Tolerance in minutes (default: 2)
        
    Returns:
        True if the difference between the datetimes is within the tolerance
    """
    try:
        dt1 = parse_datetime(dt1_str)
        dt2 = parse_datetime(dt2_str)
    except ValueError as e:
        raise ValueError(f"Error comparing datetime strings: {e}") from e
    
    difference = abs((dt1 - dt2).total_seconds())
    tolerance_seconds = tolerance_minutes * 60
    
    return difference <= tolerance_seconds 