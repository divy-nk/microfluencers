# Project Context (Living Reference)

Last updated: 2026-03-15
Scope: Full `/microfluencers` workspace, with deep detail for active product paths.

## Purpose
- Keep a single source of truth for architecture and feature/file context.
- Use this file as a first lookup before exploring code.
- Update this file whenever new context is discovered.
- Do not treat this as product code; it is documentation-only.

## Update Protocol
1. Add new findings under the relevant section.
2. Append a short entry to `Update Log` with date and what was learned.
3. Prefer file references so details are traceable.
4. If context conflicts, keep both and mark which one appears current.

## AI Context Governance
- This file is the default context anchor for AI work in this workspace.
- Before code changes, read this document first, then open implementation files.
- Keep updates durable and high-signal (architecture, flows, route/operation mapping, model details, recurring pitfalls).
- Avoid low-value churn; do not log trivial one-off edits.
- Instruction file enforcing this behavior: `.github/instructions/project-context-first.instructions.md`.
- **CRITICAL DEPLOYMENT POLICY**: Never push changes to the `main` branch or trigger production deployments without the user's explicit, word-for-word approval for the push. Even if a feature is complete and verified locally, always stop and ask: "Ready to push these changes to main?"

## Workspace Overview
Top-level directories in this workspace:
- `.agents`, `.vscode`, `.github`: agent/tooling and editor config.
- `brandklip`: primary product workspace (active).
- `api-gateway`: standalone Fastify + Supabase API service.
- `background-worker`: standalone cron worker (Supabase-backed).
- `FE`: legacy Vite prototype (explicitly marked non-primary).
- `frontend_archive`: legacy Next.js archive (non-primary).
- `opensaas`: template baseline workspace.
- `saas-starter`, `shadcn-admin`, `temp-pg`: separate starter/demo projects.
- `awesome-claude-code-subagents`, `agent-skills`: agent/skill resources.

Detected package-based projects (`package.json` present):
- `./brandklip/app`
- `./brandklip/blog`
- `./brandklip/e2e-tests`
- `./api-gateway`
- `./background-worker`
- `./FE`
- `./frontend_archive`
- `./opensaas/app`
- `./opensaas/blog`
- `./opensaas/e2e-tests`
- `./saas-starter`
- `./shadcn-admin`
- `./temp-pg`
- workspace root `./package.json`

## Source of Truth (Current)
Primary documentation indicates active implementation is Wasp + Prisma + PostgreSQL:
- `system-design.md`
- `plan.md`
- `BE-development.md`
- `creator-onboarding-module.md`
- `brandklip/README.md`
- `brandklip/app/README.md`

Important context split:
- Active product logic: `brandklip/app`.
- Legacy or parallel Supabase-first services: `api-gateway`, `background-worker`.

## Active Product: `brandklip/app`
Stack and runtime:
- Wasp app (`main.wasp`) + React client + Prisma schema + Postgres.
- Local commands (from docs):
  - `wasp start db`
  - `wasp start`
  - `wasp db migrate-dev`

### Operation Surface (from `main.wasp`)
- `route`: 56
- `page`: 53
- `query`: 50
- `action`: 57
- `job`: 3
- `api`: 1

Primary non-page entry points:
- API endpoint: `paymentsWebhook` -> `POST /payments-webhook` (`brandklip/app/main.wasp`).
- Jobs:
  - `checkAndExpireApplications` (hourly)
  - `dailyPayoutReadinessJob` (daily 01:00)
  - `dailyStatsJob` (hourly)

### Most Referenced Backend Modules (from `main.wasp` imports)
- `@src/application/ops` (38 references)
- `@src/admin/operations` (21)
- `@src/drop/operations` (11)
- `@src/onboarding/operations` (10)
- `@src/user/operations` (8)
- `@src/server/walletActions` (5)
- `@src/file-upload/operations` (5)

### Code Size by `src/` Area
- `src/client`: 151 files, 28423 LOC
- `src/admin`: 26 files, 4179 LOC
- `src/server`: 18 files, 2698 LOC
- `src/application`: 2 files, 2755 LOC
- `src/user`: 5 files, 1470 LOC
- `src/payment`: 10 files, 1280 LOC
- `src/landing-page`: 17 files, 1066 LOC
- `src/drop`: 1 file, 964 LOC
- `src/onboarding`: 1 file, 788 LOC

### Core Domain Flows (as documented)
- Creator onboarding and admin approval lifecycle.
- Drop creation and creator targeting.
- Application lifecycle: apply -> order proof -> video submission -> completion/expiry.
- Video reshoot policy with attempt caps and structured rejection reasons.
- Wallet, escrow, payout, and financial audit flows.

### Key Product Files
- App entry/config: `brandklip/app/main.wasp`
- Domain logic: `brandklip/app/src/application/ops.ts`
- Admin operations: `brandklip/app/src/admin/operations.ts`
- Drop operations: `brandklip/app/src/drop/operations.ts`
- Onboarding operations: `brandklip/app/src/onboarding/operations.ts`
- Wallet actions/queries: `brandklip/app/src/server/walletActions.ts`, `brandklip/app/src/server/walletQueries.ts`
- Data model: `brandklip/app/schema.prisma`

### Backend Operations Detail

**`src/onboarding/operations.ts`**
- Purpose: Creator onboarding submission and validation
- Key operations:
  - `submitCreatorOnboarding` (action) - Validates and stores creator profile
  - `fetchCreatorInstagramInsights` (action) - Creator onboarding autofill endpoint (currently disabled for manual-entry mode)
- Validation schema (`submitCreatorOnboardingSchema`):
  - Exactly 2 content niches required (`.min(2).max(2)`)
  - Min 1 language required
  - Engagement rate required (string)
  - Both sample videos required (`sampleVideoUrl1`, `sampleVideoUrl2`)
  - WhyBrandKlip narrative required
  - Payment details are **not** collected during onboarding (just-in-time payout setup only)
- Data persistence pattern:
  - Engagement rate embedded in `whyBrandKlip` field as `"\n\nEngagement Rate: {value}"`
  - All other fields stored directly in `CreatorProfile` model
- Known constraints:
  - Niche limit must match UI (CreatorOnboardingPage + CreatorSettingsPage)
  - Instagram autofill is temporarily disabled; creators must manually enter profile metrics during onboarding
  - Previous Instaloader implementation path: local script `brandklip/app/scripts/instaloader_profile_insights.py` (kept in repo for later re-enable)

**`src/application/ops.ts`**
- Purpose: Application lifecycle and creator public profile enrichment
- Key operations:
  - `getCreatorPublicProfile` (query) - Returns enriched creator profile for brand decisioning
  - `getBrandCreatorQueue` (query) - Brand application management with pagination
  - `getCreatorApplications`, `getPendingCreatorApplications` - Creator-side application lists
  - `getContentLicenses` (query) - Rights vault content licensing
- Profile enrichment (`getCreatorPublicProfile`):
  - Selects: Instagram, YouTube, followers, avgViews, platforms, niches, languages, DOB, gender, city, state, whyBrandKlip
  - Uses `splitCreatorNarrative()` helper to parse engagement rate from `whyBrandKlip` field
  - Returns engagement rate separately for brand UI rendering
- Helper functions:
  - `splitCreatorNarrative(raw: unknown)` - Parses `"Engagement Rate: X"` line from narrative text using regex `/^Engagement Rate\s*:\s*(.+)$/i`
- Query hardening:
  - Default pagination limits applied to prevent unbounded queries

**`src/admin/operations.ts`**
- Purpose: Admin queue management and escrow operations
- Key operations:
  - `getAdminEscrowQueue` (query) - Escrow queue with scope filtering
  - `getAdminCreatorQueue` (query) - Creator approval queue
  - `getAdminWithdrawalQueue` (query) - Withdrawal request queue
- Escrow queue scopes:
  - `"pending"` - Filters `["pending_gateway", "pending_payment", "payment_submitted"]`
  - `"abandoned"` - Filters `["failed"]` (isolated failed escrows)
  - `"all"` - No status filter
