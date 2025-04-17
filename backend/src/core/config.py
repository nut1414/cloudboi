import os
import secrets

class DatabaseConfig:
    MODE = os.environ.get("MODE", "dev")
    
    DB_NAME = "cloudboidb_test" if MODE == "test" else os.environ.get("DB_NAME", "cloudboidb")
    
    DB_URL = os.environ.get(
        "SQLALCHEMY_DATABASE_URL",
        "postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}".format(
            DB_USER=os.environ.get("DB_USER", "cloudboi"),
            DB_PASSWORD=os.environ.get("DB_PASSWORD", "cloudboi"),
            DB_HOST=os.environ.get("DB_HOST", "localhost"),
            DB_PORT=os.environ.get("DB_PORT", "5432"),
            DB_NAME=DB_NAME,
        )
    )
    DB_CONFIG = {
        "echo": False, # Enable logging
    }

class TokenConfig:
    MODE = os.environ.get("MODE", "dev")
    SECRET_KEY = os.environ.get("SECRET_KEY", secrets.token_hex(32))
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    REFRESH_TOKEN_EXPIRE_DAYS = 7
    ISSUER = os.environ.get("TOKEN_ISSUER", "cloudboi")
    AUDIENCE = os.environ.get("TOKEN_AUDIENCE", "cloudboi-users")

    # HTTPS only in production
    SECURE_COOKIES = MODE == "production"
    SAMESITE = "strict"  # Using strict now that we have a proxy

class BillingConfig:
    # Check for overdue subscriptions every x minutes
    OVERDUE_CHECK_INTERVAL_MINUTES = 1
    OVERDUE_MAX_INSTANCES = 2
    
    # Check for expired subscriptions every x minutes
    EXPIRE_CHECK_INTERVAL_MINUTES = 1
    EXPIRE_MAX_INSTANCES = 2
    
class LXDClientConfig:
    # Time interval in seconds between state measurements for calculating CPU usage
    CPU_USAGE_MEASUREMENT_INTERVAL = 0.5