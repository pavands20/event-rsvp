"""Application entrypoint.

Generated from the approved architecture: one router per component that owns
endpoints, one route per endpoint the API spec declares. Every generated route
is a stub that returns a typed placeholder, so the service starts, serves its
OpenAPI document and passes its tests before a single handler is implemented.
"""

import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401 -- imported so the tables register before create_all
from app.database import Base, engine


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
    yield


app = FastAPI(
    title="Event RSVP",
    description="Event RSVP App: Requirements Version 1.0. Prepared for a demo build. 1. Purpose Small organisers (clubs, teams, friends planning a get-together) need a simple way to publish an event and collect RSVPs without asking guests to create an account. The organiser shares a link; guests answer in under a minute; the organiser sees who is coming at a glance. 2. Users \u007f Organiser: signs up with email and password, creates and manages their own events, and sees the guest lists of their own events only. \u007f Guest: opens a shared event link and answers the RSVP. No account, no login. 3. Functional requirements ID Requirement Acceptance criteria FR-1 Organiser sign-up, sign-in and sign-out Email + password (min 8 characters). Duplicate email is refused with a clear message. Signed-out users cannot reach organiser pages. FR-2 Create an event Title (required, max 120), description (optional, max 2000), date and start time (required, must be in the future), location (required, max 200), capacity (optional, whole number 1-1000). Each event gets a unique, hard-to-guess public link. FR-3 Edit and delete my events Organiser can change any field of their own event. Delete asks for confirmation and removes the event and its RSVPs. Another organiser's event cannot be seen, edited or deleted. FR-4 My events list Shows the organiser's events, upcoming first then past, each with date, title and counts of Yes / No / Maybe answers. FR-5 Public event page and RSVP Anyone with the link sees title, date, time, location and description, and answers with name (required), email (required, valid format), response (Yes / No / Maybe) and number of extra guests (0-5, only for Yes). FR-6 Change my answer Answering again with the same email for the same event updates the earlier answer instead of adding a second one. FR-7 Capacity When the Yes answers plus their extra guests reach capacity, new Yes answers are refused with \"This event is full\"; No and Maybe are still accepted. FR-8 Close RSVPs Organiser",
    version="0.1.0",
    lifespan=lifespan,
)

# The SPA runs on a different origin than the API, so the browser refuses its calls
# unless that origin is allowed here. In development that is the Vite dev server; when
# deployed, the platform injects the frontend's real URL as ALLOWED_ORIGINS (comma
# separated). Point ALLOWED_ORIGINS at the real thing and nothing else has to change.
_dev_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
_allowed_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins or _dev_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness probe, and the only route here that is not a stub."""
    return {"status": "ok"}