- Security features:
  - Withdrawal destination fields masked in queue responses (`destinationUpiId`, `destinationBankAccount`, `destinationIfsc`, `destinationName`)
  - Bounded pagination with default limits

### Data Model Snapshot (`schema.prisma`)
Detected models (23):
- Identity/core: `User`, `BrandProfile`, `CreatorProfile`, `CreatorBankDetails`
- Campaign/applications: `Drop`, `Application`, `DropEscrow`, `ContentLicense`, `LegalConsent`
- Payout/finance: `CreatorPayout`, `FinancialAuditLog`, `BrandWallet`, `WalletTransaction`, `WalletWithdrawalRequest`
- Operations/admin/notifications: `AdminActivity`, `CreatorNotification`, `NotificationLog`, `PlatformConfig`
- Files/analytics/support: `File`, `DailyStats`, `PageViewSource`, `Logs`, `ContactFormMessage`

### Data Model Detail

**`User`** - Core authentication and identity
- Links to one `BrandProfile` or `CreatorProfile` via `brandProfile`/`creatorProfile` relations
- Fields: `email`, `isEmailVerified`, `role` (`brand`, `creator`, `admin`)
- Auth provider data (Google OAuth, email/password)

**`CreatorProfile`** - Creator onboarding and profile data
- **Personal Info:** `fullName`, `phone`, `dateOfBirth`, `gender`, `city`, `state`, `postalCode`
- **Social Platforms:** `instagramHandle`, `youtubeHandle`, `instagramFollowers`, `youtubeFollowers`, `avgInstagramViews`, `avgYouTubeViews`
- **Content Details:** `platforms[]` (array), `niche[]` (array, exactly 2 required after March 2026 updates), `languages[]` (array, min 1)
- **Sample Work:** `sampleVideoUrl1`, `sampleVideoUrl2`, `whyBrandKlip` (narrative text with embedded engagement rate)
- **Payment:** `upiId`, links to `CreatorBankDetails`
- **Status:** `isCreatorApproved` (admin approval flag)
- **Profile Asset:** `photoUrl`
- Relations: `user` (User), `applications[]` (Application[]), `payouts[]` (CreatorPayout[])

**`CreatorBankDetails`** - Tokenized payout destination data
- Fields: `upiId`, `razorpayFundAccountId`, `preferredMethod`, verification/freeze flags
- Relation: `creator` (User)
- Note: Raw bank account/IFSC/account-holder fields removed from active schema path; token/UPI only

**`BrandProfile`** - Brand account information
- **Company Info:** `brandName`, `brandWebsite`, `industry`, `city`, `state`
- **Contact:** `fullName`, `phone`
- **Status:** `isBrandApproved`
- Relations: `user` (User), `drops[]` (Drop[]), `wallet` (BrandWallet), `applications[]` (Application[])

**`Drop`** - Campaign/drop definition
- **Campaign Details:** `campaignTitle`, `campaignObjective`, `compensationType`, `compensationAmount`, `deliverableSpecs`, `guidelines`, `creatorBrief`
- **Product:** `productName`, `productDescription`, `productImageUrl`, `productValue`
- **Targeting:** `targetGender[]`, `targetLocation[]`, `targetNichePreferences[]`, `minFollowers`, `maxFollowers`, `targetPlatform`
- **Timing:** `startDate`, `endDate`, `applicationDeadline`
- **Limits:** `maxSlots`, `maxAppsPerCreator`
- **Status:** `status` (`draft`, `live`, `closed`, `completed`)
- Relations: `brand` (BrandProfile), `applications[]` (Application[]), `escrow` (DropEscrow)

**`Application`** - Creator application to drop
- **Status:** `status` (`pending`, `approved`, `ordered`, `proof_submitted`, `proof_verified`, `content_submitted`, `review_requested`, `approved`, `completed`, `rejected`, `expired`)
- **Content Submission:** `videoUrl`, `videoThumbnailUrl`, `orderProofUrl`
- **Rejection Tracking:** `rejectionReason`, `rejectionDetails`, `reshootAttempts`
- **Timestamps:** `appliedDate`, `approvedDate`, `orderPlacedDate`, `orderProofSubmittedDate`, `videoSubmittedDate`, `completedDate`, `expiresAt`
- Relations: `drop` (Drop), `creator` (CreatorProfile), `brand` (BrandProfile), `license` (ContentLicense), `legalConsent` (LegalConsent)

**`DropEscrow`** - Payment escrow for campaign
- **Amount:** `amount` (total locked funds)
- **Status:** `status` (`pending_gateway`, `payment_submitted`, `pending_payment`, `completed`, `failed`)
- **Payment Gateway:** `gatewayOrderId`, `gatewayPaymentId`, `gatewaySignature`
- **Metadata:** `metadata` (JSON for payment details)
- Relations: `drop` (Drop)

**`ContentLicense`** - Rights grant for completed content
- **License Info:** `licenseCode` (unique), `licenseType`, `usageTerms`, `grantedAt`
- **Content:** `contentUrl`, `contentThumbnailUrl`
- **Parties:** `creatorName`, `brandName`, `campaignTitle`
- Relations: `application` (Application)

**`CreatorPayout`** - Creator payment record
- **Amount:** `amount`
- **Status:** `status` (`pending`, `processing`, `completed`, `failed`)
- **Destination:** `payoutUpiId` or `payoutRazorpayFundAccountId` token snapshot (no raw bank account snapshot)
- **Transaction:** `transactionId`, `processedAt`, `failureReason`
- **Audit:** Links to `FinancialAuditLog`
- Relations: `creator` (CreatorProfile), `application` (Application)

**`BrandWallet`** - Brand wallet balance
- **Balance:** `balance` (current available), `withdrawableBalance` (refund-eligible), `nonWithdrawableBalance` (promo/BrandKlip credits)
- **Tracking:** `totalCredited`, `totalUsed`, `totalWithdrawn`
- Relations: `brand` (BrandProfile), `transactions[]` (WalletTransaction[]), `withdrawalRequests[]` (WalletWithdrawalRequest[])

**`WalletTransaction`** - Wallet transaction log
- **Type:** `type` (`credit`, `debit`, `escrow_lock`, `escrow_release`, `withdrawal`)
- **Amount:** `amount`
- **Balance:** `balanceBefore`, `balanceAfter`
- **Source Split:** `sourceBucket` plus `withdrawableAmount` / `nonWithdrawableAmount` for persistent fund provenance
- **Reference:** `reference` (description), `metadata` (JSON)
- Relations: `wallet` (BrandWallet)

**`WalletWithdrawalRequest`** - Brand withdrawal request
- **Amount:** `amount`
- **Status:** `status` (`pending`, `approved`, `rejected`, `completed`)
- **Destination:** `method` (`bank`, `upi`), destination fields (masked in admin responses)
- **Processing:** `processedAt`, `processedBy`, `rejectionReason`
- Relations: `wallet` (BrandWallet)

**`FinancialAuditLog`** - Complete financial audit trail
- **Transaction:** `userId`, `entityType`, `entityId`, `actionType`, `amount`
- **Context:** `description`, `metadata` (JSON)
- **Timestamp:** `createdAt`

**`AdminActivity`** - Admin action tracking
- **Action:** `action`, `targetEntity`, `targetId`
- **Details:** `description`, `metadata` (JSON)
- **Actor:** `performedBy` (admin user)

**`CreatorNotification`** - Creator notification queue
- **Notification:** `type`, `title`, `message`
- **Status:** `isRead`
- Relations: `creator` (CreatorProfile)

**`NotificationLog`** - System notification history
- **Recipient:** `recipientEmail`
- **Content:** `subject`, `message`
- **Delivery:** `sentAt`, `status`

**`PlatformConfig`** - Platform-wide settings
- **Config:** `key`, `value` (JSON), `description`
- Used for: Fee percentages, limits, feature flags

**`File`** - File upload tracking
- **File:** `key`, `url`, `name`, `type`, `size`
- **Upload:** `uploadedAt`
- Relations: `user` (User)

**`DailyStats`** - Platform analytics
- **Metrics:** `totalUsers`, `totalCreators`, `totalBrands`, `totalDrops`, `totalApplications`, `totalCompletedApplications`, `totalRevenue`
- **Date:** `date`

