from datetime import datetime
import pytz

class DateTimeUtils:
    BKK_TZ = pytz.timezone("Asia/Bangkok")
    FORMAT = "%Y-%m-%d %H:%M:%S"  # Standard string format

    @classmethod
    def now(cls) -> str:
        """Get the current time in Bangkok time zone as a string."""
        return datetime.now(cls.BKK_TZ).strftime(cls.FORMAT)

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