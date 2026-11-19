# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-TECH · approved · source: requirements:technology-stack

Approved technology stack: FastAPI, AWS, PostgreSQL, React with TypeScript. Selected by the product owner; no substitution permitted.

- Backend: FastAPI 0.115 — REST API with clear request/response schemas; Pydantic models for automatic validation (capacity 1–1000, extra guests 0–5); serves built React assets from the same process for single-unit deployment.
- Cloud: AWS — single instance serving API and static frontend plus managed PostgreSQL; small scale, no autoscaling, one small instance.
- Database: PostgreSQL 16 — relational data (organisers own events, events have many RSVPs, RSVPs deduplicated by (event, email)); capacity enforcement via SQL count query; managed single instance; indefinite retention.
- Frontend: React 19 with TypeScript — single-page app with organiser dashboard, event editor, public RSVP form; component model maps to organiser vs. guest flows; backend serves built static assets.

### REQ-SCOPE · approved · source: requirements:scope

Lightweight delivery scope for a demo build. Capabilities cover organiser accounts, event CRUD, public RSVP, capacity enforcement, guest list, and CSV export.

Delivery scope: lightweight. Requirements version: 1.

Capabilities in scope:
- Organiser sign-up, sign-in, and sign-out
- Create events with title, description, date/time, location, capacity
- Edit and delete own events
- My events list with Yes/No/Maybe counts per event
- Public event page showing event details to anyone with the link
- Guest RSVP with name, email, response, and extra guests (up to 5)
- RSVP update when re-answered with same email
- Capacity enforcement refusing new Yes answers when full
- Basic guest list visible to organiser
- Responsive layout for phone and desktop (360px and up)
- Public event links use a random, hard-to-guess token in the URL
- Event date and time shown in a single timezone (UTC), no timezone picker
- RSVPs matched by email — anyone with a guest's email can update it
- Past events and RSVPs kept permanently with no automatic cleanup

Additional requirements from product owner:
- Organiser can close and reopen RSVPs for an event; RSVPs also close automatically once the event start time has passed
- Guest list filterable by response, with a total headcount (Yes answers plus their extra guests)
- Organiser can download an event's guest list as a CSV file

### REQ-FR-SIGNIN · approved · source: requirements:feature:sign-in-accounts

Organiser authentication: sign up with unique email and password (min 8 chars), sign in, sign out, and session expiry. No password recovery.

FR-1: Organiser sign-up, sign-in and sign-out.

- Sign up as organiser: Create an account with a unique email and a password of at least 8 characters. If the email is already registered, sign-up is refused with a clear message.
- Sign in as organiser: Sign in with email and password to access events and guest lists. Invalid credentials are refused with a clear message.
- Sign out: End the session by signing out, which clears the stored token and redirects to the sign-in page. Signed-out users cannot reach any organiser page.
- Session expiry: When a session token expires or the organiser signs out, protected pages and API endpoints are inaccessible and the user is redirected to sign in. If an organiser forgets their password, no recovery is available and access is permanently lost.

### REQ-FR-EVENT · approved · source: requirements:feature:event-management

Event creation, editing, deletion, events list, and RSVP closing/reopening. Each event gets a unique, hard-to-guess public link.

FR-2: Create an event — Title (required, max 120), description (optional, max 2000), date and start time (required, must be in the future), location (required, max 200), capacity (optional, whole number 1-1000). Each event gets a unique, hard-to-guess public link.

FR-3: Edit and delete my events — Organiser can change any field of their own event. Delete asks for confirmation and removes the event and its RSVPs. Another organiser's event cannot be seen, edited or deleted.

FR-4: My events list — Shows the organiser's events, upcoming first then past, each with date, title and counts of Yes / No / Maybe answers.

FR-8: Close RSVPs — Organiser can manually close or reopen RSVPs for an own event. RSVPs also close automatically once the event start time has passed, after which reopening is disabled.

Additional detail:
- Create an event: optional capacity; no capacity set means no limit.
- Edit an event: change any field at any time; editing another organiser's event is refused and not shown.
- Delete an event: confirmation prompt; permanently removes event and all RSVPs; deleting another organiser's event is refused.
- View events list: all events shown without pagination (scale is small: tens of organisers, hundreds of events).
- Close and reopen RSVPs: manual close/reopen; auto-close when event start time passes; reopen disabled after start time has passed.

