from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware

from .routers import user, instance, lxd_cluster, billing
from .utils.logging import logger, configure_logging
from .startup import lifespan
from .container import AppContainer
from .utils.dependencies import configure_auth


def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags}-{route.name}"

app = FastAPI(
  generate_unique_id_function=custom_generate_unique_id,
  lifespan=lifespan
)

container = AppContainer()
app.state.container = container

modules = [
    # Router modules
    user,
    instance,
    lxd_cluster,
    billing,
]
for module in modules:
    container.wire(modules=[module])

# Configure auth system with a provider function that returns the user service
configure_auth(lambda: container.user_service())

configure_logging()

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
app.include_router(lxd_cluster.router)
app.include_router(billing.router)

@app.get("/", tags=["root"])
async def root():
    return {"message": "Hello Bigger Applications!"}