**`PageViewSource`** - Traffic source tracking
- **Source:** `name`, `visitors`, `lastVisit`

**`ContactFormMessage`** - Contact form submissions
- **Message:** `name`, `email`, `message`, `content`
- **Status:** `status`, `createdAt`

**`LegalConsent`** - Creator legal compliance
- **Consent:** `termsAccepted`, `privacyAccepted`, `contentRightsAccepted`, `ipAddress`, `acceptedAt`
- Relations: `application` (Application)

## Standalone Service: `api-gateway`
Tech:
- Fastify, `fastify-cors`, Supabase JS.
- Auth middleware uses bearer token + Supabase auth lookup.
- Role guard checks `profiles.role`.

Observed routes in `api-gateway/index.js`:
- `GET /health`
- `GET /drops`
- `POST /drops`
- `POST /applications`
- `PUT /applications/:id/submit-content`
- `POST /applications/:id/sync-views`
- `GET /creator/earnings`
- `GET /brand/campaign-stats/:id`
- `POST /applications/:id/process-payout`
- `GET /admin/duplicate-orders`
- `POST /webhooks/flag-return`
- `GET /creator/trust-dashboard`

Notes:
- Includes trust score system and split payout logic.
- Appears to represent Supabase-first service architecture separate from Wasp operations.

## Standalone Service: `background-worker`
Tech:
- `node-cron` + Supabase JS.

Observed scheduled jobs in `background-worker/worker.js`:
- Nudge bot (daily 8 AM): reminders for stale pending applications.
- View sync (every 6 hours): updates simulated view/engagement metrics and bonus triggers.
- Payout calculator (daily 10 AM): computes performance payouts, applies fraud heuristics.
- Duplicate order scanner (daily midnight): runs RPC and blacklists duplicates.

Notes:
- Service appears MVP/manual-ops oriented in comments.
- Keep in mind this worker belongs to the Supabase-oriented path, not the Wasp-native job system.

## Other Notable Folders
- `FE`: legacy prototype, explicitly marked non-primary in `FE/README.md`.
- `frontend_archive`: legacy Next.js snapshot, non-primary.
- `brandklip/blog`: docs/marketing site (Astro/Starlight).
- `brandklip/e2e-tests`: Playwright tests for active app.
- `opensaas/*`: template baseline retained for reference.

## Brand Assets Notes
- Current black logo source file provided by user: `brandklip/brandklip assets/black logo.png`.
- App-served black logo path used across UI: `brandklip/app/public/logo-black.png`.
- Replacing `public/logo-black.png` updates most app logos without component code changes.
- Dot-grid BrandKlip mark has been removed from shared components and replaced with `/logo-black.png` in:
  - `brandklip/app/src/client/components/BrandKlipLogo.tsx`
  - `brandklip/app/src/client/components/layout/Dashboard01Layout.tsx`

## Complete Route Map

### Public Routes (Unauthenticated)
- `/` - Landing page with hero, features, CTAs (LandingPage)
- `/brands` - Brand-focused marketing page (ForBrandsPage)
- `/creators` - Creator-focused marketing page (ForCreatorsPage)
- `/contact` - Contact form page for support and inquiries (ContactPage)
- `/login` - Email/Google login (LoginPage)
- `/signup` - User registration (SignupPage)
- `/pricing` - Pricing plans and features (PricingPage)
- `/forgot-password` - Password recovery initiation (ForgotPasswordPage)
- `/request-password-reset` - Password reset request (RequestPasswordResetPage)
- `/password-reset` - Password reset confirmation (PasswordResetPage)
- `/email-verification` - Email verification handler (EmailVerificationPage)
- `/sample-license` - Public license certificate example (SampleLicensePage)

### Brand Routes (Brand Role Only)
**Dashboard & Overview:**
- `/branddashboard` - Brand home: active campaigns, stats, quick actions (BrandDashboardPage)
- `/dashboard` - Generic dashboard redirect (DashboardPage)

**Campaign Management:**
- `/brand/applications` - Application queue: pending/active/completed (BrandApplicationsPage)
- `/brand/pending` - Alias for application queue (BrandApplicationsPage)
- `/brand/vault` - Rights vault: all licensed content (RightsVaultPage)
- `/brand/wallet` - Wallet balance, transactions, withdrawals (BrandWalletPage)
- `/drop/:dropId` - Campaign detail page with applications (DropDetailPage)
- `/brand/drop/:dropId/pay` - Escrow payment checkout (BrandEscrowPaymentPage)

**Settings:**
- `/brand/notifications` - Notification preferences (BrandNotificationsPage)
- `/brand/subscription` - Subscription management (BrandSubscriptionPage)
- `/onboarding/brand` or `/brand-onboarding` - Brand profile setup (BrandOnboardingPage)

### Creator Routes (Creator Role Only)
**Dashboard & Discovery:**
- `/creatordashboard` - Creator home: earnings, pending apps, eligible drops (CreatorDashboardPage)
- `/creator/drops` or `/available-drops` - Browse available campaigns (CreatorDropsPage / AvailableDropsPage)
- `/drop/:dropId` - Campaign detail with apply action (DropDetailPage)

**Application Workflow:**
- `/creator/applications` - Application history: pending/active/completed (CreatorApplicationsPage)
- `/creator/submit/:applicationId` - Video upload page (CreatorSubmitVideoPage)
- `/creator/campaigns` - Active campaigns dashboard (CreatorCampaignsPage)

**Earnings & Stats:**
- `/creator/payouts` - Payout history and status (CreatorPayoutsPage)
- `/creator/stats` - Performance analytics (CreatorStatsPage)

**Settings:**
- `/creator/settings` - Social accounts, niches, payment details (CreatorSettingsPage)
- `/creator/notifications` - Notification preferences (CreatorNotificationsPage)
- `/onboarding/creator` or `/creator-onboarding` - Creator profile onboarding (CreatorOnboardingPage)

### Admin Routes (Admin Role Only)
**Overview:**
- `/admin` - Admin dashboard overview (AdminOverviewPage)

**User Management:**
- `/admin/users` - All users list (AdminUsersPage)
- `/admin/creators` - Creator approval queue (AdminCreatorsPage)
- `/admin/creators-list` - Complete creator directory (AdminCreatorsListPage)
- `/admin/brands` - Brand management (AdminBrandsPage)
- `/admin/team` - Team member management (AdminTeamPage)

**Operations:**
- `/admin/video-review` - Video content moderation queue (AdminVideoReviewPage)
- `/admin/drops` - All campaigns overview (AdminDropsPage)
- `/admin/payouts` - Escrow queue (Pending/Abandoned/All tabs) and payout processing (AdminPayoutsPage)
- `/admin/audit-log` - Financial audit trail (AdminFinancialAuditPage)

**Analytics & Monitoring:**
- `/admin/analytics` - Platform analytics (AdminAnalyticsPage)
- `/admin/activity` - Admin activity log (AdminActivityPage)
- `/admin/calendar` - Event calendar (AdminCalendarPage)
- `/admin/messages` - Message management (AdminMessagesPage)

**Configuration:**
- `/admin/settings` - Platform configuration (AdminSettingsPage)
- `/admin/ui/buttons` - UI component preview (AdminUIButtonsPage)

### Shared/Utility Routes
- `/account` - User account settings (AccountPage)
- `/file-upload` - File upload utility (FileUploadPage)
- `/video-review` - Video review interface (VideoReviewPage)
- `/checkout` - Payment checkout result (CheckoutResultPage)
- `*` - 404 Not Found (NotFoundPage)

## Feature Inventory

### Creator Onboarding System
**Files:** `CreatorOnboardingPage.tsx`, `onboarding/operations.ts`
**Flow:** 5-step wizard → backend validation → admin approval queue
**Data Collection:**
- Step 0: Personal info (name, phone, DOB, gender, location, languages)
- Step 1: Platform accounts (Instagram, YouTube, followers, avg views, exactly 2 niches, engagement rate)
- Step 2: Sample work (2 video URLs, whyBrandKlip narrative)
- Step 3: Payment details (UPI or bank account)
- Step 4: Profile photo
**Validation:** Zod schema with `.superRefine()` for cross-field payment validation
**Storage:** `CreatorProfile` model, engagement rate embedded in `whyBrandKlip` field

