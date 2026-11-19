"""Password hashing and startup user seeding.

Passwords are hashed with bcrypt -- the approved mechanism -- using the
``bcrypt`` package directly. ``passlib`` is still declared in
requirements.txt, but its 1.7.x bcrypt backend is incompatible with the
bcrypt 5.x runtime (its wrap-bug probe trips bcrypt 5's 72-byte check), so
the ``bcrypt`` package is used here instead. ``backend/conftest.py`` patches
``bcrypt.gensalt`` to 4 rounds, so hashing stays cheap in tests.
"""

from __future__ import annotations

import logging

import bcrypt
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.models import Organiser

logger = logging.getLogger(__name__)

# bcrypt only considers the first 72 bytes of a password; longer inputs make
# bcrypt 5 raise, so truncate to the bytes it would actually use.
_BCRYPT_MAX_BYTES = 72


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8")[:_BCRYPT_MAX_BYTES], bcrypt.gensalt()).decode(
        "utf-8"
    )


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(
            password.encode("utf-8")[:_BCRYPT_MAX_BYTES], password_hash.encode("utf-8")
        )
    except ValueError:
        return False


def _seed_one(session: Session, email: str, password: str) -> None:
    """Create the organiser named by ``email`` only when it does not yet exist."""
    existing = session.scalar(select(Organiser).where(Organiser.email == email))
    if existing is not None:
        return
    session.add(Organiser(email=email, password_hash=hash_password(password)))
    session.commit()
    logger.info("Seeded organiser %s from environment on startup", email)


def seed_initial_users(session: Session) -> None:
    """Seed the bootstrap admin and smoke-test user when their env vars are set.

    Without the vars set (local runs, tests) this seeds nothing. The admin is
    the highest role the app has; the smoke user is a normal organiser. Both are
    created only when no organiser with that email exists yet.
    """
    if settings.bootstrap_admin_email and settings.bootstrap_admin_password:
        _seed_one(session, settings.bootstrap_admin_email, settings.bootstrap_admin_password)
    if settings.smoke_test_email and settings.smoke_test_password:
        _seed_one(session, settings.smoke_test_email, settings.smoke_test_password)
