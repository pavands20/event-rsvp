"""SQLAlchemy models for the Event RSVP data model.

The approved architecture declares four entities -- organisers, sessions,
events and rsvps -- and a unique constraint on (event_id, guest_email) that
gives RSVP submission its "update instead of insert" deduplication. These
tables are the structural schema the rest of the API is built against;
`main.py` imports this module before it creates the schema.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    Uuid,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def _utcnow() -> datetime:
    return datetime.now(UTC)


class Organiser(Base):
    """An organiser: signs up with email + password, owns events."""

    __tablename__ = "organisers"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )

    events: Mapped[list[Event]] = relationship(
        back_populates="organiser", cascade="all, delete-orphan"
    )
    sessions: Mapped[list[Session]] = relationship(
        back_populates="organiser", cascade="all, delete-orphan"
    )


class Session(Base):
    """A server-side session token issued at sign-in and revoked at sign-out."""

    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    organiser_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("organisers.id", ondelete="CASCADE"), nullable=False
    )
    token: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    organiser: Mapped[Organiser] = relationship(back_populates="sessions")


class Event(Base):
    """An event an organiser publishes; guests RSVP through its public token."""

    __tablename__ = "events"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    organiser_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("organisers.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    start_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    location: Mapped[str] = mapped_column(String(200), nullable=False)
    capacity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    public_token: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    rsvps_open: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow, onupdate=_utcnow
    )

    organiser: Mapped[Organiser] = relationship(back_populates="events")
    rsvps: Mapped[list[Rsvp]] = relationship(back_populates="event", cascade="all, delete-orphan")


class Rsvp(Base):
    """One guest's answer to one event, deduplicated by (event_id, guest_email)."""

    __tablename__ = "rsvps"
    __table_args__ = (UniqueConstraint("event_id", "guest_email", name="uq_rsvps_event_email"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    event_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("events.id", ondelete="CASCADE"), nullable=False
    )
    guest_name: Mapped[str] = mapped_column(String(200), nullable=False)
    guest_email: Mapped[str] = mapped_column(String(255), nullable=False)
    response: Mapped[str] = mapped_column(String(10), nullable=False)
    extra_guests: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    answered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow, onupdate=_utcnow
    )

    event: Mapped[Event] = relationship(back_populates="rsvps")


__all__ = ["Base", "Event", "Organiser", "Rsvp", "Session"]
