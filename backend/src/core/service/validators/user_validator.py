import re
from .base_validator import BaseValidator, ValidationRule


class UserValidator:
    """Validator for user input with predefined validators."""
    
    @staticmethod
    def validate_email(email: str) -> None:
        """Validate email format."""
        validator = BaseValidator([
            ValidationRule(
                lambda e: bool(re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", e)),
                "Invalid email format"
            )
        ])
        validator.validate(email)
    
    @staticmethod
    def validate_password(password: str) -> None:
        """Validate password strength."""
        validator = BaseValidator([
            ValidationRule(lambda pwd: len(pwd) >= 8, "Password must be at least 8 characters long"),
            ValidationRule(lambda pwd: bool(re.search(r"[A-Z]", pwd)), 
                          "Password must contain at least one uppercase letter"),
            ValidationRule(lambda pwd: bool(re.search(r"[a-z]", pwd)), 
                          "Password must contain at least one lowercase letter"),
            ValidationRule(lambda pwd: bool(re.search(r"\d", pwd)), 
                          "Password must contain at least one digit")
        ])
        validator.validate(password)
    
    @staticmethod
    def validate_username(username: str) -> None:
        """Validate username format."""
        validator = BaseValidator([
            ValidationRule(lambda u: 3 <= len(u) <= 20, 
                          "Username must be between 3 and 20 characters"),
            ValidationRule(lambda u: bool(re.match(r"^[a-zA-Z0-9_-]+$", u)),
                          "Username can only contain letters, numbers, underscores, and hyphens")
        ])
        validator.validate(username)