### REQ-FR-RSVP · approved · source: requirements:feature:public-event-rsvp

Public event page and guest RSVP: anyone with the link sees event details and answers with name, email, response, and extra guests. Re-answering updates the existing RSVP. Capacity enforcement refuses new Yes answers when full.

FR-5: Public event page and RSVP — Anyone with the link sees title, date, time, location and description, and answers with name (required), email (required, valid format), response (Yes / No / Maybe) and number of extra guests (0-5, only for Yes). No guest emails or RSVP details are shown on the public page.

FR-6: Change my answer — Answering again with the same email for the same event updates the earlier answer instead of adding a second one. Changing from Yes to No clears the extra-guests count.

FR-7: Capacity — When the Yes answers plus their extra guests reach capacity, new Yes answers are refused with "This event is full"; No and Maybe are still accepted. Events with no capacity set never refuse for capacity. Updating an existing Yes answer to a new Yes with more extra guests is accepted only if the new total does not exceed capacity.

RSVP deduplication is by email only with no identity verification (accepted for demo).

### REQ-FR-GUESTLIST · approved · source: requirements:feature:guest-list-export

Guest list visible to organiser with filter by response and total headcount. CSV export downloads guest details, respecting active filter.

- View guest list: Organiser sees each guest's name, email, response, extra guests, and answer time, filterable by response type, with a total headcount (Yes answers plus extra guests) shown at the top. Viewing another organiser's guest list is refused. Empty state shown when no RSVPs.
- Export guest list as CSV: Download the event's guest list as a CSV file containing each guest's details. If a response filter is applied, only matching guests are included. Events with no RSVPs produce a CSV with headers but no data rows. Exporting another organiser's guest list is refused.

### NFR-001 · approved · source: requirements:nfr:NFR-001

Responsive layout for phone and desktop — 360px minimum width, no horizontal scrolling.

[usability] The RSVP form and public event page are usable on a 360px-wide phone screen without horizontal scrolling, and the layout adapts to larger desktop screens. Target: 360px minimum width.

### NFR-002 · approved · source: requirements:nfr:NFR-002

Passwords stored as bcrypt hashes, never plain text.

[security] Organiser passwords are stored as bcrypt hashes, never as plain text.

### NFR-003 · approved · source: requirements:nfr:NFR-003

Session protection for organiser pages and protected API endpoints.

[security] Organiser pages and protected API endpoints require a valid session token; signing out or token expiry ends the session and the user is redirected to the sign-in page.

### NFR-004 · approved · source: requirements:nfr:NFR-004

Hard-to-guess public event links using a cryptographically random token.

[security] Public event links contain a random, cryptographically hard-to-guess token in the URL so that uninvited people cannot find an event by guessing its address.

### NFR-005 · approved · source: requirements:nfr:NFR-005

Guest emails visible only to the event's organiser, never on the public event page.

[privacy] Guest emails and other guests' RSVP details are visible only to the event's organiser, never on the public event page.

### NFR-006 · approved · source: requirements:nfr:NFR-006

Accepted risk: RSVP updates without identity verification — anyone with a guest's email can update their RSVP.

[privacy] (accepted risk) Anyone who knows a guest's email can update that guest's RSVP because deduplication is by email with no identity verification. This is accepted for the demo build.

### NFR-007 · approved · source: requirements:nfr:NFR-007

Public event page load time under 2 seconds.

[performance] Public event pages load in under 2 seconds. Target: under 2 seconds.

### NFR-008 · approved · source: requirements:nfr:NFR-008

Clear error messages for every refused input.

[usability] Every refused input returns a clear message identifying the problem so the user knows what to fix.

### NFR-009 · approved · source: requirements:nfr:NFR-009

Accepted risk: No password recovery — forgotten passwords permanently lock access.

[usability] (accepted risk) No password recovery mechanism is provided. An organiser who forgets their password permanently loses access to their events and guest lists. This is accepted for the demo build.

