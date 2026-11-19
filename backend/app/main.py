"""Application entrypoint.

One router per component that owns endpoints, one route per endpoint the API
spec declares. Every generated route is a stub that returns a 501, so the
service starts, serves its OpenAPI document and passes its tests before a
single handler is implemented.
"""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401 -- imported so the tables register before create_all
from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routers import auth as auth_router
from app.routers import events as events_router
from app.routers import public as public_router
from app.security import seed_initial_users


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """The scaffold ships no migrations, so the tables are created from the models
    when the application starts. Replace this with Alembic before anything holds data
    worth keeping.

    This runs on startup and not at import, so importing the application never opens a
    connection. A test can therefore point `get_db` at a database of its own, and a
    deployment whose `DATABASE_URL` names a server that is not up fails where you can
    read the error, not while pytest collects the files.
    """
    Base.metadata.create_all(bind=engine)
    # Seed the platform's first admin and smoke-test user, idempotently, but only
    # when the platform set their credentials. Local runs and tests seed nothing.
    with SessionLocal() as session:
        seed_initial_users(session)
    yield


app = FastAPI(
    title="Event RSVP",
    description=(
        "Publish an event and collect RSVPs without asking guests to create an "
        "account. Organisers sign up, create and manage their own events, and "
        "see their guest lists; guests answer through a hard-to-guess public link."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

# The SPA runs on a different origin than the API, so the browser refuses its calls
# unless that origin is allowed here. In development that is the Vite dev server; when
# deployed, the platform injects the frontend's real URL as ALLOWED_ORIGINS (comma
# separated). Point ALLOWED_ORIGINS at the real thing and nothing else has to change.
_dev_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins or _dev_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(events_router.router)
app.include_router(public_router.router)


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness probe, and the only route here that is not a stub."""
    return {"status": "ok"}
