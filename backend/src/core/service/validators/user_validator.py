import re
from fastapi import HTTPException


class UserValidator:
    """Validator for user input."""
    
    @staticmethod
    def validate_email(email: str) -> None:
        """Validate email format."""
        # Basic email validation pattern
        pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.match(pattern, email):
            raise HTTPException(status_code=400, detail="Invalid email format")

    @staticmethod
    def validate_password(password: str) -> None:
        """Validate password strength."""
        if len(password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
        
        # Check for at least one uppercase, one lowercase, and one digit
        if not re.search(r"[A-Z]", password):
            raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter")
        
        if not re.search(r"[a-z]", password):
            raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter")
        
        if not re.search(r"\d", password):
            raise HTTPException(status_code=400, detail="Password must contain at least one digit")

    @staticmethod
    def validate_username(username: str) -> None:
        """Validate username format."""
        if len(username) < 3 or len(username) > 20:
            raise HTTPException(status_code=400, detail="Username must be between 3 and 20 characters")
        
        # Allow only letters, numbers, underscores, and hyphens
        if not re.match(r"^[a-zA-Z0-9_-]+$", username):
            raise HTTPException(status_code=400, detail="Username can only contain letters, numbers, underscores, and hyphens")