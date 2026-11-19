# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
105 tests · Passed 99 · Failed 6 · Skipped 0 · Not run 0

Acceptance criteria covered: 7/56 · passing: 7/56
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start tests -->
## Sprint 1

### US-001: Sign up as an organiser

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_response_enum_values | Unit | Passed | `backend/tests/unit/test_schemas.py` |
| — | test_rsvp_extra_guests_capped_at_five | Unit | Passed | `backend/tests/unit/test_schemas.py` |
| — | test_rsvp_rejects_invalid_email | Unit | Passed | `backend/tests/unit/test_schemas.py` |
| — | test_signup_accepts_valid_input | Unit | Passed | `backend/tests/unit/test_schemas.py` |
| — | test_signup_schema_accepts_short_password | Unit | Passed | `backend/tests/unit/test_schemas.py` |
| — | test_create_session_returns_opaque_token | Unit | Passed | `backend/tests/unit/test_security.py` |
| — | test_hash_password_is_bcrypt_hash | Unit | Passed | `backend/tests/unit/test_security.py` |
| — | test_seeds_bootstrap_admin_idempotent | Unit | Failed | `backend/tests/unit/test_security.py` |
| — | test_seeds_bootstrap_admin_when_env_set | Unit | Failed | `backend/tests/unit/test_security.py` |
| — | test_seeds_both_admin_and_smoke_user | Unit | Failed | `backend/tests/unit/test_security.py` |
| — | test_seeds_nothing_without_env_vars | Unit | Failed | `backend/tests/unit/test_security.py` |
| — | test_seeds_smoke_test_user_idempotent | Unit | Failed | `backend/tests/unit/test_security.py` |
| — | test_seeds_smoke_test_user_when_env_set | Unit | Failed | `backend/tests/unit/test_security.py` |
| — | test_verify_password_accepts_correct_password | Unit | Passed | `backend/tests/unit/test_security.py` |
| — | test_verify_password_rejects_wrong_password | Unit | Passed | `backend/tests/unit/test_security.py` |
| AC-006 | apiFetch > [AC-006] falls back to a status line when the body has no detail | Unit | Passed | `frontend/src/lib/api.test.ts` |
| AC-006 | apiFetch > [AC-006] parses the exact detail from a non-OK response body | Unit | Passed | `frontend/src/lib/api.test.ts` |
| AC-006 | apiFetch > [AC-006] returns undefined body for a 204 response | Unit | Passed | `frontend/src/lib/api.test.ts` |
| AC-006 | apiFetch > [AC-006] sends the stored session token as Authorization: Bearer on subsequent calls | Unit | Passed | `frontend/src/lib/api.test.ts` |
| AC-001 | Auth screen > [AC-001] signup success calls POST /auth/signup, stores the token, and navigates to /events | Unit | Passed | `frontend/src/screens/Auth.test.tsx` |
| AC-002 | Auth screen > [AC-002] signup with an already-registered email displays the API error 'This email is already in use' | Unit | Passed | `frontend/src/screens/Auth.test.tsx` |
| AC-003 | Auth screen > [AC-003] signup with a password < 8 chars displays the API error 'Password must be at least 8 characters' | Unit | Passed | `frontend/src/screens/Auth.test.tsx` |
| AC-004 | Auth screen > [AC-004] signin success calls POST /auth/signin, stores the token, and navigates to /events | Unit | Passed | `frontend/src/screens/Auth.test.tsx` |
| AC-005 | Auth screen > [AC-005] signin with incorrect credentials displays 'Invalid email or password' | Unit | Passed | `frontend/src/screens/Auth.test.tsx` |
| AC-011 | Auth screen > [AC-011] keeps the 'Password recovery is not available' message visible | Unit | Passed | `frontend/src/screens/Auth.test.tsx` |
| — | test_invalid_token_returns_401_not_authenticated | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_missing_token_returns_401_not_authenticated | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_revoked_token_returns_401_not_authenticated | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_signin_with_correct_credentials_returns_200 | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_signin_with_unregistered_email_returns_401 | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_signin_with_wrong_password_returns_401 | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_signin_works_for_seeded_user | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_signout_deletes_session_row | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_signup_returns_201_with_token_and_organiser | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_signup_stores_bcrypt_hash_not_plain_text | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_signup_with_existing_email_returns_400 | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_signup_with_invalid_email_returns_422 | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_signup_with_short_password_returns_400 | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_valid_token_authenticates_on_protected_endpoint | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | [AC-1] a new user signs up with a unique email and password >= 8 chars and lands on the events list | E2E | Passed | `frontend/e2e/auth.spec.ts` |
| — | [AC-2] signup with an already-registered email shows 'This email is already in use' | E2E | Passed | `frontend/e2e/auth.spec.ts` |
| — | [AC-3] signup with a short password shows the minimum-length message | E2E | Passed | `frontend/e2e/auth.spec.ts` |
| — | [AC-4] an existing organiser signs in and lands on the events list | E2E | Passed | `frontend/e2e/auth.spec.ts` |
| — | [AC-5] signin with wrong credentials shows 'Invalid email or password' | E2E | Passed | `frontend/e2e/auth.spec.ts` |
| — | [AC-6] after signin, the token is present in localStorage | E2E | Passed | `frontend/e2e/auth.spec.ts` |
| NFR-003 | [NFR-003] session protection: the bootstrap admin can sign in and the token persists across a reload | E2E | Passed | `frontend/e2e/auth.spec.ts` |
| NFR-008 | [NFR-008] clear error messages: a missing-field signin shows a clear message | E2E | Passed | `frontend/e2e/auth.spec.ts` |