### NFR-010 · approved · source: requirements:nfr:NFR-010

Event times shown in UTC only, no timezone selection UI.

[maintainability] Event date and time are stored and displayed in UTC with no timezone selection UI, so all users see the same time regardless of their location.

### NFR-011 · approved · source: requirements:nfr:NFR-011

Data retained indefinitely — no automatic cleanup of past events or RSVPs.

[maintainability] Past events and RSVPs are kept permanently with no automatic cleanup or deletion.
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
**Delivery scope:** lightweight  
**Approved:** 2026-11-19

**Capabilities in scope:** Organiser sign-up, sign-in, and sign-out, Create events with title, description, date/time, location, capacity, Edit and delete own events, My events list with Yes/No/Maybe counts per event, Public event page showing event details to anyone with the link, Guest RSVP with name, email, response, and extra guests (up to 5), RSVP update when re-answered with same email, Capacity enforcement refusing new Yes answers when full, Basic guest list visible to organiser, Responsive layout for phone and desktop (360px and up), Public event links use a random, hard-to-guess token in the URL, Event date and time shown in a single timezone (UTC), no timezone picker, RSVPs matched by email — anyone with a guest's email can update it, Past events and RSVPs kept permanently with no automatic cleanup

**Additional requirements:**

- Organiser can close and reopen RSVPs for an event; RSVPs also close automatically once the event start time has passed
- Guest list filterable by response, with a total headcount (Yes answers plus their extra guests)
- Organiser can download an event's guest list as a CSV file

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | You specified FastAPI, and it is a good match for a REST API with clear request/response schemas — exactly what your ten functional requirements describe (event CRUD, RSVP submission, guest list, CSV export). Pydantic models give you automatic validation for inputs like capacity (1–1000) and extra guests (0–5), so refused input returns clear error messages with little custom code. Serving the built React assets from the same process keeps deployment to one unit, matching your single-instance PaaS assumption. |
| cloud | AWS | AWS is the available cloud option and supports your architecture: a single instance serving the API and static frontend, plus managed PostgreSQL. Your scale is small with no autoscaling, so one small instance is plenty. The analyst's hosting assumption mentioned Render or Fly.io as simple-PaaS examples; AWS is the option on the list and works equally well for a single-instance demo, though operational overhead is slightly higher. |
| database | PostgreSQL | You specified PostgreSQL, and it fits naturally: your data is relational — organisers own events, events have many RSVPs, RSVPs are deduplicated by (event, email) — and capacity enforcement needs a count query (Yes answers plus extra guests) that SQL handles cleanly. Managed PostgreSQL on your PaaS is a single instance, which matches the small scale (tens of organisers, low thousands of RSVPs) and indefinite retention you described. |
| frontend | React | You specified React with TypeScript, and it fits the product: a single-page app with a handful of screens — organiser dashboard, event editor, public RSVP form — that needs to feel snappy on a 360px phone. React's component model maps cleanly onto your two user flows (organiser vs. guest link), and TypeScript catches the kind of field-mismatch bugs that would be annoying in a form-heavy app. The backend serves the built static assets, so the SPA is the whole frontend. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Organiser Authentication

Organisers create an account with email and password, sign in to access their events, and sign out to end their session. No password recovery is provided — an organiser who forgets their password permanently loses access to their events and guest lists. Assumptions: authentication uses JWT tokens issued by the FastAPI backend, stored client-side, and sent as Bearer tokens on protected requests; password hashing uses bcrypt.

### US-001: Sign up as an organiser

**Priority:** critical

> As a an organiser, I want to sign up with my email and a password, so that I can create and manage my own events.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | a person is not yet registered and is on the sign-up page | they submit a unique email and a password of at least 8 characters | the account is created, a JWT is issued, and the organiser is taken to their events list |
| AC-002 | a person submits an email that is already registered | they attempt to sign up | registration is refused and a clear message says the email is already in use |
| AC-003 | a person submits a password shorter than 8 characters | they attempt to sign up | registration is refused and a clear message indicates the minimum length |
| AC-004 | an organiser account has been created | the backend persists the new organiser | the stored password is a bcrypt hash, never the plain-text value |

