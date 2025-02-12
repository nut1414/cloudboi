from fastapi import Depends, FastAPI
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .dependencies import get_token_header
from .routers import items, users, admin, testapi, instance
from .websocket.proxy import router as websocket_router
from .sql.database import session_manager


def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags}-{route.name}"

# init_db()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Before startup
    # Initialize the database tables
    await session_manager.create_all()
    yield
    # After shutdown
    if session_manager._engine is not None:
        # Close the DB connection
        await session_manager.close()

app = FastAPI(
  generate_unique_id_function=custom_generate_unique_id,
  lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(testapi.router)
app.include_router(users.router)
app.include_router(items.router)
app.include_router(instance.router)
app.include_router(
    admin.router,
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(get_token_header)],
    # responses={418: {"description": "I'm a teapot"}},
)
app.include_router(websocket_router)


@app.get("/", tags=["root"])
async def root():
    return {"message": "Hello Bigger Applications!"}