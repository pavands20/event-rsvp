# Traceability Matrix

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start legend -->
Built from recorded links, not written by a model: requirement key → plan item (`source_stable_key`) → development ticket (`stable_key`) → the ticket's test steps → the last live deployment that started after the work finished. **AC tests** counts the story's acceptance criteria that have a test case, and those whose test cases all passed in the latest finished E2E run.
<!-- sdlc:auto:end legend -->

<!-- sdlc:auto:start matrix -->
| Requirement | Epic | Title | Plan items | Sprint | Design | Code | Commits | Ticket | Tests | AC tests | Deployed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| US-001 | EPIC-001 | Sign up as an organiser | US-001 | 1 | POST /auth/signup, api, db, organisers, sessions, spa | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-002 | EPIC-001 | Sign in as an organiser | US-002 | 1 | POST /auth/signin, api, organisers, sessions, spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-003 | EPIC-001 | Sign out | US-003 | 1 | POST /auth/signout, api, sessions, spa | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-004 | EPIC-001 | Session security for organiser pages | US-004 | 1 | api, sessions, spa | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-005 | EPIC-002 | Create an event | US-005 | 1 | POST /events, api, db, events, spa | — | — | not started | not run | 0/5 tested · 0/5 passing | — |
| US-006 | EPIC-002 | Edit my event | US-006 | 2 | PUT /events/{event_id}, api, events, spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-007 | EPIC-002 | Delete my event | US-007 | 2 | DELETE /events/{event_id}, api, events, rsvps, spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-008 | EPIC-002 | View my events list | US-008 | 2 | GET /events, api, events, rsvps, spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-009 | EPIC-003 | View a public event page | US-009 | 2 | GET /public/events/{token}, api, events, spa | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-010 | EPIC-003 | Submit an RSVP | US-010, US-010-T1, US-010-T2, US-010-T3 | 3 | POST /public/events/{token}/rsvp, api, db, events, rsvps, spa | — | — | not started | not run | 0/5 tested · 0/5 passing | — |
| US-011 | EPIC-003 | Update my RSVP by re-answering | US-011 | 3 | POST /public/events/{token}/rsvp, api, rsvps | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-012 | EPIC-004 | Refuse Yes answers when capacity is reached | US-012 | 3 | POST /public/events/{token}/rsvp, api, events, rsvps | — | — | not started | not run | 0/5 tested · 0/5 passing | — |
| US-013 | EPIC-005 | Close and reopen RSVPs | US-013 | 4 | PATCH /events/{event_id}/rsvp-status, api, events, spa | — | — | not started | not run | 0/5 tested · 0/5 passing | — |
| US-014 | EPIC-006 | View the guest list with response filter and headcount | US-014 | 4 | GET /events/{event_id}/guests, api, events, rsvps, spa | — | — | not started | not run | 0/5 tested · 0/5 passing | — |
| US-015 | EPIC-006 | Export the guest list as CSV | US-015 | 4 | GET /events/{event_id}/guests.csv, api, events, rsvps | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
<!-- sdlc:auto:end matrix -->
