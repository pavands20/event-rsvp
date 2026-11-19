# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| POST | /auth/signin | signin | `backend/app/routers/auth.py:47` | — |
| POST | /auth/signout | signout | `backend/app/routers/auth.py:59` | — |
| POST | /auth/signup | signup | `backend/app/routers/auth.py:27` | — |
| GET | /events | list_events | `backend/app/routers/events.py:28` | — |
| POST | /events | create_event | `backend/app/routers/events.py:33` | — |
| DELETE | /events/{event_id} | delete_event | `backend/app/routers/events.py:48` | — |
| GET | /events/{event_id} | get_event | `backend/app/routers/events.py:38` | — |
| PUT | /events/{event_id} | update_event | `backend/app/routers/events.py:43` | — |
| GET | /events/{event_id}/guests | list_guests | `backend/app/routers/events.py:58` | — |
| GET | /events/{event_id}/guests.csv | export_guests_csv | `backend/app/routers/events.py:66` | — |
| PATCH | /events/{event_id}/rsvp-status | set_rsvp_status | `backend/app/routers/events.py:53` | — |
| GET | /health | health | `backend/app/main.py:72` | Liveness probe, and the only route here that is not a stub. |
| GET | /public/events/{token} | get_public_event | `backend/app/routers/public.py:16` | — |
| POST | /public/events/{token}/rsvp | submit_rsvp | `backend/app/routers/public.py:21` | — |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
_Code matches the designed API._
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `2f37af7`
<!-- sdlc:auto:end source -->
