# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| GET | /health | health | `backend/app/main.py:57` | Liveness probe, and the only route here that is not a stub. |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- DELETE /events/{event_id}
- GET /events
- GET /events/{event_id}
- GET /events/{event_id}/guests
- GET /events/{event_id}/guests.csv
- GET /public/events/{token}
- PATCH /events/{event_id}/rsvp-status
- POST /auth/signin
- POST /auth/signout
- POST /auth/signup
- POST /events
- POST /public/events/{token}/rsvp
- PUT /events/{event_id}
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `3f9a837`
<!-- sdlc:auto:end source -->
