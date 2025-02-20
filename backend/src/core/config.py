import os

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
        "echo": True, # Enable logging
    }

# Can add more configurations here