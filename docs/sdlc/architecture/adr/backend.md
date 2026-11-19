<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-11-19

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v4.

## Considered Options

- FastAPI 0.115
- Flask
- Django REST Framework

## Decision Outcome

Chosen option: FastAPI 0.115, because Approved by the product owner. Pydantic models provide automatic validation for capacity (1-1000) and extra guests (0-5) with clear error messages. Async support and OpenAPI docs come built-in.

## Consequences

FastAPI does not include an admin panel or ORM migrations out of the box, but SQLAlchemy and Alembic fill those gaps and are part of the scaffold.
<!-- sdlc:auto:end adr -->