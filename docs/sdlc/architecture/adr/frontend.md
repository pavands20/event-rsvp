<!-- sdlc:auto:start adr -->
# ADR-0001: Use React 19 for Frontend

Status: Accepted  
Date: 2026-11-19

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v4.

## Considered Options

- React 19
- Vue 3
- Svelte 5

## Decision Outcome

Chosen option: React 19, because Approved by the product owner. Component model maps cleanly onto the two user flows (organiser dashboard vs public RSVP form). TypeScript catches field-mismatch bugs in the form-heavy UI.

## Consequences

SPA requires client-side routing and a separate static host, adding a small deployment complexity vs server-rendered frameworks. No SSR means no SEO, which is acceptable since the public page is link-based, not search-indexed.
<!-- sdlc:auto:end adr -->