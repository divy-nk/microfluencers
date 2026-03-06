# Creator Onboarding Module — Current Implementation

Last updated: 2026-03-03

## 1. Objective

Collect enough structured creator profile data to:

1. Enable reliable brand-side targeting and filtering.
2. Improve application quality before first campaign application.
3. Support payout readiness and profile trust checks.

## 2. Implemented Flow (5 Steps)

Defined in `CreatorOnboardingPage` as:

- `About You`
- `Platforms`
- `Your Work`
- `Get Paid`
- `Your Photo`

Creators submit onboarding once all step-level validations pass.

## 3. Data Captured

### 3.1 About You
- Full name
- Date of birth (formatted)
- Gender (`female` / `male` / `other`)
- City + state

### 3.2 Platforms
- Primary platform (`instagram` / `youtube` / `both`)
- Platform handles (normalized without leading `@`)
- Audience size inputs (followers/subscribers)
- Content niche selection (multi-select, capped)

### 3.3 Work Samples
- Sample content URLs (primary and optional secondary)
- Free-text “why BrandKlip” motivation/context

### 3.4 Payout Readiness
- Preferred payout method (`upi` or `bank`)
- Method-specific payment fields with validation

### 3.5 Profile Photo
- Optional/required step-level upload UX (based on form completion)
- Direct upload support through signed upload action

## 4. Validation Rules (Implemented)

- Step-gated progression (`canProceed`) before moving forward.
- Step 1 requires identity/location + gender fields.
- Step 2 requires at least one niche and valid platform inputs.
- Step 4 validates payout details by selected payout mode.
- Handle and numeric sanitization are applied client-side before submit.

## 5. Backend Submission Contract

On final submit, onboarding sends normalized values through `submitCreatorOnboarding`, including:

- `gender`
- `niche`
- `followersCount` (derived from provided platform numbers)
- platform handles + profile metadata

This enables downstream drop targeting (including gender preference) and creator discovery quality.

## 6. Process Notes

- Rejected creators can reset and reapply via onboarding reset flow.
- Onboarding state is tied to account approval lifecycle (`pending` / `approved` / `rejected`).
- Creator dashboard experience changes based on approval status.

## 7. Known Improvements (Planned)

1. Add explicit server-side schema docs for onboarding payload evolution.
2. Add instrumentation for step drop-off analytics.
3. Add stronger URL validation/preview checks for sample links.
