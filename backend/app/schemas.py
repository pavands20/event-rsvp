"""Pydantic request and response models for the Event RSVP API.

One schema per request body and per response shape the approved API spec
declares. The handlers are not implemented yet -- the router stubs declare
these as their `response_model` so the OpenAPI document is complete and the
frontend can be built against the agreed contract before any logic lands.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_serializer


class ResponseEnum(StrEnum):
    """The three answers a guest can give."""

    yes = "Yes"
    no = "No"
    maybe = "Maybe"


# -- Auth ---------------------------------------------------------------------


class SignupRequest(BaseModel):
    email: EmailStr
    password: str


class SigninRequest(BaseModel):
    email: EmailStr
    password: str


class OrganiserInfo(BaseModel):
    id: uuid.UUID
    email: str


class AuthResponse(BaseModel):
    token: str
    organiser: OrganiserInfo


class MessageResponse(BaseModel):
    message: str


# -- Events -------------------------------------------------------------------


class EventCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=2000)
    start_at: datetime
    location: str = Field(min_length=1, max_length=200)
    capacity: int | None = Field(default=None, ge=1, le=1000)


class EventUpdate(EventCreate):
    """PUT replaces any field, so it carries the same shape as the create."""


class EventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    public_token: str
    title: str
    description: str | None
    start_at: datetime
    location: str
    capacity: int | None
    rsvps_open: bool

    @field_serializer("start_at")
    def _serialize_start_at(self, value: datetime) -> str:
        if value.tzinfo is None:
            value = value.replace(tzinfo=UTC)
        else:
            value = value.astimezone(UTC)
        return value.isoformat().replace("+00:00", "Z")


class EventCounts(BaseModel):
    yes: int
    no: int
    maybe: int


class EventListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    start_at: datetime
    capacity: int | None
    counts: EventCounts

    @field_serializer("start_at")
    def _serialize_start_at(self, value: datetime) -> str:
        if value.tzinfo is None:
            value = value.replace(tzinfo=UTC)
        else:
            value = value.astimezone(UTC)
        return value.isoformat().replace("+00:00", "Z")


class RsvpStatusUpdate(BaseModel):
    rsvps_open: bool


class RsvpStatusResponse(BaseModel):
    id: uuid.UUID
    rsvps_open: bool


# -- Guests -------------------------------------------------------------------


class GuestItem(BaseModel):
    guest_name: str
    guest_email: str
    response: ResponseEnum
    extra_guests: int
    answered_at: datetime


class GuestListResponse(BaseModel):
    headcount: int
    guests: list[GuestItem]


# -- Public -------------------------------------------------------------------


class PublicEventResponse(BaseModel):
    title: str
    description: str | None
    start_at: datetime
    location: str
    rsvps_open: bool
    is_full: bool | None = None


class RsvpRequest(BaseModel):
    guest_name: str = Field(min_length=1, max_length=200)
    guest_email: EmailStr
    response: ResponseEnum
    extra_guests: int = Field(default=0, ge=0, le=5)


class RsvpResponse(BaseModel):
    guest_name: str
    guest_email: str
    response: ResponseEnum
    extra_guests: int
