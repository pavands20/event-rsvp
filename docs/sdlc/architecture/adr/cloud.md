<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-11-19

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v4.

## Considered Options

- AWS
- Render
- Fly.io

## Decision Outcome

Chosen option: AWS, because Approved by the product owner. Single EC2 instance for the API and S3+CloudFront for the SPA, backed by RDS PostgreSQL, matches the small-scale demo assumption with no autoscaling needed.

## Consequences

AWS operational overhead is slightly higher than a simple PaaS like Render, but it is the approved cloud option and provides fine-grained control over networking and security groups.
<!-- sdlc:auto:end adr -->