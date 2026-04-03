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
  - `/robots.txt`
  - `/sitemap.xml`
  - `/sitemap-index.xml`
  - `/sitemap-*.xml`
- Wasp app owns:
  - `/signup`
  - `/login`
  - `/oauth/callback`
  - `/auth/*`
  - `/auth/google/callback`
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
  - Required explicit rules: `/auth/*`, `/oauth/callback`, `/signup`, `/login`.
3. Route all marketing/blog paths listed above to Astro static origin `ASTRO_ORIGIN`.
4. Add permanent redirect: `/brands` -> `/`.
5. Keep default/fallback behavior explicit; do not rely on implicit wildcard order.

## Wasp de-duplication note

Wasp public blog routes were removed from `brandklip/app/main.wasp` during parity recovery so Astro is the single public blog surface.

Remaining operational requirement:

1. Ensure Cloudflare still routes `/blog` and `/blog/*` to `ASTRO_ORIGIN`.
2. Ensure `/robots.txt`, `/sitemap.xml`, `/sitemap-index.xml`, and `/sitemap-*.xml` route to `ASTRO_ORIGIN`.
3. Keep `/signup` and other auth/app paths pinned to `WASP_ORIGIN`.

## Verification checklist

Run these checks after route switch:

1. `curl -I https://www.brandklip.com/` returns Astro response.
2. `curl -I https://www.brandklip.com/blog/` returns Astro response.
3. `curl -I https://www.brandklip.com/branddashboard` returns Wasp response.
4. `curl -I https://www.brandklip.com/robots.txt` returns Astro response.
5. `curl -I https://www.brandklip.com/sitemap.xml` returns Astro response.
6. `curl -I https://www.brandklip.com/oauth/callback` returns Wasp response.
7. `curl -I https://www.brandklip.com/auth/google/callback` returns Wasp response.
8. Confirm canonical tags on Astro pages point to `https://www.brandklip.com/[path]`.
9. Confirm JSON-LD is present on Astro marketing pages and blog pages.
10. Re-run GSC URL Inspection for `/`, `/creators`, `/contact`, `/privacypolicy`, `/terms`, `/blog`, and one `/blog/[slug]`.
