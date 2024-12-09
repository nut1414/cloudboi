from fastapi import Depends, FastAPI
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware

from .dependencies import get_token_header
from .routers import items, users, admin
from .websocket.proxy import router as websocket_router


def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags}-{route.name}"


app = FastAPI(
  generate_unique_id_function=custom_generate_unique_id
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(users.router)
app.include_router(items.router)
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