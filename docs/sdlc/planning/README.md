# Planning

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### EPIC-001 · approved · source: planning:epic:EPIC-001

Organisers create an account, sign in to access events, and sign out. No password recovery — forgotten passwords permanently lose access.

EPIC-001: Organiser Authentication

Organisers create an account with email and password, sign in to access their events, and sign out to end their session. No password recovery is provided — an organiser who forgets their password permanently loses access to their events and guest lists. Assumptions: authentication uses JWT tokens issued by the FastAPI backend, stored client-side, and sent as Bearer tokens on protected requests; password hashing uses bcrypt.

US-001 [critical] Sign up as an organiser: As an organiser, I want to sign up with my email and a password, so that I can create and manage my own events
  AC-001: Given a person is not yet registered and is on the sign-up page, when they submit a unique email and a password of at least 8 characters, then the account is created, a JWT is issued, and the organiser is taken to their events list
  AC-002: Given a person submits an email that is already registered, when they attempt to sign up, then registration is refused and a clear message says the email is already in use
  AC-003: Given a person submits a password shorter than 8 characters, when they attempt to sign up, then registration is refused and a clear message indicates the minimum length
  AC-004: Given an organiser account has been created, when the backend persists the new organiser, then the stored password is a bcrypt hash, never the plain-text value

US-002 [critical] Sign in as an organiser: As an organiser, I want to sign in with my email and password, so that I can access my events and guest lists
  AC-005: Given an organiser has an active account, when they submit the correct email and password, then a JWT is issued and the organiser is taken to their events list
  AC-006: Given an organiser submits an incorrect password or unregistered email, when they attempt to sign in, then sign-in is refused and a clear message says the credentials are invalid
  AC-007: Given an organiser is signed in, when the organiser navigates to a protected organiser page, then the JWT is stored client-side and sent as a Bearer token on all subsequent protected requests

US-003 [high] Sign out: As an organiser, I want to sign out, so that I can end my session on a shared device
  AC-008: Given an organiser is signed in, when they click sign out, then the JWT is cleared from the client and the organiser is taken to the sign-in page
  AC-009: Given an organiser has signed out, when they attempt to navigate to a protected page, then they cannot reach any organiser page and are redirected to the sign-in page

US-004 [high] Session security for organiser pages: As an organiser, I want my session to expire when I sign out or when my token is no longer valid, so that my events and guest lists are not accessible to someone using my device after I leave
  AC-010: Given an organiser has signed out or their JWT has expired, when they attempt to access an organiser page or protected API endpoint, then the request is refused and the user is redirected to the sign-in page
  AC-011: Given no password recovery mechanism exists, when an organiser forgets their password and attempts to recover it, then a clear message states that password recovery is not available and access to their events is permanently lost

**Related:** US-001, US-002, US-003, US-004

### EPIC-002 · approved · source: planning:epic:EPIC-002

Organisers create, edit, and delete their own events, and see a list with response counts. Each event gets a unique, hard-to-guess public link.

EPIC-002: Event Creation and Management

Organisers create, edit, and delete their own events, and see a list of their events with response counts. Each event gets a unique, hard-to-guess public link. Assumptions: public event links use a random UUID or cryptographically random token in the URL path (e.g. /e/{token}); event date/time is stored and displayed in UTC with no timezone selection UI; data is retained indefinitely with no automatic cleanup of past events.

US-005 [critical] Create an event: As an organiser, I want to create an event with title, description, date/time, location, and optional capacity, so that I can publish details for my guests to see and RSVP to
  AC-012: Given an organiser is signed in and on the create-event page, when they submit a title (max 120 chars), description (optional, max 2000 chars), date/time in the future, location (max 200 chars), and an optional capacity (whole number 1-1000), then the event is created and the organiser sees the event's unique public link
  AC-013: Given an organiser submits a date/time in the past, when they attempt to create the event, then creation is refused and a clear message says the date must be in the future
  AC-014: Given an organiser leaves a required field blank or exceeds a field length limit, when they attempt to create the event, then creation is refused and a clear message identifies the problem field
  AC-015: Given a new event has been created, when the organiser views the event's public link, then the link contains a random UUID or cryptographically random token that is hard to guess
  AC-016: Given an organiser does not set a capacity, when they save the event, then the event is created with no capacity limit

US-006 [high] Edit my event: As an organiser, I want to edit any field of my own event, so that I can correct mistakes or update details as plans change
  AC-017: Given an organiser is viewing one of their own events, when they change any field and save, then the event is updated with the new values
  AC-018: Given an organiser attempts to edit an event they do not own, when they attempt to access the edit endpoint, then the edit is refused and the event is not shown to them
  AC-019: Given an organiser submits invalid data (e.g. past date, over-length field), when they attempt to save, then the edit is refused and a clear message identifies the problem

