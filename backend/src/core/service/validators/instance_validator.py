class InstanceValidator:
    @staticmethod
    def validate_password(password: str) -> bool:
        """
        Validates the root password based on basic security rules:
        - Must be at least 8 characters long.
        - Should include at least 3 of the following: uppercase letter, lowercase letter, digit, special character.
        """
        if len(password) < 8:
            return False
        
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        has_special = any(not c.isalnum() for c in password)
        
        return sum([has_upper, has_lower, has_digit, has_special]) >= 3