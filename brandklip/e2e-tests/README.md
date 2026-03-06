# BrandKlip E2E Tests (Playwright)

This package contains end-to-end tests for BrandKlip product workflows.

## Local Setup

1. Install test dependencies:

```bash
cd e2e-tests && npm install
```

2. Start database (from app directory):

```bash
cd ../app && wasp start db
```

3. Start app in another terminal:

```bash
cd ../app && wasp start
```

4. Run e2e tests:

```bash
cd ../e2e-tests && npm run local:e2e:start
```

## Test Focus Areas

- Auth and role routing
- Drop discovery and application flows
- Order-proof and video-submission journey checks
- Critical dashboard action paths

## CI Guidance

- Ensure Wasp + DB services are available in pipeline runtime.
- Provide required app env vars through CI secrets.
- Keep e2e coverage aligned with policy-critical transitions.