US-007 [high] Delete my event: As an organiser, I want to delete my event with confirmation, so that I can remove cancelled or test events along with their RSVPs
  AC-020: Given an organiser is viewing one of their own events, when they click delete, then a confirmation prompt appears asking the organiser to confirm
  AC-021: Given an organiser confirms deletion of their event, when they confirm, then the event and all of its RSVPs are permanently removed
  AC-022: Given an organiser attempts to delete an event they do not own, when they attempt the action, then the deletion is refused

US-008 [high] View my events list: As an organiser, I want to see a list of my events with Yes/No/Maybe counts, so that I can quickly see the status of each event at a glance
  AC-023: Given an organiser has created multiple events, when they view their events list, then the list shows events ordered upcoming first, then past, each with date, title, and counts of Yes / No / Maybe answers
  AC-024: Given an organiser has no events, when they view their events list, then the page shows an empty state encouraging them to create one
  AC-025: Given an organiser has many events, when they view their events list, then all events are shown without pagination (scale is small: tens of organisers, hundreds of events)

**Related:** US-005, US-006, US-007, US-008

### EPIC-003 · approved · source: planning:epic:EPIC-003

Anyone with the public link can view event details and submit an RSVP. Re-answering with the same email updates the existing RSVP. Guest emails are never shown on the public page.

EPIC-003: Public Event Page and Guest RSVP

Anyone with the public link can view event details and submit an RSVP with name, email, response, and extra guests (Yes only, up to 5). Re-answering with the same email updates the existing RSVP rather than creating a duplicate. Assumptions: guest RSVP deduplication is by email only with no identity verification — anyone who knows a guest's email can change their RSVP (accepted for the demo); guest emails are visible only to the event's organiser, never on the public page; the frontend is a single-page React app and the backend serves both the API and built static assets.

US-009 [critical] View a public event page: As a guest, I want to open a shared link and see the event details without creating an account, so that I can decide whether to attend
  AC-026: Given a guest opens a valid public event link, when the page loads, then the page displays the event title, date, time (in UTC), location, and description
  AC-027: Given a guest opens a valid public event link, when the page loads, then the page loads in under 2 seconds
  AC-028: Given a guest opens a link for a non-existent or invalid token, when the page loads, then a clear message says the event could not be found
  AC-029: Given a guest is viewing the public event page, when the page renders, then no guest emails or other guests' RSVP details are shown

US-010 [critical] Submit an RSVP: As a guest, I want to submit my RSVP with name, email, response, and extra guests, so that the organiser knows whether I am coming and how many I am bringing
  AC-030: Given a guest is on an open RSVP event page, when they submit their name (required), email (required, valid format), response (Yes / No / Maybe), and number of extra guests (0-5, only if Yes), then the RSVP is recorded and a confirmation message is shown
  AC-031: Given a guest selects No or Maybe, when they submit the RSVP, then the extra-guests field is not available or is ignored
  AC-032: Given a guest submits an invalid email or missing name, when they attempt to submit, then the submission is refused and a clear message identifies the problem
  AC-033: Given a guest enters more than 5 extra guests, when they attempt to submit, then the submission is refused and a clear message says the maximum is 5
  AC-034: Given a guest is answering on a 360px-wide phone screen, when they fill in the RSVP form, then the form fields are usable without horizontal scrolling

US-011 [high] Update my RSVP by re-answering: As a guest, I want to change my answer by re-submitting with the same email, so that I can update my plans if they change
  AC-035: Given a guest has already submitted an RSVP for an event with a particular email, when they submit a new answer using the same email, then the existing RSVP is updated with the new values instead of creating a second entry
  AC-036: Given a guest changes their response from Yes to No, when the update is saved, then their extra-guests count is cleared and no longer counts toward capacity
  AC-037: Given RSVP deduplication is by email only with no identity verification, when anyone who knows a guest's email submits a new answer for that email, then the RSVP is updated without additional authentication (accepted for the demo)

**Related:** US-009, US-010, US-011

### EPIC-004 · approved · source: planning:epic:EPIC-004

When an event has a capacity, new Yes answers are refused once total headcount reaches the limit. No and Maybe answers remain accepted.

EPIC-004: Capacity Enforcement

When an event has a capacity set, new Yes answers are refused once the total headcount (Yes answers plus their extra guests) reaches the limit. No and Maybe answers remain accepted regardless of capacity. Assumption: capacity is a whole number between 1 and 1000, set optionally by the organiser at creation or edit time.