### US-002: Sign in as an organiser

**Priority:** critical

> As a an organiser, I want to sign in with my email and password, so that I can access my events and guest lists.

| ID | Given | When | Then |
|---|---|---|---|
| AC-005 | an organiser has an active account | they submit the correct email and password | a JWT is issued and the organiser is taken to their events list |
| AC-006 | an organiser submits an incorrect password or unregistered email | they attempt to sign in | sign-in is refused and a clear message says the credentials are invalid |
| AC-007 | an organiser is signed in | the organiser navigates to a protected organiser page | the JWT is stored client-side and sent as a Bearer token on all subsequent protected requests |

### US-003: Sign out

**Priority:** high

> As a an organiser, I want to sign out, so that I can end my session on a shared device.

| ID | Given | When | Then |
|---|---|---|---|
| AC-008 | an organiser is signed in | they click sign out | the JWT is cleared from the client and the organiser is taken to the sign-in page |
| AC-009 | an organiser has signed out | they attempt to navigate to a protected page | they cannot reach any organiser page and are redirected to the sign-in page |

### US-004: Session security for organiser pages

**Priority:** high

> As a an organiser, I want my session to expire when I sign out or when my token is no longer valid, so that my events and guest lists are not accessible to someone using my device after I leave.

| ID | Given | When | Then |
|---|---|---|---|
| AC-010 | an organiser has signed out or their JWT has expired | they attempt to access an organiser page or protected API endpoint | the request is refused and the user is redirected to the sign-in page |
| AC-011 | no password recovery mechanism exists | an organiser forgets their password and attempts to recover it | a clear message states that password recovery is not available and access to their events is permanently lost |

## EPIC-002: Event Creation and Management

Organisers create, edit, and delete their own events, and see a list of their events with response counts. Each event gets a unique, hard-to-guess public link. Assumptions: public event links use a random UUID or cryptographically random token in the URL path (e.g. /e/{token}); event date/time is stored and displayed in UTC with no timezone selection UI; data is retained indefinitely with no automatic cleanup of past events.

### US-005: Create an event

**Priority:** critical

> As a an organiser, I want to create an event with title, description, date/time, location, and optional capacity, so that I can publish details for my guests to see and RSVP to.

| ID | Given | When | Then |
|---|---|---|---|
| AC-012 | an organiser is signed in and on the create-event page | they submit a title (max 120 chars), description (optional, max 2000 chars), date/time in the future, location (max 200 chars), and an optional capacity (whole number 1-1000) | the event is created and the organiser sees the event's unique public link |
| AC-013 | an organiser submits a date/time in the past | they attempt to create the event | creation is refused and a clear message says the date must be in the future |
| AC-014 | an organiser leaves a required field blank or exceeds a field length limit | they attempt to create the event | creation is refused and a clear message identifies the problem field |
| AC-015 | a new event has been created | the organiser views the event's public link | the link contains a random UUID or cryptographically random token that is hard to guess |
| AC-016 | an organiser does not set a capacity | they save the event | the event is created with no capacity limit |

### US-006: Edit my event

**Priority:** high

> As a an organiser, I want to edit any field of my own event, so that I can correct mistakes or update details as plans change.

| ID | Given | When | Then |
|---|---|---|---|
| AC-017 | an organiser is viewing one of their own events | they change any field and save | the event is updated with the new values |
| AC-018 | an organiser attempts to edit an event they do not own | they attempt to access the edit endpoint | the edit is refused and the event is not shown to them |
| AC-019 | an organiser submits invalid data (e.g. past date, over-length field) | they attempt to save | the edit is refused and a clear message identifies the problem |

### US-007: Delete my event

**Priority:** high

> As a an organiser, I want to delete my event with confirmation, so that I can remove cancelled or test events along with their RSVPs.

| ID | Given | When | Then |
|---|---|---|---|
| AC-020 | an organiser is viewing one of their own events | they click delete | a confirmation prompt appears asking the organiser to confirm |
| AC-021 | an organiser confirms deletion of their event | they confirm | the event and all of its RSVPs are permanently removed |
| AC-022 | an organiser attempts to delete an event they do not own | they attempt the action | the deletion is refused |

