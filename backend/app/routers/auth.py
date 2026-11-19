"""Organiser authentication routes: signup, signin, signout.

Signup creates an organiser with a bcrypt-hashed password and issues an
opaque session token. Signin verifies credentials and issues a token.
Signout revokes the session. All tokens are opaque strings stored in the
sessions table -- never JWTs -- so the server can revoke them at any time.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Organiser
from app.models import Session as SessionModel
from app.schemas import AuthResponse, OrganiserInfo, SigninRequest, SignupRequest
from app.security import create_session, get_current_session, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

DbSession = Annotated[Session, Depends(get_db)]


@router.post("/signup", response_model=AuthResponse, status_code=201)
async def signup(payload: SignupRequest, db: DbSession) -> AuthResponse:
    if len(payload.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    existing = db.scalar(select(Organiser).where(Organiser.email == payload.email))
    if existing is not None:
        raise HTTPException(status_code=400, detail="This email is already in use")

    organiser = Organiser(email=payload.email, password_hash=hash_password(payload.password))
    db.add(organiser)
    db.commit()
    db.refresh(organiser)
    token = create_session(db, organiser.id)
    return AuthResponse(
        token=token,
        organiser=OrganiserInfo(id=organiser.id, email=organiser.email),
    )


@router.post("/signin", response_model=AuthResponse)
async def signin(payload: SigninRequest, db: DbSession) -> AuthResponse:
    organiser = db.scalar(select(Organiser).where(Organiser.email == payload.email))
    if organiser is None or not verify_password(payload.password, organiser.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_session(db, organiser.id)
    return AuthResponse(
        token=token,
        organiser=OrganiserInfo(id=organiser.id, email=organiser.email),
    )


@router.post("/signout", status_code=204)
async def signout(
    session: Annotated[SessionModel, Depends(get_current_session)],
    db: DbSession,
) -> None:
    session.revoked = True
    db.commit()
