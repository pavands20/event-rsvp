"""Baseline unit tests for the scaffolded Pydantic schemas.

The platform runs `pytest` against this tree before any handler is
implemented, so there has to be something green in `tests/unit` as well as
`tests/integration`. These cover the contract the schema layer fixes for the
rest of the API: the response enum values, and the validation constraints
the approved requirements put on sign-up and RSVP submission.
"""

from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas import ResponseEnum, RsvpRequest, SignupRequest


def test_response_enum_values() -> None:
    assert ResponseEnum("Yes") is ResponseEnum.yes
    assert ResponseEnum("No") is ResponseEnum.no
    assert ResponseEnum("Maybe") is ResponseEnum.maybe


def test_signup_schema_accepts_short_password() -> None:
    """Password length is validated by the handler (400), not the schema (422)."""
    req = SignupRequest(email="organiser@example.com", password="short")
    assert req.password == "short"


def test_signup_accepts_valid_input() -> None:
    req = SignupRequest(email="organiser@example.com", password="long-enough")
    assert req.email == "organiser@example.com"


def test_rsvp_extra_guests_capped_at_five() -> None:
    with pytest.raises(ValidationError):
        RsvpRequest(
            guest_name="Guest",
            guest_email="guest@example.com",
            response=ResponseEnum.yes,
            extra_guests=6,
        )


def test_rsvp_rejects_invalid_email() -> None:
    with pytest.raises(ValidationError):
        RsvpRequest(
            guest_name="Guest",
            guest_email="not-an-email",
            response=ResponseEnum.maybe,
            extra_guests=0,
        )
