from typing import Callable, List, Optional, Tuple

from fastapi import HTTPException


class ValidationRule:
    """Class representing a validation rule with test function and error message."""
    
    def __init__(self, test_func: Callable[[str], bool], error_message: str):
        self.test_func = test_func
        self.error_message = error_message
        
    def validate(self, value: str) -> Optional[str]:
        """Run the test function and return error message if validation fails."""
        if not self.test_func(value):
            return self.error_message
        return None


class BaseValidator:
    """Base validator class with configurable validation rules."""
    
    def __init__(self, rules: List[ValidationRule] = None, raise_exception: bool = True, 
                 exception_class=HTTPException, status_code: int = 400):
        self.rules = rules or []
        self.raise_exception = raise_exception
        self.exception_class = exception_class
        self.status_code = status_code
    
    def validate(self, value: str) -> Tuple[bool, List[str]]:
        """Validate input against all rules and return results."""
        errors = []
        
        for rule in self.rules:
            error = rule.validate(value)
            if error:
                errors.append(error)
                
        is_valid = len(errors) == 0
        
        if not is_valid and self.raise_exception:
            detail = errors[0] if errors else "Validation failed"
            raise self.exception_class(status_code=self.status_code, detail=detail)
            
        return is_valid, errors