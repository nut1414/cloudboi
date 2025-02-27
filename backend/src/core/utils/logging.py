import logging
import sys

# Configure root logger
def configure_logging(level=logging.INFO):
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[logging.StreamHandler(sys.stdout)]
    )

# Get a logger for a specific module
def get_logger(name=None):
    return logging.getLogger(name or __name__)

# Create a default logger
logger = get_logger("cloudboi")