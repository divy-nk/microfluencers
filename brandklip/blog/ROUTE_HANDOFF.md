# Route Handoff: Astro + Wasp on www.brandklip.com

This document defines Phase 5 ownership split for production routing.

## Target ownership

- Astro static app owns:
  - `/`
  - `/creators`
  - `/contact`
  - `/privacypolicy`
  - `/terms`
  - `/404`
  - `/blog`
  - `/blog/*`
- Wasp app owns:
  - `/signup`
  - `/login`
  - `/dashboard`
  - `/branddashboard`
  - `/creatordashboard`
  - `/brand/*`
  - `/creator/*`
  - `/admin/*`
  - `/account`
  - auth/onboarding/payment routes and all API paths

## Cloudflare route strategy

1. Keep non-www -> www 301 redirect rule active.
2. Add highest-priority route rules for Wasp paths (dashboard/auth/app paths) to origin `WASP_ORIGIN`.
3. Route all marketing/blog paths listed above to Astro static origin `ASTRO_ORIGIN`.
4. Add permanent redirect: `/brands` -> `/`.
5. Keep default/fallback behavior explicit; do not rely on implicit wildcard order.

## Wasp de-duplication note

Wasp public blog routes were removed from `brandklip/app/main.wasp` during parity recovery so Astro is the single public blog surface.

Remaining operational requirement:

1. Ensure Cloudflare still routes `/blog` and `/blog/*` to `ASTRO_ORIGIN`.
2. Keep `/signup` and other auth/app paths pinned to `WASP_ORIGIN`.

## Verification checklist

Run these checks after route switch:

1. `curl -I https://www.brandklip.com/` returns Astro response.
2. `curl -I https://www.brandklip.com/blog/` returns Astro response.
3. `curl -I https://www.brandklip.com/branddashboard` returns Wasp response.
4. Confirm canonical tags on Astro pages point to `https://www.brandklip.com/[path]`.
5. Confirm JSON-LD is present on Astro marketing pages and blog pages.
6. Re-run GSC URL Inspection for `/`, `/creators`, `/contact`, `/privacypolicy`, `/terms`, `/blog`, and one `/blog/[slug]`.