### Application Lifecycle
**Files:** `application/ops.ts`, `BrandApplicationsPage.tsx`, `CreatorApplicationsPage.tsx`
**Statuses:** `pending` → `approved` → `ordered` → `proof_submitted` → `proof_verified` → `content_submitted` → `review_requested` → `approved`/`completed`
**Key Operations:**
- `applyToDrop` - Creator applies to campaign
- `brandPreApproveCreator` - Brand pre-approves creator
- `placeOrder` - Brand confirms product order
- `brandVerifyOrder` - Brand verifies order proof screenshot
- `submitCreatorVideo` - Creator uploads content
- `requestVideoReview` - Creator requests admin review
**Rejection Flow:** Structured reasons, reshoot attempts with caps, full audit trail

### Escrow & Payout System
**Files:** `admin/operations.ts`, `AdminPayoutsPage.tsx`, `walletActions.ts`
**Escrow Scopes:**
- **Pending** - `["pending_gateway", "pending_payment", "payment_submitted"]`
- **Abandoned** - `["failed"]` (isolated failed payments)
- **All** - Complete history
**Flow:** Drop creation → escrow lock → content delivery → payout trigger → admin process → creator bank transfer
**Models:** `DropEscrow`, `CreatorPayout`, `FinancialAuditLog`

### Content Licensing & Rights Vault
**Files:** `application/ops.ts`, `RightsVaultPage.tsx`, `BrandApplicationsPage.tsx`
**License Generation:** Auto-generated on application completion with unique code
**Certificate:** Printable PDF-style certificate with BrandKlip branding
**Vault Features:** Search by creator/campaign/license code, download content, view/print licenses
**Model:** `ContentLicense` with perpetual usage rights grant

### Wallet System
**Files:** `server/walletActions.ts`, `server/walletQueries.ts`, `BrandWalletPage.tsx`
**Operations:** Credit, debit, withdrawal requests, transaction history
**Withdrawal:** Minimum amount validation, fee calculation, admin approval required
**Models:** `BrandWallet`, `WalletTransaction`, `WalletWithdrawalRequest`
**Transaction Types:** `credit`, `debit`, `escrow_lock`, `escrow_release`, `withdrawal`

### Discovery & Targeting
**Files:** `drop/operations.ts`, `CreatorDropsPage.tsx`, `CreatorDashboardPage.tsx`
**Filters:** Location matching, niche alignment, follower range, platform availability
**Creator View:** Shows only eligible drops based on profile (uses `getCreatorDropsDiscovery`)
**Consistency:** Dashboard eligible-drop count matches browse page via shared query

### Admin Approval Workflows
**Creator Approval:**
- **Queue:** `/admin/creators` using `getAdminCreatorQueue`
- **Review:** Profile details, sample videos, engagement metrics
- **Action:** Approve (set `isCreatorApproved: true`) or reject

**Video Review:**
- **Queue:** `/admin/video-review` using `getAdminVideoQueue`
- **Review:** Content quality, brand guidelines compliance
- **Action:** Approve (mark application completed) or reject with reason

**Payout Processing:**
- **Queue:** `/admin/payouts` using `getAdminEscrowQueue`
- **Process:** `processCreatorPayout` initiates bank transfer
- **Tracking:** `FinancialAuditLog` records all financial operations

## Component Reference

### Layout Components
**`Dashboard01Layout`** (`src/client/components/layout/Dashboard01Layout.tsx`)
- Main dashboard shell with sidebar navigation
- Mobile back button logic (shows on deep routes, hidden on tab roots)
- Role-aware navigation menus
- Used by: All authenticated pages

**`BrandKlipLogo`** (`src/client/components/BrandKlipLogo.tsx`)
- Centralized logo component using `/logo-black.png`
- Configurable sizes
- Used by: Landing page, dashboards, headers

### Shared UI Components
**`CreatorSamplesSheet`** (inline in BrandApplicationsPage.tsx)
- Displays creator sample videos + complete onboarding profile
- Shows 11 profile fields: Instagram, YouTube, followers, avg views, engagement rate, gender, DOB, location, platforms, niches, languages
- Used by: Brand application review flow

**License Certificate Modal** (BrandApplicationsPage.tsx, RightsVaultPage.tsx)
- Print-optimized license display using `.license-print-shell` portal
- Sets `body.printing-license` class during print
- Includes BrandKlip branding on certificate
- In-page print via `window.print()`

**Mobile Back Button** (Dashboard01Layout.tsx)
- Visible on mobile viewports (max-width: 1023px)
- Hidden on tab-root routes (`/branddashboard`, `/creatordashboard`, etc.)
- Navigates via `navigate(-1)` with role-based fallback
- Essential for iOS standalone/PWA mode

### Form Components
**Creator Onboarding Steps** (CreatorOnboardingPage.tsx)
- Multi-step wizard with step-gated validation
- Niche selector with 2-item limit and major/minor labeling
- Engagement rate input with inBeat calculator link
- Payment details with UPI/bank conditional fields

## Operations Reference

### Query Operations
**Discovery & Lists:**
- `getCreatorDropsDiscovery` - Eligible drops for creator (filtered by targeting, location, niche)
- `getLiveDrops` - All active drops (admin/brand view)
- `getBrandCreatorQueue` - Brand application queue with pagination
- `getAdminCreatorQueue` - Admin creator approval queue with pagination
- `getAdminVideoQueue` - Admin video review queue
- `getAdminEscrowQueue` - Admin escrow queue with scope filtering (pending/abandoned/all)
- `getContentLicenses` - Rights vault licenses with pagination

**Detail Views:**
- `getCreatorPublicProfile` - Enriched creator profile for brand decisioning (11+ fields, parsed engagement rate)
- `getDropById` - Single drop details
- `getApplicationById` - Single application details
- `getBrandWallet` - Wallet balance and transaction history
- `getCreatorStats` - Creator performance analytics

**Counts & Aggregates:**
- `getBrandApplicationCounts` - Pending/active/completed counts
- `getCreatorApplicationStats` - Creator application metrics

### Action Operations
**Onboarding:**
- `submitCreatorOnboarding` - Validates and creates creator profile (Zod schema with superRefine)
- `submitBrandOnboarding` - Creates brand profile

**Application Flow:**
- `applyToDrop` - Creator applies to drop
- `brandPreApproveCreator` - Brand pre-approves from queue
- `placeOrder` - Brand places product order
- `brandVerifyOrder` - Brand verifies order proof
- `rejectOrderDetails` - Brand rejects order proof with reason
- `submitCreatorVideo` - Creator uploads video content
- `requestVideoReview` - Creator requests admin review

**Admin Actions:**
- `approveCreator` - Admin approves creator profile
- `processCreatorPayout` - Admin initiates payout transfer
- `approveVideo` - Admin approves submitted video
- `rejectVideo` - Admin rejects video with reason

**Wallet Operations:**
- `requestWalletWithdrawal` - Brand requests wallet withdrawal
- `creditBrandWallet` - Admin credits brand wallet
- `lockEscrow` - Lock funds for drop
- `releaseEscrow` - Release funds on completion

## Data Flow Patterns

### Creator Onboarding → Brand Review Flow
1. Creator fills 5-step form (`CreatorOnboardingPage`)
2. `submitCreatorOnboarding` validates with Zod schema, embeds engagement rate in `whyBrandKlip`
3. Admin reviews in queue (`getAdminCreatorQueue`)
4. Brand views profile via `getCreatorPublicProfile`:
   - `splitCreatorNarrative()` parses engagement rate from `whyBrandKlip`
   - Returns 11 profile fields + sample videos
5. Brand makes decisioning in `CreatorSamplesSheet` modal