### US-008: View my events list

**Priority:** high

> As a an organiser, I want to see a list of my events with Yes/No/Maybe counts, so that I can quickly see the status of each event at a glance.

| ID | Given | When | Then |
|---|---|---|---|
| AC-023 | an organiser has created multiple events | they view their events list | the list shows events ordered upcoming first, then past, each with date, title, and counts of Yes / No / Maybe answers |
| AC-024 | an organiser has no events | they view their events list | the page shows an empty state encouraging them to create one |
| AC-025 | an organiser has many events | they view their events list | all events are shown without pagination (scale is small: tens of organisers, hundreds of events) |

## EPIC-003: Public Event Page and Guest RSVP

Anyone with the public link can view event details and submit an RSVP with name, email, response, and extra guests (Yes only, up to 5). Re-answering with the same email updates the existing RSVP rather than creating a duplicate. Assumptions: guest RSVP deduplication is by email only with no identity verification — anyone who knows a guest's email can change their RSVP (accepted for the demo); guest emails are visible only to the event's organiser, never on the public page; the frontend is a single-page React app and the backend serves both the API and built static assets.

### US-009: View a public event page

**Priority:** critical

> As a a guest, I want to open a shared link and see the event details without creating an account, so that I can decide whether to attend.

| ID | Given | When | Then |
|---|---|---|---|
| AC-026 | a guest opens a valid public event link | the page loads | the page displays the event title, date, time (in UTC), location, and description |
| AC-027 | a guest opens a valid public event link | the page loads | the page loads in under 2 seconds |
| AC-028 | a guest opens a link for a non-existent or invalid token | the page loads | a clear message says the event could not be found |
| AC-029 | a guest is viewing the public event page | the page renders | no guest emails or other guests' RSVP details are shown |

### US-010: Submit an RSVP

**Priority:** critical

> As a a guest, I want to submit my RSVP with name, email, response, and extra guests, so that the organiser knows whether I am coming and how many I am bringing.

| ID | Given | When | Then |
|---|---|---|---|
| AC-030 | a guest is on an open RSVP event page | they submit their name (required), email (required, valid format), response (Yes / No / Maybe), and number of extra guests (0-5, only if Yes) | the RSVP is recorded and a confirmation message is shown |
| AC-031 | a guest selects No or Maybe | they submit the RSVP | the extra-guests field is not available or is ignored |
| AC-032 | a guest submits an invalid email or missing name | they attempt to submit | the submission is refused and a clear message identifies the problem |
| AC-033 | a guest enters more than 5 extra guests | they attempt to submit | the submission is refused and a clear message says the maximum is 5 |
| AC-034 | a guest is answering on a 360px-wide phone screen | they fill in the RSVP form | the form fields are usable without horizontal scrolling |

### US-011: Update my RSVP by re-answering

**Priority:** high

> As a a guest, I want to change my answer by re-submitting with the same email, so that I can update my plans if they change.

| ID | Given | When | Then |
|---|---|---|---|
| AC-035 | a guest has already submitted an RSVP for an event with a particular email | they submit a new answer using the same email | the existing RSVP is updated with the new values instead of creating a second entry |
| AC-036 | a guest changes their response from Yes to No | the update is saved | their extra-guests count is cleared and no longer counts toward capacity |
| AC-037 | RSVP deduplication is by email only with no identity verification | anyone who knows a guest's email submits a new answer for that email | the RSVP is updated without additional authentication (accepted for the demo) |

## EPIC-004: Capacity Enforcement

When an event has a capacity set, new Yes answers are refused once the total headcount (Yes answers plus their extra guests) reaches the limit. No and Maybe answers remain accepted regardless of capacity. Assumption: capacity is a whole number between 1 and 1000, set optionally by the organiser at creation or edit time.

### US-012: Refuse Yes answers when capacity is reached

**Priority:** high

> As a an organiser, I want new Yes answers to be refused when the event is full, so that I do not exceed the venue or planning limit I set.

