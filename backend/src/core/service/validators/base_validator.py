from typing import Callable, List, Optional, Tuple, TypeVar
from fastapi import HTTPException

from ...models.base_model import BaseModel
from ...utils.logging import logger

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

T = TypeVar('T', bound=BaseModel)
    
def validate_model_match(request_model: T, db_model: T) -> None:
    """
    Validates that fields in request model match the database model.
    Uses the model's class name for error messages automatically.
    
    Args:
        request_model: The pydantic model from the user's request
        db_model: The pydantic model from the database
    """
    model_name = request_model.__class__.__name__
    # Get all fields from the model
    for field in request_model.model_fields:
        # Skip None values in request
        if getattr(request_model, field, None) is None:
            continue
            
        req_value = getattr(request_model, field)
        db_value = getattr(db_model, field)
        
        # Handle case-insensitive comparison for strings
        if isinstance(req_value, str) and isinstance(db_value, str):
            if req_value.lower() != db_value.lower():
                logger.error(f"{model_name} field '{field}' mismatch: expected '{db_value}'")
                # Make http exception more generic, so no business logic is leaked
                raise HTTPException(
                    status_code=400,
                    detail="Invalid request data"
                )
        elif req_value != db_value:
            logger.error(f"{model_name} field '{field}' mismatch: expected '{db_value}'")
            raise HTTPException(
                status_code=400,
                detail="Invalid request data"
            )