### Application → Payout Flow
1. Creator applies (`applyToDrop`) → status: `pending`
2. Brand pre-approves (`brandPreApproveCreator`) → status: `approved`
3. Brand places order (`placeOrder`) → status: `ordered`
4. Creator uploads proof (`brandVerifyOrder`) → status: `proof_submitted`
5. Brand verifies proof (`brandVerifyOrder`) → status: `proof_verified`
6. Creator submits video (`submitCreatorVideo`) → status: `content_submitted`
7. Creator requests review (`requestVideoReview`) → status: `review_requested`
8. Admin approves (`approveVideo`) → status: `approved`/`completed`
9. Escrow triggers payout → Admin processes (`processCreatorPayout`)

### Escrow State Machine
- Drop created → `DropEscrow` with status `pending_gateway`
- Payment submitted → status `payment_submitted`
- Payment confirmed → status `pending_payment`
- Application completed → Payout eligibility check
- Admin processes → Bank transfer initiated → status `completed`
- Payment fails → status `failed` (visible in "Abandoned" tab)

## Practical Reference Workflow
When asked about a feature/file:
1. Check this document first for known location in Route Map or Feature Inventory.
2. Reference Operations Reference for backend logic.
3. Check Page Knowledge Base for UI implementation details.
4. Open the referenced files for exact implementation.
5. Add any newly confirmed details back into this document.
6. Keep code untouched unless explicitly requested.

## Page Knowledge Base (Bug Triage Index)
Rule:
- Every time a page file is read, add/update an entry here with route(s), file path, key operations, major UI sections, and known bug-prone behaviors.

Read pages and details:

1. `BrandApplicationsPage`
- Routes: `/brand/applications`, `/brand/pending`
- File: `brandklip/app/src/client/BrandApplicationsPage.tsx`
- Primary operations used:
  - `getBrandCreatorQueue`, `getBrandDropsForFilter`, `getBrandApplicationCounts`
  - `getCreatorPublicProfile` (enriched with full onboarding profile)
  - `brandPreApproveCreator`, `brandVerifyOrder`, `rejectOrderDetails`, `getScreenshotDownloadUrl`
- Main UI sections:
  - Header KPI cards (pending/active/completed)
  - Drop filter pills
  - Tabbed views: Pending, Active, Completed
  - **Creator samples dialog** (CreatorSamplesSheet):
    - Sample videos with thumbnails
    - **Complete onboarding profile grid** (11 fields):
      - Instagram handle, YouTube handle
      - Followers, avg views, engagement rate (parsed from whyBrandKlip)
      - Gender, DOB, location (city + state)
      - Platforms (comma-separated), niches (comma-separated), languages (comma-separated)
    - About/narrative text
  - Order verification dialog + reject-reason dialog
  - License certificate dialog with print action
- Data enrichment (`src/application/ops.ts`):
  - `getCreatorPublicProfile` now selects: DOB, languages, platforms, niches
  - Uses `splitCreatorNarrative()` helper to parse engagement rate from `whyBrandKlip` field
  - Returns engagement rate separately for brand decisioning
- Known sensitive behaviors:
  - Active-tab status sorting priority logic
  - Order proof verification/rejection path and validation
  - Modal scroll containment and print flow now uses in-page `.license-print-shell` output

2. `RightsVaultPage`
- Route: `/brand/vault`
- File: `brandklip/app/src/client/RightsVaultPage.tsx`
- Primary operations used:
  - `getContentLicenses`
- Main UI sections:
  - Vault hero with aggregate stats (videos, creators, estimated reach)
  - Search filter by creator/campaign/license code
  - License cards with download and license-view actions
  - License certificate dialog with print action
- Known sensitive behaviors:
  - License modal internal scroll vs background page scroll
  - Print rendering now depends on `.license-print-shell` and `body.printing-license` print state

3. `BrandWalletPage`
- Route: `/brand/wallet`
- File: `brandklip/app/src/client/brand/WalletPage.tsx`
- Primary operations used:
  - `getBrandWallet`, `requestWalletWithdrawal`
- Main UI sections:
  - Wallet hero (balance, credited, used)
  - Wallet usage CTA to create drops
  - Transaction history list by transaction type
  - "How it works" dialog
  - Withdrawal bottom sheet (amount, method, fee/net preview, submit)
- Known sensitive behaviors:
  - Withdrawal validation (min amount, balance checks, method-specific fields)
  - Fee percent uses server value with local fallback

4. `BrandklipLandingPage`
- Route: `/`
- File: `brandklip/app/src/client/BrandklipLandingPage.tsx`
- Main UI sections:
  - Hero, CTA buttons, creator avatar strip
  - Feature blocks (`TabbedFeatures`, `ScrollFeatures`, `BentoFeatures`)
  - Footer
- Known sensitive behaviors:
  - Must not import removed Wasp operations from `wasp/client/operations` (caused TS2305 previously)

5. `CreatorOnboardingPage`
- Routes: `/onboarding/creator`, `/creator-onboarding`
- File: `brandklip/app/src/client/CreatorOnboardingPage.tsx`
- Primary operations used:
  - `submitCreatorOnboarding` (hardened validation)
- Main UI sections:
  - 5-step onboarding flow:
    - **Step 0: About You** - Name, phone (10-15 digits), DOB, gender, city, state, languages (min 1 required)
    - **Step 1: Platforms** - Instagram/YouTube handles, follower counts, avg views, content niches (exactly 2 required: major + minor), engagement rate (required, with inBeat calculator link)
    - **Step 2: Your Work** - Sample video URLs (both required), whyBrandKlip narrative (required)
    - **Step 3: Get Paid** - UPI ID OR bank details (account number, IFSC, name) via mutually exclusive validation
    - **Step 4: Your Photo** - Profile photo upload (required)
- Data storage:
  - All fields stored in `CreatorProfile` model
  - Engagement rate embedded in `whyBrandKlip` field as `"\n\nEngagement Rate: {value}"` for persistence
  - Parsed back via `splitCreatorNarrative()` in `src/application/ops.ts`
- Backend validation (`src/onboarding/operations.ts`):
  - `submitCreatorOnboardingSchema` enforces:
    - Exactly 2 niches (`.min(2).max(2)`)
    - Min 1 language
    - Required engagement rate
    - Both sample videos required
    - Complete payment details via `.superRefine()` cross-field validation (UPI or full bank info)
- Known sensitive behaviors:
  - Step-gated validation prevents advancing without required fields
  - Niche selection capped at 2 with toast feedback
  - Phone validation regex: `/^\d{10,15}$/`
  - Profile photo required before final submission

6. `DropDetailPage`
- Route: `/drop/:dropId`
- File: `brandklip/app/src/client/DropDetailPage.tsx`
- Main UI sections:
  - Campaign hero card (brand, status, campaign title, optional product image)
  - Role-aware campaign/application actions and status handling
  - Financial and performance cards and supporting dialogs/sheets
- Known sensitive behaviors:
  - Back navigation now relies on shared mobile header back behavior from `Dashboard01Layout`.
  - In-page breadcrumb strip (BACK > CAMPAIGN > BRAND) was removed to avoid duplicate navigation UI.

7. `CreatorDashboardPage`
- Route: `/creatordashboard`
- File: `brandklip/app/src/client/CreatorDashboardPage.tsx`
- Primary operations used:
  - `getCreatorDropsDiscovery` (aligned with browse page for consistent eligible-drop count)
  - `getPendingCreatorApplications`, `getCreatorStats`, `getCreatorWallet`
- Main UI sections:
  - Dashboard hero with stats (total earnings, pending payouts, available drops count)
  - Pending applications cards
  - Eligible drops preview
- Data alignment fix:
  - Previously used `getLiveDrops` causing count mismatch with discovery page
  - Now uses `getCreatorDropsDiscovery` for consistent filtering (targeting, location, niche matching)
- Known sensitive behaviors:
  - Eligible-drop count must match `/creator/browse` page exactly

8. `AdminPayoutsPage`
- Route: `/admin/payouts`
- File: `brandklip/app/src/client/AdminPayoutsPage.tsx`
- Primary operations used:
  - `getAdminEscrowQueue` (with scope: "pending" | "abandoned" | "all")
  - `processCreatorPayout`, `getAdminCreatorPayouts`
- Main UI sections:
  - Tabbed escrow queue: **Pending**, **Abandoned**, **All**
  - Payout history table
