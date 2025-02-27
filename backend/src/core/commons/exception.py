class CloudboiException(Exception):
    def __init__(self, message, class_name):
        if class_name:
            message = f"[{class_name}] {message}"
        super().__init__(message)

def create_exception_class(base_class_name):
    """Factory function to create exception classes with predefined class names"""
    class CustomException(CloudboiException):
        def __init__(self, message):
            super().__init__(message, base_class_name)
    
    # Set a more descriptive name for the exception class
    CustomException.__name__ = f"{base_class_name}Exception"
    return CustomException