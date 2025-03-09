from .base_validator import BaseValidator, ValidationRule


class InstanceValidator:
    """Instance-related validators."""
    
    @staticmethod
    def validate_password(password: str) -> None:
        """
        Validates the root password based on basic security rules:
        - Must be at least 8 characters long.
        - Should include at least 3 of the following: uppercase letter, lowercase letter, digit, special character.
        """
        def check_complexity(pwd: str) -> bool:
            has_upper = any(c.isupper() for c in pwd)
            has_lower = any(c.islower() for c in pwd)
            has_digit = any(c.isdigit() for c in pwd)
            has_special = any(not c.isalnum() for c in pwd)
            return sum([has_upper, has_lower, has_digit, has_special]) >= 3
        
        validator = BaseValidator([
            ValidationRule(lambda pwd: len(pwd) >= 8, 
                          "Password must be at least 8 characters long"),
            ValidationRule(check_complexity,
                          "Password should include at least 3 of: uppercase letter, lowercase letter, digit, special character")
        ])
        
        validator.validate(password)