- Escrow queue scope logic (`src/admin/operations.ts`):
  - **Pending**: filters `["pending_gateway", "pending_payment", "payment_submitted"]`
  - **Abandoned**: filters `["failed"]` (isolated view for failed escrows)
  - **All**: no status filter
- Known sensitive behaviors:
  - Failed escrows previously mixed with pending; now separated into dedicated tab
  - Abandoned tab provides focused view for troubleshooting payment failures

9. `CreatorSettingsPage`
- Route: `/creator/settings`
- File: `brandklip/app/src/client/creator/CreatorSettingsPage.tsx`
- Primary operations used:
  - `updateCreatorSocialSettings`, `getCreatorProfile`
- Main UI sections:
  - Social platforms editor
  - Content niche selector (max 2)
  - Profile photo upload
- Validation alignment:
  - Niche max reduced from 5 to 2 to match onboarding constraints
  - Label shows `Content Niche ({current.length}/2)`
- Known sensitive behaviors:
  - Settings page niche limit must stay in sync with onboarding validation

## Known Build Pitfalls
- Wasp operation declarations in `main.wasp` must stay in sync with client imports from `wasp/client/operations`.
- Confirmed pitfall: `makeMeAdminByEmail` was removed from `brandklip/app/main.wasp`, but `brandklip/app/src/client/BrandklipLandingPage.tsx` still imported it, causing SDK TypeScript build failure (`TS2305`).
- Quick check when this happens: search for removed operation name across `brandklip/app/src/**` and remove stale imports/usages.
- DigitalOcean static build pitfall: temporary Vite config must include Tailwind plugin. If `.wasp-static-vite.config.mjs` only uses `wasp()` plugin, Tailwind utility classes are missing in output CSS and the site appears "broken"/unstyled (for example `fixed`, `text-6xl`, spacing classes not applied).

## Known UI Pitfalls
- License modal print styles must be narrowly scoped. Broad print selectors (for example forcing all `.fixed`/`.absolute` to `position: static`) can break print layout and produce blank/incorrect print previews.
- For long modal content (like license text), keep the inner content container scrollable with `min-h-0`, `overflow-y-auto`, `overscroll-contain`, and touch momentum scrolling so wheel/touch scrolling stays inside the dialog.
- License printing in this app is in-page (`window.print()`), with a dedicated print-only container `.license-print-shell` shown only when `body.printing-license` is active.
- Shared bottom overlays use `SheetContent`, `DialogContent`, and `DrawerContent` from `src/client/components/ui/*`. For constrained-width mobile bottom variants, keep horizontal centering in shared primitives (`left-1/2`, `-translate-x-1/2`, `w-full`) to avoid global left-aligned drift.
- Landing route visual effects must fail safely when WebGL is unavailable. `cobe` globe initialization can throw (`Cannot read properties of null (reading 'enable')`) on some browsers/devices and break route render unless guarded.

## Known Build And Bundling Pitfalls
- Dynamic imports do not isolate a module if any static import remains. Example: `src/client/CreatorOnboardingPage.tsx` stayed in the main bundle until all `LANGUAGES` static imports were moved to `src/client/constants/languages.ts`.
- The largest app chunk has recently been driven by UI utility dependencies (`tailwind-merge`, Radix UI primitives, `lucide-react`) after splitting major vendors. Further reduction requires import-level optimization in shared UI layers, not only route-level lazy loading.

### Mobile Navigation Notes
- iOS cannot provide a custom native/system back button for web apps; back UX must be implemented in-app.
- The app sets `apple-mobile-web-app-capable` in `brandklip/app/main.wasp`, so Home Screen standalone mode can hide Safari's browser chrome/back controls.
- Shared mobile back behavior is implemented in `brandklip/app/src/client/components/layout/Dashboard01Layout.tsx`:
  - Shows in mobile viewport (`max-width: 1023px`) so it is testable in browser mobile emulation and available on iOS.
  - Hidden on dashboard/tab-root pages (for example `/branddashboard`, `/creatordashboard`, `/brand/applications`, `/brand/wallet`, `/brand/vault`, `/account`, etc.).
  - Visible on deeper screens where users can navigate back.
  - Action: `navigate(-1)` when history exists; otherwise fallback to role home (`/branddashboard` or `/creatordashboard`, else `/`).

### Creator Metrics Governance
- Admin creator review supports manual overrides for `followersCount` and `engagementRate` via `adminUpdateCreatorProfile`.
- Engagement rate remains embedded in `CreatorProfile.whyBrandKlip` (`Engagement Rate: X`) and is updated by rebuilding that narrative field.
- Any admin override of followers or engagement writes `AdminActivity` with `actionType = "admin_update_creator_profile"` and marks creator social metrics as locked (derived from activity metadata keys).
- Creator-side social settings (`updateCreatorSocialSettings`) now enforce this lock server-side: creator edits to followers or engagement are rejected once admin override exists.
- Admin creators list (`/admin/creators-list`) surfaces engagement rate in each creator card and supports inline editing via `adminUpdateCreatorProfile`, alongside follower count edits.

