from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from ..infra.managers.lxd import LXDManager
from .routers import user, instance
from .sql.database import session_manager
from .utils.logging import logger
from .sql.init_data import initialize_data


def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags}-{route.name}"

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Before startup
    # Initialize the database
    try:
        await session_manager.create_all()
        await initialize_data()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
    # Initialize the LXD Manager
    try:
        LXDManager.initialize()
        logger.info("LXD Manager initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize LXD Manager: {str(e)}")
    yield
    # After shutdown
    if session_manager._engine is not None:
        # Close the DB connection
        await session_manager.close()

app = FastAPI(
  generate_unique_id_function=custom_generate_unique_id,
  lifespan=lifespan
)

# Add error handling middleware
@app.middleware("http")
async def exception_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except HTTPException as exc:
        # Log HTTP exceptions but let FastAPI handle the response
        logger.error(f"HTTP error in {request.url.path}: {exc.detail}")
        raise
    except Exception as exc:
        # Log unhandled exceptions and convert to 500 error
        error_message = str(exc)
        logger.error(f"Unhandled error in {request.url.path}: {error_message}")
        
        # Extract a meaningful operation name from the path
        path_parts = request.url.path.strip('/').split('/')
        operation = "process request"
        if len(path_parts) > 0:
            operation = f"process {path_parts[-1]}" if len(path_parts) == 1 else f"{path_parts[-1]} {path_parts[-2]}"
        
        return JSONResponse(
            status_code=500,
            content={"detail": f"Failed to {operation.replace('_', ' ')}"}
        )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user.router)
app.include_router(instance.router)


@app.get("/", tags=["root"])
async def root():
    return {"message": "Hello Bigger Applications!"}