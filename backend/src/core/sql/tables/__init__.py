import pkgutil
import importlib
from sqlalchemy.orm import DeclarativeMeta
from .base import Base

# Dynamically import all modules in the current package
for _, module_name, _ in pkgutil.iter_modules(__path__):
    module = importlib.import_module(f"{__name__}.{module_name}")
    for attr_name in dir(module):
        attr = getattr(module, attr_name)
        if isinstance(attr, DeclarativeMeta) and attr is not Base:
            globals()[attr_name] = attr  # Add model to global namespace

# Automatically populate __all__
__all__ = [name for name, obj in globals().items() if isinstance(obj, DeclarativeMeta)]