from datetime import datetime, timedelta
from typing import Optional
import pytz
from sqlalchemy import TypeDecorator, String

class DateTimeUtils:
    BKK_TZ = pytz.timezone("Asia/Bangkok")
    FORMAT = "%Y-%m-%d %H:%M:%S"  # Standard string format

    @classmethod
    def now_str(cls) -> str:
        """Get the current time in Bangkok time zone as a string."""
        return datetime.now(cls.BKK_TZ).strftime(cls.FORMAT)
    
    @classmethod
    def now_dt(cls) -> datetime:
        """Get the current time in Bangkok time zone as a datetime object."""
        return datetime.now(cls.BKK_TZ)

    @classmethod
    def future_date_dt(cls, days: int = 0, hours: int = 0, minutes: int = 0) -> datetime:
        """Get a future date in Bangkok time zone as a datetime object."""
        now = cls.now_dt()
        return now + timedelta(days=days, hours=hours, minutes=minutes)
    
    @classmethod
    def future_date_str(cls, days: int = 0, hours: int = 0, minutes: int = 0) -> str:
        """Get a future date in Bangkok time zone as a formatted string."""
        future = cls.future_date_dt(days, hours, minutes)
        return future.strftime(cls.FORMAT)

    @classmethod
    def to_bkk_string(cls, dt: datetime) -> str:
        """Convert a datetime object to Bangkok time zone and format as string."""
        if dt.tzinfo is None:
            dt = pytz.utc.localize(dt)  # Assume UTC if no timezone is set
        bkk_time = dt.astimezone(cls.BKK_TZ)
        return bkk_time.strftime(cls.FORMAT)

    @classmethod
    def from_string(cls, date_str: str) -> datetime:
        """Convert a standardized string back to a datetime object."""
        return cls.BKK_TZ.localize(datetime.strptime(date_str, cls.FORMAT))

# Custom SQLAlchemy type for Bangkok timezone dates
class BkkDateTime(TypeDecorator):
    """SQLAlchemy type that stores datetime as Bangkok timezone strings but loads as datetime objects"""
    impl = String
    cache_ok = True

    def process_bind_param(self, value, dialect) -> Optional[str]:
        if value is None:
            return None
        if isinstance(value, str):
            # If it's already a string, assume it's in the correct format
            return value
        return DateTimeUtils.to_bkk_string(value)

    def process_result_value(self, value, dialect) -> Optional[datetime]:
        if value is None:
            return None
        return DateTimeUtils.from_string(value)