## Update Log
- 2026-03-15: Implemented source-aware wallet accounting in `brandklip/app` to prevent withdrawal of BrandKlip-issued credits. Added dual wallet buckets (`withdrawableBalance`, `nonWithdrawableBalance`), source split metadata on `WalletTransaction`, escrow source fields on `DropEscrow` (`walletAmountAppliedWithdrawable`, `walletAmountAppliedNonWithdrawable`, `fundedFromCash`, `fundedFromWallet*`), source-preserving debit/credit logic in `src/server/walletUtils.ts`, source-aware flows in `src/server/walletActions.ts` + `src/server/payments/razorpay.ts`, and wallet UI/query updates so withdrawals are constrained to refundable balance only.
- 2026-03-13: Performance split pass in `brandklip/app`: removed static `CreatorOnboardingPage` dependencies by extracting `LANGUAGES` to `src/client/constants/languages.ts`, updated all consumers (`BrandDashboardPage`, `AvailableDropsPage`, `DropCard`, `AccountPage`), and added `manualChunks` groups in `vite.config.ts` for heavy vendors (`react`, `react-router`, `framer-motion`, `gsap`, `zod`, `axios`, `@tanstack/*`). Post-change bundle output now emits separate `vendor-*` chunks and no longer reports the prior dynamic+static import conflict for onboarding.
- 2026-03-13: Integrated blogs directly into the Wasp marketing app (no separate blog host requirement) by adding public routes `/blog` and `/blog/:slug` in `brandklip/app/main.wasp`, with React pages `src/client/BlogsPage.tsx` and `src/client/BlogPostPage.tsx`. Post content is served from `brandklip/app/public/blog/*.md` and rendered in-app via `react-markdown` + `remark-gfm`; `App.tsx` treats blog paths as marketing routes.
- 2026-03-13: Finalized production-oriented Astro blog config under `brandklip/blog/astro.config.mjs`: set canonical site to `https://www.brandklip.com`, replaced placeholder title/description/social/edit-link values with BrandKlip values, wired GA tag to `G-SKBZLTYCVJ`, and aligned blog authors with configured key (`BrandKlip`). Verified static generation succeeds (`astro check && astro build`) producing `/blog/*` routes + sitemap.
- 2026-03-13: Hardened auth and contact anti-leakage behavior in `brandklip/app`: `resendVerificationOnLoginFailure` now returns a uniform non-enumerating response (no `not_found` / `already_verified` signals), login/signup UIs updated to avoid account-existence messaging, and contact submission guardrails strengthened with additional per-IP throttling plus single-line subject sanitization before email dispatch.
- 2026-03-13: Added public `/contact` route and `submitContactMessage` action in `brandklip/app` to support Contact Us form submissions; action sends email to admin addresses (`ADMIN_EMAILS` or fallback support email), applies anti-spam rate limiting, and stores message payload in `ContactFormMessage` when sender is authenticated.
- 2026-03-10: Identified production layout-break root cause in static deploy pipeline: `.wasp-static-vite.config.mjs` used only `wasp()` plugin, which skipped Tailwind utility generation in static output. Verified fix by adding `@tailwindcss/vite` plugin (`plugins: [tailwindcss(), wasp()]`) and confirming utility selectors exist in built CSS.
- 2026-03-10: Fixed production landing-route crash on browsers/devices with unavailable WebGL by making `src/client/components/ui/globe.tsx` tolerant of `cobe` init failures (catch + graceful no-globe fallback instead of route-level crash).
- 2026-03-09: Added temporary subscription-hide switch in active client app via `brandklip/app/src/client/featureFlags.ts` (`SUBSCRIPTIONS_ENABLED = false`). When disabled, `App.tsx` redirects `/pricing`, `/brand/subscription`, and `/checkout` to role home (or `/` if logged out), escrow upgrade UI/CTA is suppressed in `EscrowPaymentPage.tsx`, and marketing Hero "Learn More" avoids pricing route.
- 2026-03-09: Security hardening in active wallet/payout paths (`brandklip/app`): (1) `applyWalletToEscrow` now locks escrow row (`SELECT ... FOR UPDATE`) before applying wallet to block concurrent double-apply races, (2) `adminProcessWithdrawal` now uses compare-and-set style status transitions (`pending_admin` only) to prevent complete/reject race drift, (3) `requestWalletWithdrawal` encrypts destination fields (`destinationUpiId`, bank account, IFSC, name) at rest using shared AES-256-GCM helper in `src/server/security/encryption.ts`, with backward-compatible decrypt-and-mask in `getAdminWithdrawalQueue`, and (4) `saveCreatorBankDetails` now rejects client-supplied `razorpayFundAccountId` writes unless set by trusted server-side Razorpay tokenization flows.
- 2026-03-09: Payout setup now supports dual creator destinations after approval: (1) UPI stored with AES-256-GCM encryption at rest via `src/server/security/encryption.ts` and saved through `saveCreatorBankDetails(preferredMethod="upi")`, and (2) bank account tokenized through Razorpay (`createCreatorRazorpayFundAccount`). Creator Settings payout section now offers both options; creator-facing UIs show masked UPI/token only. Discovery/apply gating and payout snapshot creation treat either encrypted UPI or Razorpay fund-account token as valid payout readiness.
- 2026-03-09: Simplified creator payout setup UX to UPI-first flow: `CreatorSettingsPage` now hosts `#payout-setup` with `validateCreatorRazorpayVpa` (Razorpay VPA validation + beneficiary name preview) and confirm-to-lock via `createCreatorRazorpayVpaFundAccount`; dashboard and payouts setup CTAs now redirect to `/creator/settings#payout-setup`, and payouts/settings no longer ask creators to enter raw fund-account token values manually.
- 2026-03-09: Implemented zero-friction ready-to-earn enforcement in `brandklip/app`: creators must have a tokenized payout destination before discovery/apply (`getCreatorDropsDiscovery` + `creatorQuickApplyToDrop` in `src/application/ops.ts`), `CreatorDashboardPage` now surfaces a 66% -> 100% payout-setup CTA to `/creator/payouts`, creator-approval notifications now route to payout setup, and `runDailyPayoutReadinessJob` in `src/admin/operations.ts` now auto-processes due payouts via Razorpay (`queue_if_low_balance`) and marks paid/queued without manual admin clicks.
- 2026-03-09: Razorpay Node SDK in `brandklip/app` uses `client.customers` + `client.fundAccount` resource names (not `contacts` / `fund_accounts`); this naming is required for TypeScript build compatibility in payout-tokenization actions under `src/drop/operations.ts`.
- 2026-03-09: Extended creator payout security flow to **tokenize UPI as well** (no raw UPI persistence): added `createCreatorRazorpayVpaFundAccount` in `src/drop/operations.ts` to run Razorpay VPA validation and create a tokenized fund account ID, switched payout snapshots/execution to token-only in `src/application/ops.ts` + `src/admin/operations.ts`, updated creator payout/setup UIs (`CreatorPayoutsPage`, `CreatorSettingsPage`, `AdminPayoutsPage`) to use tokenized destination only, and added data-clearing migration `brandklip/app/migrations/20260309153000_clear_raw_upi_storage/migration.sql` to null legacy raw UPI values.
- 2026-03-09: Added payment-ready secure payout setup flow in `brandklip/app`: `createCreatorRazorpayFundAccount` action in `src/drop/operations.ts` now tokenizes bank details directly with Razorpay (creates contact + fund account) and persists only `razorpayFundAccountId` via existing `saveCreatorBankDetails`; `/creator/payouts` (`src/client/CreatorPayoutsPage.tsx`) now surfaces a conditional **Launch Secure Razorpay Setup** CTA when payouts are pending but no payout destination exists.
- 2026-03-09: **Creator bank-details security migration (urgent)** in `brandklip/app`: removed bank-detail collection from creator onboarding UI + backend schema validation (`CreatorOnboardingPage`, `src/onboarding/operations.ts`), switched payout destination storage to tokenized form (`CreatorBankDetails.razorpayFundAccountId`, `CreatorPayout.payoutRazorpayFundAccountId`), removed raw bank columns from active Prisma schema (`User`, `CreatorProfile`, `CreatorBankDetails`, `CreatorPayout`) with migration `brandklip/app/migrations/20260309130000_remove_creator_bank_storage/migration.sql`, and updated creator/admin payout UIs to display UPI/tokenized destination only.
- 2026-03-09: Updated persona marketing pages to be role-specific: `ForBrandsPage` now renders `DashboardFlowsSection` in `mode="brand"` and `PersonaBenefitsBento variant="brands"`; `ForCreatorsPage` now renders `DashboardFlowsSection` in `mode="creator"` and `PersonaBenefitsBento variant="creators"`. Removed `TabbedFeatures` from both persona pages and replaced the larger `BentoFeatures` block with a compact 1x3 benefits card layout for clearer conversion messaging.
- 2026-03-09: Added `DashboardFlowsSection` (`src/client/components/landing/DashboardFlowsSection.tsx`) to marketing landing flow (inserted in `BrandklipLandingPage` after `BarterBenefitsSection`) to visually explain product usage journeys for both personas: brand drop creation/review/verification and creator discovery/acceptance/submission.
- 2026-03-09: Standardized marketing "Get Started" CTAs to shader-based `LiquidMetalButton` and fixed overflow bug (previously oversized text) by adding responsive sizing (`sm|md|lg`) + dynamic width from label length in `src/client/components/ui/liquid-metal-button.tsx`. Applied across landing hero + CTA, navbar desktop CTA, `ForBrandsPage` hero CTA, `ForCreatorsPage` hero CTA, and conditional `Get Started*` CTAs in `TabbedFeatures`/`BentoFeatures`.
- 2026-03-09: Marketing hero CTA in `BrandklipLandingPage` now uses a local shader-based `LiquidMetalButton` (`src/client/components/ui/liquid-metal-button.tsx`, powered by `@paper-design/shaders`) for the primary "Get Started Today" action; removed the Bento header "Join the Waitlist" CTA by making the header button conditional in `src/client/components/landing/BentoFeatures.tsx`.
- 2026-03-09: Added a dedicated marketing trust section to `BrandklipLandingPage` via `src/client/components/landing/SecurityTrustSection.tsx`, including Razorpay trust messaging (`/razorpay-logo-darkbg.png`) and three trust pillars (secure checkout, escrow protection, audit trail) to strengthen conversion confidence.
- 2026-03-09: Fixed wallet-apply regression in Razorpay checkout path: `getBrandWallet` calls `reconcileLegacyUnpaidEscrowWalletDebits`, and that reconciliation was resetting `DropEscrow.walletAmountApplied` + `cashAmountRequired` for active modern escrows (partial wallet applied, not yet paid). Reconciliation now skips rows with no legacy debit transaction, preserving reduced `cashAmountRequired` so Razorpay order amount matches wallet-adjusted payable.
- 2026-03-08: Corrective update: brand `closeDropAndRefundWallet` keeps the 30-day minimum rule for non-deadline drops (no immediate close). Error copy is now clearer: action allowed only after minimum 30 days with remaining-day guidance, and client toast handling in `DropDetailPage` now reliably surfaces backend error messages.
- 2026-03-08: Fixed two brand drop-management regressions: (1) `BrandDashboardPage` drop cards no longer use title-click expansion to reveal the Created block (which conflicted with detail navigation); cards now navigate consistently to `/drop/:id` while showing Created metadata directly. (2) `closeDropAndRefundWallet` in `src/server/walletActions.ts` now allows immediate brand close without the 30-day non-deadline gate and explicitly rejects pending `profile_submitted` applications when a drop is closed.
- 2026-03-08: Updated Brand Applications pending experience: removed waitlist action from pending cards (approve/reject only), added creator engagement rate + major/minor niche + computed match rate display, and added backend pending sorting prioritizing exact niche matches first and then higher engagement rates (`getBrandCreatorQueue` + `BrandApplicationsPage`).
- 2026-03-08: Fixed app-wide left-aligned bottom/top sheet regression by centering shared `SheetContent` variants in `brandklip/app/src/client/components/ui/sheet.tsx` (`left-1/2`, `-translate-x-1/2`, `w-full`) so all sheet consumers inherit correct horizontal alignment.
- 2026-03-08: Fixed remaining left alignment on mobile creator-profile overlays by centering shared `DialogContent` and `DrawerContent` in `brandklip/app/src/client/components/ui/dialog.tsx` and `brandklip/app/src/client/components/ui/drawer.tsx` (the affected UI used Dialog, not Sheet).
- 2026-03-08: Added admin-editable creator metrics (followers + engagement) in creator review overview and enforced creator-side metric lock after admin override. Lock is derived from `AdminActivity` metadata (`admin_update_creator_profile`) and applied in both `getCreatorProfile` (UI state) and `updateCreatorSocialSettings` (server-side enforcement).
- 2026-03-08: Added engagement rate visibility + inline edit in admin creators section (`AdminCreatorsListPage` + `getAdminCreatorsList`) so admins can adjust engagement from the main creators view, not only review queue.
- 2026-03-08: Replaced temporary public-profile Instagram fallback with Instaloader-first backend integration for creator autofill. `fetchCreatorInstagramInsights` now runs local Python script `scripts/instaloader_profile_insights.py` (or remote service if configured) and supports session-backed operation via `INSTALOADER_USERNAME` / `INSTALOADER_SESSION_FILE`.
- 2026-03-08: Temporarily rolled back creator onboarding autofill to manual entry mode. `fetchCreatorInstagramInsights` now returns `manual_entry_only`, and the onboarding UI no longer shows the Instagram auto-fill button.
- 2026-03-08: Added workspace AI governance rule and linked enforcement instruction file `.github/instructions/project-context-first.instructions.md` so agents use `PROJECT_CONTEXT.md` as the first lookup before coding.
- 2026-03-06: Created initial full-workspace context map and deep `brandklip/app` architecture snapshot.
- 2026-03-06: Added operation counts, module hotspots, schema model list, API gateway route index, and background-worker job inventory.
- 2026-03-06: Added a known Wasp compile pitfall: stale `wasp/client/operations` imports after removing actions from `main.wasp` (example: `makeMeAdminByEmail`).
- 2026-03-06: Fixed Brand Applications license modal issues: modal content scroll containment and print CSS scope for reliable license print preview.
- 2026-03-06: Added Page Knowledge Base section with per-page route/file/operations/UI details for bug triage (`BrandApplicationsPage`, `RightsVaultPage`, `BrandWalletPage`, `BrandklipLandingPage`, `CreatorOnboardingPage`).
- 2026-03-06: Applied the same license modal scroll + print-safe pattern to `RightsVaultPage`.
- 2026-03-07: Kept license printing in-page (`window.print`) and fixed print output via stricter portal-targeted CSS in `Main.css`.
- 2026-03-07: Reworked in-page printing again to use `.license-print-shell` + `body.printing-license` in `BrandApplicationsPage` and `RightsVaultPage` to prevent empty print previews.
- 2026-03-07: Adjusted print shell to avoid duplicate-page output (removed forced viewport-sized print shell) and added BrandKlip branding in certificate print header.
- 2026-03-07: Added shared iOS in-app mobile back control in `Dashboard01Layout` with route-aware visibility and safe fallback navigation for standalone/PWA sessions.
- 2026-03-07: Relaxed mobile back visibility to mobile viewport (including browser mobile emulation) and allowed it on dashboard root routes for easier access/testing.
- 2026-03-07: Refined mobile back visibility again to hide on root tab routes and show only on deeper routes where back navigation is expected.
- 2026-03-07: Removed breadcrumb navigation strip from `DropDetailPage`; page now relies on shared layout-level mobile back behavior.
- 2026-03-07: Replaced `brandklip/app/public/logo-black.png` with `brandklip/brandklip assets/black logo.png` to apply the new BrandKlip black logo across existing `/logo-black.png` usages.
- 2026-03-07: Removed remaining dot-grid BrandKlip mark from shared UI (`BrandKlipLogo` and `Dashboard01Layout`) and replaced with image-based `/logo-black.png`.
- 2026-03-07: Increased `/logo-black.png` display sizes in `BrandKlipLogo` and `Dashboard01Layout` headers to better match the prior dot-logo visual prominence.
- 2026-03-07: Security hardening pass added bounded pagination/limits to high-cardinality queries (`getDropApplications`, `getBrandPendingApplications`, `getAdminCreatorQueue`, `getAdminWithdrawalQueue`), validated admin withdrawal status filters, and masked admin withdrawal destination fields (`destinationUpiId`, `destinationBankAccount`, `destinationIfsc`, `destinationName`) in queue responses to reduce sensitive data exposure by default.
- 2026-03-07: Extended query hardening in `src/application/ops.ts` by adding default capped pagination (`take/skip`) to additional list queries used by creator/brand/admin screens (`getCreatorApplications`, `getPendingCreatorApplications`, `getBrandCreatorQueue`, `getBrandDropsForFilter`, `getAdminVideoQueue`, `getContentLicenses`).
- 2026-03-08: **Onboarding and application enrichment pass**:
  - Fixed creator dashboard eligible-drop count mismatch by aligning `CreatorDashboardPage` to use `getCreatorDropsDiscovery` (same source as browse page)
  - Hardened creator onboarding validation in `src/onboarding/operations.ts`: enforces exactly 2 niches, required engagement rate, both sample videos, complete payment details (UPI or bank via `.superRefine()`)
  - Updated `CreatorOnboardingPage` UI to collect phone, exactly 2 niches (major+minor), engagement rate (with inBeat calculator link), both sample videos, and require profile photo
  - Embedded engagement rate in `whyBrandKlip` field during submission; added `splitCreatorNarrative()` helper in `src/application/ops.ts` to parse it back
  - Enriched `getCreatorPublicProfile` to select DOB, languages, platforms, niches and return parsed engagement rate separately
  - Expanded `BrandApplicationsPage` CreatorSamplesSheet to show complete onboarding profile (11 fields: Instagram, YouTube, followers, avg views, engagement rate, gender, DOB, location, platforms, niches, languages, about text)
  - Added "Abandoned" escrow tab in `AdminPayoutsPage` to isolate failed escrows from pending queue
  - Aligned `CreatorSettingsPage` niche max to 2 (matching onboarding constraints)
  - All changes validated via `wasp start` compilation (server running on port 3001)
- 2026-03-08: **Major documentation restructure for comprehensive AI reference**:
  - Added **Complete Route Map** section documenting all 56 routes organized by role (Public, Brand, Creator, Admin) with descriptions
  - Added **Feature Inventory** section mapping major features (onboarding, application lifecycle, escrow/payout, licensing, discovery, admin workflows) to implementation files and data flows
  - Added **Component Reference** section documenting layout components, shared UI, forms, and their usage across pages
  - Added **Operations Reference** section cataloging all query and action operations with descriptions and usage
  - Added **Data Flow Patterns** section showing how data moves through onboarding→review, application→payout, and escrow state machine
  - Added **Data Model Detail** section with comprehensive field-level documentation for all 23 Prisma models including what's stored where, relations, and security notes
  - Document now serves as single-source-of-truth for understanding entire project structure, routes, features, operations, and data model without code exploration
