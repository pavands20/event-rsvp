# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Organiser authentication and event creation foundation

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Sign up as an organiser | 5 | backend-agent | — |
| US-002 | Story | Sign in as an organiser | 3 | backend-agent | US-001 |
| US-003 | Story | Sign out | 2 | frontend-agent | US-002 |
| US-004 | Story | Session security for organiser pages | 3 | integration-agent | US-002 |
| US-005 | Story | Create an event | 5 | backend-agent | US-001 |

## Sprint 2: Sprint 2

Event management (edit, delete, list) and public event page

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-006 | Story | Edit my event | 5 | backend-agent | US-005 |
| US-007 | Story | Delete my event | 3 | backend-agent | US-005 |
| US-008 | Story | View my events list | 5 | backend-agent | US-005 |
| US-009 | Story | View a public event page | 5 | frontend-agent | US-005 |

## Sprint 3: Sprint 3

Guest RSVP submission, RSVP updates, and capacity enforcement

Capacity: 20 points · Committed: 16

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-010 | Story | Submit an RSVP | 8 | backend-agent | US-009 |
| ↳ US-010-T1 | Task | Add rsvps table to database schema with unique constraint on (event_id, email) | — | backend-agent | — |
| ↳ US-010-T2 | Task | Implement POST /public/events/{token}/rsvp endpoint with input validation and upsert logic | — | backend-agent | — |
| ↳ US-010-T3 | Task | Build RSVP form component with responsive layout on the public event page | — | frontend-agent | — |
| US-011 | Story | Update my RSVP by re-answering | 3 | backend-agent | US-010 |
| US-012 | Story | Refuse Yes answers when capacity is reached | 5 | backend-agent | US-010 |

## Sprint 4: Sprint 4

RSVP closing/reopening, guest list with filters, and CSV export

Capacity: 20 points · Committed: 13

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-013 | Story | Close and reopen RSVPs | 5 | backend-agent | US-005 |
| US-014 | Story | View the guest list with response filter and headcount | 5 | frontend-agent | US-010 |
| US-015 | Story | Export the guest list as CSV | 3 | backend-agent | US-014 |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
