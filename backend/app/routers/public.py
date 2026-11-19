"""Public event routes -- no auth required.

One route per endpoint the API spec declares for /public. The public event
page hides guest data; the RSVP endpoint is open to anyone with the link.
Each is a stub that declares its response model so the OpenAPI document is
complete, and raises 501 until the handler is implemented.
"""

from fastapi import APIRouter, HTTPException

from app.schemas import PublicEventResponse, RsvpRequest, RsvpResponse

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/events/{token}", response_model=PublicEventResponse)
async def get_public_event(token: str) -> PublicEventResponse:
    raise HTTPException(status_code=501, detail="Not implemented")


@router.post("/events/{token}/rsvp", response_model=RsvpResponse)
async def submit_rsvp(token: str, payload: RsvpRequest) -> RsvpResponse:
    raise HTTPException(status_code=501, detail="Not implemented")
