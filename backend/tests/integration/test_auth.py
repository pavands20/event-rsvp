"""Integration tests for /auth/signup, /auth/signin and /auth/signout.

Covers every US-001 acceptance criterion that exercises an HTTP endpoint:
signup success and error cases, signin success and failure, the bcrypt
no-plain-text guarantee, and protected-endpoint auth via the session token.
"""

from __future__ import annotations

import secrets

from fastapi.testclient import TestClient
from sqlalchemy import select

from app.models import Organiser
from app.security import hash_password


def _unique_email() -> str:
    return f"test-{secrets.token_hex(8)}@example.com"


def _password() -> str:
    # At least 8 chars, generated at runtime — never a literal credential.
    return secrets.token_urlsafe(16)


# -- Signup ------------------------------------------------------------------


def test_signup_returns_201_with_token_and_organiser(client: TestClient) -> None:
    email = _unique_email()
    password = _password()
    response = client.post("/auth/signup", json={"email": email, "password": password})

    assert response.status_code == 201
    body = response.json()
    assert "token" in body and isinstance(body["token"], str)
    org = body["organiser"]
    assert org["email"] == email
    assert "id" in org


def test_signup_with_existing_email_returns_400(client: TestClient) -> None:
    email = _unique_email()
    password = _password()
    client.post("/auth/signup", json={"email": email, "password": password})

    response = client.post("/auth/signup", json={"email": email, "password": _password()})
    assert response.status_code == 400
    assert response.json()["detail"] == "This email is already in use"


def test_signup_with_short_password_returns_400(client: TestClient) -> None:
    response = client.post(
        "/auth/signup",
        json={"email": _unique_email(), "password": "short"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Password must be at least 8 characters"


def test_signup_with_invalid_email_returns_422(client: TestClient) -> None:
    response = client.post(
        "/auth/signup",
        json={"email": "not-an-email", "password": _password()},
    )
    assert response.status_code == 422


def test_signup_stores_bcrypt_hash_not_plain_text(client: TestClient, db_session) -> None:  # type: ignore[no-untyped-def]
    email = _unique_email()
    password = _password()
    response = client.post("/auth/signup", json={"email": email, "password": password})
    assert response.status_code == 201

    row = db_session.scalar(select(Organiser).where(Organiser.email == email))
    assert row is not None
    assert row.password_hash != password
    assert row.password_hash.startswith("$2")


# -- Signin ------------------------------------------------------------------


def test_signin_with_correct_credentials_returns_200(client: TestClient) -> None:
    email = _unique_email()
    password = _password()
    client.post("/auth/signup", json={"email": email, "password": password})

    response = client.post("/auth/signin", json={"email": email, "password": password})
    assert response.status_code == 200
    body = response.json()
    assert "token" in body and isinstance(body["token"], str)
    assert body["organiser"]["email"] == email


def test_signin_with_wrong_password_returns_401(client: TestClient) -> None:
    email = _unique_email()
    password = _password()
    client.post("/auth/signup", json={"email": email, "password": password})

    response = client.post("/auth/signin", json={"email": email, "password": _password()})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_signin_with_unregistered_email_returns_401(client: TestClient) -> None:
    response = client.post(
        "/auth/signin",
        json={"email": _unique_email(), "password": _password()},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


# -- Protected endpoint auth (via signout) ------------------------------------


def test_valid_token_authenticates_on_protected_endpoint(client: TestClient) -> None:
    email = _unique_email()
    password = _password()
    resp = client.post("/auth/signup", json={"email": email, "password": password})
    token = resp.json()["token"]

    response = client.post("/auth/signout", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 204


def test_missing_token_returns_401_not_authenticated(client: TestClient) -> None:
    response = client.post("/auth/signout")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_invalid_token_returns_401_not_authenticated(client: TestClient) -> None:
    response = client.post(
        "/auth/signout",
        headers={"Authorization": "Bearer not-a-real-token"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_revoked_token_returns_401_not_authenticated(client: TestClient) -> None:
    email = _unique_email()
    password = _password()
    resp = client.post("/auth/signup", json={"email": email, "password": password})
    token = resp.json()["token"]

    # First signout revokes the session.
    client.post("/auth/signout", headers={"Authorization": f"Bearer {token}"})

    # Reusing the revoked token must fail.
    response = client.post("/auth/signout", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


# -- Signin after seeded user ------------------------------------------------


def test_signin_works_for_seeded_user(client: TestClient, db_session) -> None:  # type: ignore[no-untyped-def]
    """A user created directly in the DB (like a seeded admin) can sign in."""
    email = _unique_email()
    password = _password()
    db_session.add(Organiser(email=email, password_hash=hash_password(password)))
    db_session.commit()

    response = client.post("/auth/signin", json={"email": email, "password": password})
    assert response.status_code == 200