| ID | Given | When | Then |
|---|---|---|---|
| AC-038 | an event has a capacity and the current headcount (Yes answers plus extra guests) has reached that capacity | a new guest attempts to submit a Yes answer | the submission is refused and a clear message says "This event is full" |
| AC-039 | an event is at capacity | a guest submits a No or Maybe answer | the submission is accepted and recorded |
| AC-040 | an event has a capacity and is not yet full | a guest submits a Yes answer with extra guests | the Yes answer is accepted if the headcount including the new submission does not exceed capacity |
| AC-041 | an event has no capacity set | any number of guests submit Yes answers | no Yes answer is ever refused for capacity reasons |
| AC-042 | a guest is updating an existing Yes answer to a new Yes answer with more extra guests | they re-submit | the update is accepted only if the new total headcount does not exceed capacity; otherwise it is refused with "This event is full" |

## EPIC-005: RSVP Closing and Reopening

The organiser can manually close and reopen RSVPs for an event. RSVPs also close automatically once the event start time has passed. A closed event shows a clear message and accepts no new answers. Assumption: the auto-close check is based on the event start time stored in UTC.

### US-013: Close and reopen RSVPs

**Priority:** high

> As a an organiser, I want to close and reopen RSVPs for my event, with automatic closing when the event start time passes, so that I can control when guests can respond and stop accepting answers after the event begins.

| ID | Given | When | Then |
|---|---|---|---|
| AC-043 | an organiser is viewing one of their open events | they click to close RSVPs | RSVPs are closed and the public page shows "RSVPs are closed" |
| AC-044 | an organiser is viewing one of their closed events that has not yet started | they click to reopen RSVPs | RSVPs are reopened and the public page accepts answers again |
| AC-045 | an event's start time has passed | a guest opens the public event page | RSVPs are automatically closed and the public page shows "RSVPs are closed" |
| AC-046 | an event's start time has passed | the organiser views the event | the reopen action is not available or is disabled |
| AC-047 | an event is closed (manually or automatically) | a guest attempts to submit an RSVP | the submission is refused and a clear message says RSVPs are closed |

## EPIC-006: Guest List and Export

The organiser can view the guest list for one of their events, filter it by response type, see a total headcount, and download the guest list as a CSV file. Guest emails are visible only to the event's organiser, never on the public page. Assumption: data is retained indefinitely — past events and their RSVPs remain accessible with no automatic cleanup.

### US-014: View the guest list with response filter and headcount

**Priority:** high

> As a an organiser, I want to view my event's guest list with names, emails, responses, extra guests, and answer times, filterable by response, with a total headcount, so that I can see exactly who is coming and plan accordingly.

| ID | Given | When | Then |
|---|---|---|---|
| AC-048 | an organiser opens the guest list for one of their events | the guest list page loads | the list shows each guest's name, email, response, extra guests, and answer time |
| AC-049 | an organiser is viewing the guest list | the page loads | the total headcount (Yes answers plus their extra guests) is displayed at the top of the list |
| AC-050 | an organiser is viewing the guest list | they filter by Yes, No, or Maybe | only guests matching the selected response type are shown |
| AC-051 | an organiser has an event with no RSVPs yet | they open the guest list | an empty state is shown indicating no responses yet |
| AC-052 | an organiser attempts to view the guest list of an event they do not own | they attempt to access it | the request is refused and the guest list is not shown |

### US-015: Export the guest list as CSV

**Priority:** medium

> As a an organiser, I want to download my event's guest list as a CSV file, so that I can import it into a spreadsheet or share it offline.

| ID | Given | When | Then |
|---|---|---|---|
| AC-053 | an organiser is viewing the guest list for one of their events | they click download CSV | a CSV file is downloaded containing each guest's name, email, response, extra guests, and answer time |
| AC-054 | an organiser has applied a response filter to the guest list | they download the CSV | the CSV contains only the guests matching the current filter |
| AC-055 | an organiser attempts to export the guest list of an event they do not own | they attempt to download the CSV | the export is refused |
| AC-056 | an event has no RSVPs | the organiser downloads the CSV | the CSV is downloaded with headers but no data rows |
<!-- sdlc:auto:end epics -->
