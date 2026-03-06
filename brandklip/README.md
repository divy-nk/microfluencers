# BrandKlip Workspace

BrandKlip is a product-for-content platform where brands launch campaign drops and creators submit proof + videos through governed review workflows.

## Workspace Structure

1. `app` — Main product app (Wasp + React + Prisma + PostgreSQL)
2. `e2e-tests` — Playwright tests for end-to-end product flows
3. `blog` — Astro/Starlight docs site and marketing content

## Current Product Highlights

- Creator and brand dashboards with role-specific workflows.
- Application state machine with guarded server transitions.
- Order proof and video reshoot governance (attempt caps + rejection reasons).
- Deadline/cooldown messaging and notifications.

## Primary Documentation

- `../plan.md` — Product plan (as built)
- `../system-design.md` — Current architecture and operational design
- `../BE-development.md` — Backend implementation log and baseline
- `../creator-onboarding-module.md` — Creator onboarding module details

## Local Development

From `brandklip/app`:

1. Start database: `wasp start db`
2. Run app: `wasp start`
3. Run migrations when schema changes: `wasp db migrate-dev`

## Notes

- This repository started from an Open SaaS template but now contains product-specific architecture and workflow policies.
