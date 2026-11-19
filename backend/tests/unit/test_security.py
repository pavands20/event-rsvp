"""Unit tests for password hashing, session creation and startup seeding.

Covers US-001 acceptance criteria for bcrypt hashing (NFR-002), opaque
session tokens, and idempotent bootstrap/smoke-user seeding.
"""

from __future__ import annotations

from datetime import UTC, datetime
from unittest.mock import patch

from sqlalchemy import select

from app.config import Settings
from app.models import Organiser
from app.models import Session as SessionModel
from app.security import create_session, hash_password, seed_initial_users, verify_password


def _make_settings(**kwargs) -> Settings:
    defaults = dict(
        database_url="sqlite:///./app.db",
        secret_key="",
        jwt_secret_key="",
        media_root="./media",
        allowed_origins=[],
        bootstrap_admin_email=None,
        bootstrap_admin_password=None,
        smoke_test_email=None,
        smoke_test_password=None,
    )
    defaults.update(kwargs)
    return Settings(**defaults)


# -- bcrypt hashing (NFR-002) ------------------------------------------------


def test_hash_password_is_bcrypt_hash() -> None:
    hashed = hash_password("supersecret")
    assert hashed.startswith("$2")
    assert hashed != "supersecret"


def test_verify_password_accepts_correct_password() -> None:
    hashed = hash_password("correctpass")
    assert verify_password("correctpass", hashed) is True


def test_verify_password_rejects_wrong_password() -> None:
    hashed = hash_password("correctpass")
    assert verify_password("wrongpassword", hashed) is False


# -- session tokens ----------------------------------------------------------


def test_create_session_returns_opaque_token(db_session) -> None:  # type: ignore[no-untyped-def]
    organiser = Organiser(email="tok@example.com", password_hash=hash_password("password123"))
    db_session.add(organiser)
    db_session.commit()
    db_session.refresh(organiser)

    token = create_session(db_session, organiser.id)
    assert isinstance(token, str)
    assert len(token) > 0

    row = db_session.scalar(select(SessionModel).where(SessionModel.token == token))
    assert row is not None
    assert row.organiser_id == organiser.id
    assert row.revoked is False
    assert row.expires_at > datetime.now(UTC)


# -- seeding -----------------------------------------------------------------


def test_seeds_bootstrap_admin_when_env_set(db_session) -> None:  # type: ignore[no-untyped-def]
    email = "admin@example.com"
    st = _make_settings(bootstrap_admin_email=email, bootstrap_admin_password="adminpass123")
    with patch("app.security.settings", st):
        seed_initial_users(db_session)

    rows = db_session.scalars(select(Organiser).where(Organiser.email == email)).all()
    assert len(rows) == 1
    assert verify_password("adminpass123", rows[0].password_hash)


def test_seeds_bootstrap_admin_idempotent(db_session) -> None:  # type: ignore[no-untyped-def]
    email = "admin@example.com"
    st = _make_settings(bootstrap_admin_email=email, bootstrap_admin_password="adminpass123")
    with patch("app.security.settings", st):
        seed_initial_users(db_session)
        seed_initial_users(db_session)

    rows = db_session.scalars(select(Organiser).where(Organiser.email == email)).all()
    assert len(rows) == 1


def test_seeds_smoke_test_user_when_env_set(db_session) -> None:  # type: ignore[no-untyped-def]
    email = "smoke@example.com"
    st = _make_settings(smoke_test_email=email, smoke_test_password="smokepass123")
    with patch("app.security.settings", st):
        seed_initial_users(db_session)

    rows = db_session.scalars(select(Organiser).where(Organiser.email == email)).all()
    assert len(rows) == 1
    assert verify_password("smokepass123", rows[0].password_hash)


def test_seeds_smoke_test_user_idempotent(db_session) -> None:  # type: ignore[no-untyped-def]
    email = "smoke@example.com"
    st = _make_settings(smoke_test_email=email, smoke_test_password="smokepass123")
    with patch("app.security.settings", st):
        seed_initial_users(db_session)
        seed_initial_users(db_session)

    rows = db_session.scalars(select(Organiser).where(Organiser.email == email)).all()
    assert len(rows) == 1


def test_seeds_nothing_without_env_vars(db_session) -> None:  # type: ignore[no-untyped-def]
    st = _make_settings()
    with patch("app.security.settings", st):
        seed_initial_users(db_session)

    rows = db_session.scalars(select(Organiser)).all()
    assert len(rows) == 0


def test_seeds_both_admin_and_smoke_user(db_session) -> None:  # type: ignore[no-untyped-def]
    st = _make_settings(
        bootstrap_admin_email="admin@example.com",
        bootstrap_admin_password="adminpass123",
        smoke_test_email="smoke@example.com",
        smoke_test_password="smokepass123",
    )
    with patch("app.security.settings", st):
        seed_initial_users(db_session)

    all_rows = db_session.scalars(select(Organiser)).all()
    assert len(all_rows) == 2
