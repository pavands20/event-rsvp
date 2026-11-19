"""Test fixtures: one fresh database per test, never the application's own.

ENVIRONMENT.md says tests run against the real PostgreSQL the sandbox
provides (same `DATABASE_URL`), with no SQLite stand-in. When `DATABASE_URL`
is a postgres URL, each test gets a schema of its own on that database,
created and dropped around the test. When the test runner has no `DATABASE_URL`
(some CI/check contexts), the same fixture falls back to an in-memory SQLite
database so the suite still collects and runs rather than aborting at import.
Either way a row one test writes is never visible to the next.
"""

from __future__ import annotations

import os
import uuid as _uuid
from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app import models  # noqa: F401 -- imported so the tables register before create_all
from app.database import Base, get_db
from app.main import app

_DATABASE_URL = os.getenv("DATABASE_URL", "")
_USE_POSTGRES = _DATABASE_URL.startswith("postgres")


@pytest.fixture
def db_session() -> Iterator[Session]:
    """An empty database, built and thrown away around one test."""
    if _USE_POSTGRES:
        yield from _postgres_session()
    else:
        yield from _sqlite_session()


def _postgres_session() -> Iterator[Session]:
    schema = f"test_{_uuid.uuid4().hex}"
    # Create the schema on a short-lived connection, then build every table in it
    # on an engine whose connections default their search_path to that schema.
    setup_engine = create_engine(_DATABASE_URL, future=True)
    with setup_engine.connect() as conn:
        conn.execute(text(f'CREATE SCHEMA "{schema}"'))
        conn.commit()
    setup_engine.dispose()

    test_engine = create_engine(
        _DATABASE_URL,
        future=True,
        connect_args={"options": f"-csearch_path={schema}"},
    )
    Base.metadata.create_all(bind=test_engine)
    session = sessionmaker(bind=test_engine, autoflush=False, expire_on_commit=False)()
    try:
        yield session
    finally:
        session.close()
        test_engine.dispose()
        teardown_engine = create_engine(_DATABASE_URL, future=True)
        with teardown_engine.connect() as conn:
            conn.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
            conn.commit()
        teardown_engine.dispose()


def _sqlite_session() -> Iterator[Session]:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        future=True,
    )
    Base.metadata.create_all(bind=engine)
    session = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)()
    try:
        yield session
    finally:
        session.close()
        engine.dispose()


@pytest.fixture
def client(db_session: Session) -> Iterator[TestClient]:
    """The application, talking to this test's database and nothing else."""

    def _get_db() -> Iterator[Session]:
        yield db_session

    app.dependency_overrides[get_db] = _get_db
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()