US-012 [high] Refuse Yes answers when capacity is reached: As an organiser, I want new Yes answers to be refused when the event is full, so that I do not exceed the venue or planning limit I set
  AC-038: Given an event has a capacity and the current headcount (Yes answers plus extra guests) has reached that capacity, when a new guest attempts to submit a Yes answer, then the submission is refused and a clear message says "This event is full"
  AC-039: Given an event is at capacity, when a guest submits a No or Maybe answer, then the submission is accepted and recorded
  AC-040: Given an event has a capacity and is not yet full, when a guest submits a Yes answer with extra guests, then the Yes answer is accepted if the headcount including the new submission does not exceed capacity
  AC-041: Given an event has no capacity set, when any number of guests submit Yes answers, then no Yes answer is ever refused for capacity reasons
  AC-042: Given a guest is updating an existing Yes answer to a new Yes answer with more extra guests, when they re-submit, then the update is accepted only if the new total headcount does not exceed capacity; otherwise it is refused with "This event is full"

**Related:** US-012

### EPIC-005 · approved · source: planning:epic:EPIC-005

Organiser can manually close and reopen RSVPs. RSVPs auto-close once the event start time has passed. Closed events show a message and accept no new answers.

EPIC-005: RSVP Closing and Reopening

The organiser can manually close and reopen RSVPs for an event. RSVPs also close automatically once the event start time has passed. A closed event shows a clear message and accepts no new answers. Assumption: the auto-close check is based on the event start time stored in UTC.

US-013 [high] Close and reopen RSVPs: As an organiser, I want to close and reopen RSVPs for my event, with automatic closing when the event start time passes, so that I can control when guests can respond and stop accepting answers after the event begins
  AC-043: Given an organiser is viewing one of their open events, when they click to close RSVPs, then RSVPs are closed and the public page shows "RSVPs are closed"
  AC-044: Given an organiser is viewing one of their closed events that has not yet started, when they click to reopen RSVPs, then RSVPs are reopened and the public page accepts answers again
  AC-045: Given an event's start time has passed, when a guest opens the public event page, then RSVPs are automatically closed and the public page shows "RSVPs are closed"
  AC-046: Given an event's start time has passed, when the organiser views the event, then the reopen action is not available or is disabled
  AC-047: Given an event is closed (manually or automatically), when a guest attempts to submit an RSVP, then the submission is refused and a clear message says RSVPs are closed

**Related:** US-013

### EPIC-006 · approved · source: planning:epic:EPIC-006

Organiser can view the guest list with response filter and headcount, and download it as CSV. Guest emails are visible only to the organiser.

EPIC-006: Guest List and Export

The organiser can view the guest list for one of their events, filter it by response type, see a total headcount, and download the guest list as a CSV file. Guest emails are visible only to the event's organiser, never on the public page. Assumption: data is retained indefinitely — past events and their RSVPs remain accessible with no automatic cleanup.

US-014 [high] View the guest list with response filter and headcount: As an organiser, I want to view my event's guest list with names, emails, responses, extra guests, and answer times, filterable by response, with a total headcount, so that I can see exactly who is coming and plan accordingly
  AC-048: Given an organiser opens the guest list for one of their events, when the guest list page loads, then the list shows each guest's name, email, response, extra guests, and answer time
  AC-049: Given an organiser is viewing the guest list, when the page loads, then the total headcount (Yes answers plus their extra guests) is displayed at the top of the list
  AC-050: Given an organiser is viewing the guest list, when they filter by Yes, No, or Maybe, then only guests matching the selected response type are shown
  AC-051: Given an organiser has an event with no RSVPs yet, when they open the guest list, then an empty state is shown indicating no responses yet
  AC-052: Given an organiser attempts to view the guest list of an event they do not own, when they attempt to access it, then the request is refused and the guest list is not shown

US-015 [medium] Export the guest list as CSV: As an organiser, I want to download my event's guest list as a CSV file, so that I can import it into a spreadsheet or share it offline
  AC-053: Given an organiser is viewing the guest list for one of their events, when they click download CSV, then a CSV file is downloaded containing each guest's name, email, response, extra guests, and answer time
  AC-054: Given an organiser has applied a response filter to the guest list, when they download the CSV, then the CSV contains only the guests matching the current filter
  AC-055: Given an organiser attempts to export the guest list of an event they do not own, when they attempt to download the CSV, then the export is refused
  AC-056: Given an event has no RSVPs, when the organiser downloads the CSV, then the CSV is downloaded with headers but no data rows

**Related:** US-014, US-015
<!-- sdlc:auto:end narrative -->
