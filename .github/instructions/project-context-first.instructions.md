---
description: "Use when working in the microfluencers workspace. Enforce PROJECT_CONTEXT-first workflow before coding, debugging, refactoring, or architecture analysis."
name: "Project Context First"
applyTo: "**"
alwaysApply: true
---
# Project Context First

- Treat `PROJECT_CONTEXT.md` as the first-stop source of truth before code exploration or implementation.
- Before coding, quickly check `PROJECT_CONTEXT.md` for route/file mappings, known pitfalls, feature inventory, and existing operation references.
- If new durable context is discovered while working, update `PROJECT_CONTEXT.md` in the relevant section and add a dated entry in `Update Log`.
- Keep updates high-signal and durable:
  - Add architecture, flow, route, operation, model, or recurring pitfall knowledge.
  - Avoid noisy churn or logging trivial one-off edits.
- When implementation reality conflicts with existing documentation, keep both notes temporarily and clearly mark what appears current.
- While reporting work to the user, reference `PROJECT_CONTEXT.md` when a decision came from documented context.
- **DEPLOYMENT GUARDRAIL**: Never perform a `git push` to `main` without explicit, separate approval for the push from the user.
