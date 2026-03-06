# BrandKlip — Product Plan (As Built)

Last updated: 2026-03-03

## 1. Product Summary

BrandKlip is a product-for-content platform where brands launch campaign drops and creators apply, submit purchase proof, and deliver video content through governed approval workflows.

## 2. Current Scope (Implemented)

### 2.1 Brand Side
- Create and manage drops from dashboard.
- Review creator applications and move them through approval states.
- Verify or reject order proof with mandatory rejection reasons.
- Review submitted videos and approve or request structured reshoots.

### 2.2 Creator Side
- Discover and apply to eligible drops.
- Submit order proof and resubmit when disputed.
- Submit video links and handle reshoot requests.
- Track application state, deadlines, countdowns, and final-attempt warnings.

### 2.3 Admin/Operations
- Video review queue with attempt context.
- Structured rejection categories + detailed feedback.
- Activity and notification plumbing for status changes.

## 3. Governance Policies (Implemented)

### 3.1 Order Proof Policy
- Up to 3 review attempts.
- Rejections require actionable feedback.
- Third failed attempt moves flow to final-failure handling.
- Deadline messaging and countdown UX included in creator surfaces.

### 3.2 Video Reshoot Policy
- Up to 3 video attempts (`video_submitted` / `reshoot_requested`).
- `adminRequestReshoot` enforces min feedback length and reason capture.
- Final rejection transitions application to failure (`expired`) with cooldown behavior.
- Creator UI shows final-attempt warning and resubmit deadlines.

## 4. UX + Reliability Work Completed

- Disputed proof state simplified to a single clear CTA path.
- Brand verification/rejection modals hardened (validation + close behavior).
- Global modal/sheet scroll-lock fixed to prevent background scroll and page freeze regressions.
- Sample license access stabilized via static route + updated legal copy.
- Image preview behavior switched to fit mode across dashboard/drop previews.

## 5. Technical Baseline (Current)

- Frontend: React + TypeScript (Wasp client), utility-first styling.
- Backend: Wasp operations + Prisma + PostgreSQL.
- Data migrations: Prisma migrations under `brandklip/app/migrations`.
- Core business logic: `brandklip/app/src/application/ops.ts`.

## 6. Near-Term Plan

1. Add targeted automated tests for application state transitions (order proof + video reshoot).
2. Add dashboard analytics for attempt funnels and drop-off reasons.
3. Tighten role-based audit logging for all approve/reject transitions.
4. Document API/operation contracts for internal tooling and QA.

## 7. Risks To Watch

- Policy complexity in state transitions can regress without integration tests.
- Rejection reason quality impacts creator success rates and support load.
- Mobile modal interactions remain sensitive; shared UI primitives should stay centralized.
