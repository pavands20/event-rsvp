<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-11-19

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v4.

## Considered Options

- PostgreSQL 16
- SQLite
- MySQL 8

## Decision Outcome

Chosen option: PostgreSQL 16, because Approved by the product owner. Relational model fits organiser-event-RSVP with ownership and deduplication constraints. SQL count queries handle capacity headcount cleanly. Managed RDS provides encryption and backups.

## Consequences

Managed PostgreSQL has higher cost than embedded SQLite, but is justified by the need for concurrent access and managed backups.
<!-- sdlc:auto:end adr -->