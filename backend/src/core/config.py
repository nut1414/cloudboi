import os
import secrets

class DatabaseConfig:
    DB_URL = os.environ.get(
        "SQLALCHEMY_DATABASE_URL",
        "postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}".format(
            DB_USER=os.environ.get("DB_USER", "cloudboi"),
            DB_PASSWORD=os.environ.get("DB_PASSWORD", "cloudboi"),
            DB_HOST=os.environ.get("DB_HOST", "localhost"),
            DB_PORT=os.environ.get("DB_PORT", "5432"),
            DB_NAME=os.environ.get("DB_NAME", "cloudboidb"),
        )
    )
    DB_CONFIG = {
        "echo": False, # Enable logging
    }

class TokenConfig:
    ENV = os.environ.get("ENV", "development")
    SECRET_KEY = os.environ.get("SECRET_KEY", secrets.token_hex(32))
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    REFRESH_TOKEN_EXPIRE_DAYS = 7
    ISSUER = os.environ.get("TOKEN_ISSUER", "cloudboi")
    AUDIENCE = os.environ.get("TOKEN_AUDIENCE", "cloudboi-users")

    # HTTPS only in production
    SECURE_COOKIES = ENV == "production"

class BillingConfig:
    # Check for overdue subscriptions every 30 minutes
    OVERDUE_CHECK_INTERVAL_MINUTES = 1
    
    # Check for expired subscriptions every 60 minutes
    EXPIRE_CHECK_INTERVAL_MINUTES = 1