### US-003: Sign out

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | US-003 sign-out and protected-route guard > [AC-1] clicking Sign Out calls POST /auth/signout, clears the token, and navigates to /auth | Unit | Passed | `frontend/src/App.guard.test.tsx` |
| NFR-003 | US-003 sign-out and protected-route guard > [NFR-003] protected-route guard redirects to /auth when no token is present | Unit | Passed | `frontend/src/App.guard.test.tsx` |
| — | [AC-1] a signed-in organiser clicks Sign Out and lands on the sign-in page with the token cleared from localStorage | E2E | Passed | `frontend/e2e/signout.spec.ts` |
| — | [AC-2] after sign-out, navigating directly to /events redirects to /auth | E2E | Passed | `frontend/e2e/signout.spec.ts` |
| — | [AC-3] the Auth screen displays the 'Password recovery is not available' message | E2E | Passed | `frontend/e2e/signout.spec.ts` |
| NFR-003 | [NFR-003] session protection: after sign-out the token is gone and /events is inaccessible | E2E | Passed | `frontend/e2e/signout.spec.ts` |
| NFR-003 | [NFR-003] session protection: with no token, navigating directly to /events redirects to /auth | E2E | Passed | `frontend/e2e/signout.spec.ts` |
| NFR-008 | [NFR-008] clear error messages: a missing-field signin shows a clear message | E2E | Passed | `frontend/e2e/signout.spec.ts` |
| NFR-010 | [NFR-010] event times shown in UTC only: the events list renders times with a UTC label and no timezone selector | E2E | Passed | `frontend/e2e/signout.spec.ts` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_ac_event_create_accepts_none_description | Unit | Passed | `backend/tests/unit/test_events.py` |
| — | test_ac_event_create_accepts_valid_input | Unit | Passed | `backend/tests/unit/test_events.py` |
| — | test_ac_event_create_defaults_capacity_to_none | Unit | Passed | `backend/tests/unit/test_events.py` |
| — | test_ac_event_create_rejects_blank_location | Unit | Passed | `backend/tests/unit/test_events.py` |
| — | test_ac_event_create_rejects_blank_title | Unit | Passed | `backend/tests/unit/test_events.py` |
| — | test_ac_event_create_rejects_capacity_above_1000 | Unit | Passed | `backend/tests/unit/test_events.py` |
| — | test_ac_event_create_rejects_capacity_below_one | Unit | Passed | `backend/tests/unit/test_events.py` |
| — | test_ac_event_create_rejects_description_exceeding_2000 | Unit | Passed | `backend/tests/unit/test_events.py` |
| — | test_ac_event_create_rejects_location_exceeding_200 | Unit | Passed | `backend/tests/unit/test_events.py` |
| — | test_ac_event_create_rejects_title_exceeding_120 | Unit | Passed | `backend/tests/unit/test_events.py` |
| NFR-003 | App shell > [NFR-003] keeps the app menu visible on the /auth sign-in screen | Unit | Passed | `frontend/src/App.shell.test.tsx` |
| NFR-003 | App shell > [NFR-003] shows the app menu when the protected /events route redirects to /auth | Unit | Passed | `frontend/src/App.shell.test.tsx` |
| — | App > renders a screen inside the app shell and shows its menu | Unit | Passed | `frontend/src/App.test.tsx` |
| — | EventEditor screen > [AC] leaving a required field blank shows a field-specific error from the API | Unit | Passed | `frontend/src/screens/EventEditor.test.tsx` |
| — | EventEditor screen > [AC] leaving capacity blank sends null (no capacity limit) | Unit | Passed | `frontend/src/screens/EventEditor.test.tsx` |
| — | EventEditor screen > [AC] submits to POST /events and displays the public link containing the random token | Unit | Passed | `frontend/src/screens/EventEditor.test.tsx` |
| — | EventEditor screen > [AC] submitting a past date/time shows 'Date and time must be in the future' | Unit | Passed | `frontend/src/screens/EventEditor.test.tsx` |
| — | Events screen > [AC] calls GET /events on load and renders API data with date, title, and counts (upcoming first, then past) | Unit | Passed | `frontend/src/screens/Events.test.tsx` |
| — | Events screen > [AC] shows an error message when the API call fails | Unit | Passed | `frontend/src/screens/Events.test.tsx` |
| — | Events screen > [AC] shows the empty state when the API returns no events | Unit | Passed | `frontend/src/screens/Events.test.tsx` |
| — | Events screen > [AC] the Create Event button navigates to the EventEditor screen | Unit | Passed | `frontend/src/screens/Events.test.tsx` |
| NFR-010 | Events screen UTC rendering > [NFR-010] shows a UTC label on the events list with no timezone selector | Unit | Passed | `frontend/src/screens/Events.utc.test.tsx` |
| — | test_ac_create_blank_required_field_returns_422 | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_create_exceeded_length_returns_422 | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_create_past_date_returns_422_future_message | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_create_returns_201_with_full_event_and_public_token | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_create_returns_401_with_invalid_token | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_create_returns_401_without_token | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_create_without_capacity_creates_null_capacity | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_detail_returns_401_without_token | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_detail_returns_403_for_other_organiser_event | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_detail_returns_404_for_nonexistent_event | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_detail_returns_full_event_for_own_event | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_list_excludes_other_organisers_events | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_list_returns_401_without_token | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_list_returns_organiser_events_with_counts | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_public_token_is_cryptographically_random | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_ac_start_at_returned_in_utc_with_z_suffix | Integration | Passed | `backend/tests/integration/test_events.py` |
| — | test_health_reports_ok | Integration | Passed | `backend/tests/integration/test_health.py` |
| — | test_the_openapi_document_builds | Integration | Passed | `backend/tests/integration/test_health.py` |
| — | [AC-1] a signed-in organiser creates an event with all fields and sees the public link containing a random token | E2E | Passed | `frontend/e2e/events.spec.ts` |
| — | [AC-2] submitting a past date/time shows the 'must be in the future' error | E2E | Passed | `frontend/e2e/events.spec.ts` |
| — | [AC-3] leaving a required field blank shows a field-specific error | E2E | Passed | `frontend/e2e/events.spec.ts` |
| — | [AC-4] creating an event without capacity succeeds and the event appears in the list with no capacity limit | E2E | Passed | `frontend/e2e/events.spec.ts` |
| — | [AC-5] the events list displays the organiser's events with correct Yes/No/Maybe counts | E2E | Passed | `frontend/e2e/events.spec.ts` |
| NFR-004 | [NFR-004] public event links contain a cryptographically hard-to-guess random token | E2E | Passed | `frontend/e2e/events.spec.ts` |
| NFR-008 | [NFR-008] clear error messages: a refused input returns a clear, specific message | E2E | Passed | `frontend/e2e/events.spec.ts` |
| NFR-010 | [NFR-010] event times shown in UTC only: the events list renders times with a UTC label and no timezone selector | E2E | Passed | `frontend/e2e/events.spec.ts` |
| — | the app loads | E2E | Passed | `frontend/e2e/example.spec.ts` |
<!-- sdlc:auto:end tests -->
