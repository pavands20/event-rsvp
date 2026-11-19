"""Organiser event routes.

One route per endpoint the API spec declares for /events (and the nested
guest list / CSV export / RSVP-status toggle). Each is a stub that declares
its response model so the OpenAPI document is complete, and raises 501 until
the handler is implemented in the development sprint.
"""

from typing import Annotated

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse

from app.schemas import (
    EventCreate,
    EventListItem,
    EventResponse,
    GuestListResponse,
    MessageResponse,
    ResponseEnum,
    RsvpStatusResponse,
    RsvpStatusUpdate,
)

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[EventListItem])
async def list_events() -> list[EventListItem]:
    raise HTTPException(status_code=501, detail="Not implemented")


@router.post("", response_model=EventResponse, status_code=201)
async def create_event(payload: EventCreate) -> EventResponse:
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: str) -> EventResponse:
    raise HTTPException(status_code=501, detail="Not implemented")


@router.put("/{event_id}", response_model=EventResponse)
async def update_event(event_id: str, payload: EventCreate) -> EventResponse:
    raise HTTPException(status_code=501, detail="Not implemented")


@router.delete("/{event_id}", response_model=MessageResponse)
async def delete_event(event_id: str) -> MessageResponse:
    raise HTTPException(status_code=501, detail="Not implemented")


@router.patch("/{event_id}/rsvp-status", response_model=RsvpStatusResponse)
async def set_rsvp_status(event_id: str, payload: RsvpStatusUpdate) -> RsvpStatusResponse:
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/{event_id}/guests", response_model=GuestListResponse)
async def list_guests(
    event_id: str,
    response: Annotated[ResponseEnum | None, Query()] = None,
) -> GuestListResponse:
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/{event_id}/guests.csv")
async def export_guests_csv(
    event_id: str,
    response: Annotated[ResponseEnum | None, Query()] = None,
) -> StreamingResponse:
    raise HTTPException(status_code=501, detail="Not implemented")
