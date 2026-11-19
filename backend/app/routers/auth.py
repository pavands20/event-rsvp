"""Organiser authentication routes.

One route per endpoint the API spec declares for /auth. Each is a stub that
declares its response model so the OpenAPI document is complete, and raises
501 until the handler is implemented in the development sprint.
"""

from fastapi import APIRouter, HTTPException

from app.schemas import AuthResponse, MessageResponse, SigninRequest, SignupRequest

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=201)
async def signup(payload: SignupRequest) -> AuthResponse:
    raise HTTPException(status_code=501, detail="Not implemented")


@router.post("/signin", response_model=AuthResponse)
async def signin(payload: SigninRequest) -> AuthResponse:
    raise HTTPException(status_code=501, detail="Not implemented")


@router.post("/signout", response_model=MessageResponse)
async def signout() -> MessageResponse:
    raise HTTPException(status_code=501, detail="Not implemented")
