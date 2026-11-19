# Event RSVP — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
Event RSVP App: Requirements Version 1.0. Prepared for a demo build. 1. Purpose Small organisers (clubs, teams, friends planning a get-together) need a simple way to publish an event and collect RSVPs without asking guests to create an account. The organiser shares a link; guests answer in under a minute; the organiser sees who is coming at a glance. 2. Users  Organiser: signs up with email and password, creates and manages their own events, and sees the guest lists of their own events only.  Guest: opens a shared event link and answers the RSVP. No account, no login. 3. Functional requirements ID Requirement Acceptance criteria FR-1 Organiser sign-up, sign-in and sign-out Email + password (min 8 characters). Duplicate email is refused with a clear message. Signed-out users cannot reach organiser pages. FR-2 Create an event Title (required, max 120), description (optional, max 2000), date and start time (required, must be in the future), location (required, max 200), capacity (optional, whole number 1-1000). Each event gets a unique, hard-to-guess public link. FR-3 Edit and delete my events Organiser can change any field of their own event. Delete asks for confirmation and removes the event and its RSVPs. Another organiser's event cannot be seen, edited or deleted. FR-4 My events list Shows the organiser's events, upcoming first then past, each with date, title and counts of Yes / No / Maybe answers. FR-5 Public event page and RSVP Anyone with the link sees title, date, time, location and description, and answers with name (required), email (required, valid format), response (Yes / No / Maybe) and number of extra guests (0-5, only for Yes). FR-6 Change my answer Answering again with the same email for the same event updates the earlier answer instead of adding a second one. FR-7 Capacity When the Yes answers plus their extra guests reach capacity, new Yes answers are refused with "This event is full"; No and Maybe are still accepted. FR-8 Close RSVPs Organiser

**Documentation version:** v2
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v1 approved |
| [Architecture](architecture/README.md) | 9 entries |
| [Planning](planning/README.md) | 6 entries |
| [Development](development/README.md) | 0 entries |
| [Testing](testing/README.md) | 0 entries |
| [Deployment](deployment/README.md) | 0 entries |
| [Maintenance](maintenance/README.md) | 0 entries |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | not generated yet |
| [Developer guide](development/developer-guide.md) | generated |
| [API reference](development/api-reference.md) | 1 route |
| [Test report](testing/test-report.md) | not run yet |
| [Tests](testing/test-cases.md) | 0 tests |
| [Deployment guide](deployment/deployment-guide.md) | not deployed yet |
| [Runbook](deployment/runbook.md) | not deployed yet |
| [Release notes](deployment/release-notes.md) | 0 releases |
| [Traceability matrix](traceability-matrix.md) | 15 requirements |
| [Changelog](CHANGELOG.md) | 2 versions |
<!-- sdlc:auto:end contents -->
