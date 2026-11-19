"""Application settings, read from the environment once at import.

The platform always provides these to the deployed API; each has a working
local default so a fresh clone runs without them. No value is a secret worth
hiding from the process that reads it, so plain strings are fine -- but
`SECRET_KEY` is the *public* shared bearer the frontend sends, never used to
sign anything; `JWT_SECRET_KEY` is the private key that signs tokens.
"""

from __future__ import annotations

import os
from dataclasses import dataclass


def _split_origins(raw: str) -> list[str]:
    return [o.strip() for o in raw.split(",") if o.strip()]


@dataclass(frozen=True)
class Settings:
    database_url: str
    # Public shared bearer the frontend sends on every call. Never sign with it.
    secret_key: str
    # Private key that signs tokens and sessions.
    jwt_secret_key: str
    # Writable directory that survives redeploys.
    media_root: str
    # Origins allowed by CORS (the frontend's origin(s)).
    allowed_origins: list[str]
    # First admin, seeded idempotently on startup when both are set.
    bootstrap_admin_email: str | None
    bootstrap_admin_password: str | None
    # One normal user, seeded idempotently on startup when both are set.
    smoke_test_email: str | None
    smoke_test_password: str | None


def _get(name: str) -> str:
    value = os.getenv(name, "")
    return value


def load_settings() -> Settings:
    return Settings(
        database_url=os.getenv("DATABASE_URL", "sqlite:///./app.db"),
        secret_key=_get("SECRET_KEY"),
        jwt_secret_key=_get("JWT_SECRET_KEY"),
        media_root=os.getenv("MEDIA_ROOT", "./media"),
        allowed_origins=_split_origins(_get("ALLOWED_ORIGINS")),
        bootstrap_admin_email=os.getenv("BOOTSTRAP_ADMIN_EMAIL") or None,
        bootstrap_admin_password=os.getenv("BOOTSTRAP_ADMIN_PASSWORD") or None,
        smoke_test_email=os.getenv("SMOKE_TEST_EMAIL") or None,
        smoke_test_password=os.getenv("SMOKE_TEST_PASSWORD") or None,
    )


settings = load_settings()
