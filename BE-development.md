# Backend Development Log: Product-for-Content Micro-SaaS

## 2026-03-03: Current Backend Baseline (Authoritative)

### Important Context
- The active implementation is now centered on **Wasp + Prisma + PostgreSQL**.
- Earlier sections in this document (Supabase-first exploration) are retained as historical planning notes.
- For current architecture and workflows, refer to:
  - `system-design.md` (current system view)
  - `brandklip/app/src/application/ops.ts` (business logic)
  - `brandklip/app/schema.prisma` + `brandklip/app/migrations/*` (data model + migrations)

### Implemented Backend Capabilities

1. **Application lifecycle enforcement**
  - Backend validates role + status before transitions.
  - Invalid transitions are blocked at operation level.

2. **Order proof governance**
  - Multi-attempt rejection/verification handling.
  - Server-side rejection reason validation.
  - Deadline-aware retry behavior integrated into state transitions.

3. **Video reshoot governance**
  - Three-attempt cap for reshoots.
  - Structured rejection reason + min feedback length enforcement.
  - Resubmit deadlines and final failure (`expired`) transitions.
  - Queue enrichment with attempt context.

4. **Operational reliability improvements**
  - Fixes for query/action runtime edge cases (scoping/delegate usage).
  - Better error surfacing for reject/confirm actions (no silent no-op UX).
  - Status-driven notification and admin activity updates.

5. **Schema evolution (recent)**
  - Added application-level fields for video policy tracking:
    - `videoRejectionReason`
    - `videoLastRejectedAt`
    - `videoResubmitDeadline`
    - `videoFailedAt`

### Next Backend Priorities
- Add integration tests for high-risk transitions (`rejectOrderDetails`, `adminRequestReshoot`, `submitVideoLink`).
- Introduce centralized policy constants module to reduce duplication.
- Add structured audit stream for approval/rejection events.

## 1. Initialization
- Date: 2026-02-19
- Context: Initiating backend development based on the finalized system design.
- Reference: See system-design.md for architecture, workflows, and recommendations.

---

## 2. Initial Backend Architecture Decisions

### 2.1 Stack Selection
- **Primary Backend:** Supabase (Postgres, Auth, Edge Functions)
- **API Gateway/BFF:** Fastify/Express.js (Node.js) or managed gateway (Kong, AWS API Gateway)
- **Background Processing:** Cloud Run, AWS Lambda, or Supabase Queue for async jobs
- **Messaging:** Interakt/Wati (WhatsApp API), fallback to SMS/Email
- **Payments:** RazorpayX
- **Storage:** Supabase Storage + CDN (Cloudflare, AWS CloudFront)
- **Monitoring:** Sentry, Prometheus, Grafana

### 2.2 Key Principles
- API-first, OpenAPI 3.1 documentation
- RESTful and GraphQL endpoints
- JWT-based authentication
- Rate limiting, abuse prevention, and observability
- Background jobs for heavy/async tasks

---

## 2026-02-19: Initial Database Schema Design

### Tables & Key Fields

#### users
- id (UUID, PK)
- email (unique)
- password_hash
- role (enum: brand, creator)
- profile (JSONB)
- trust_score (float, default 1.0)
- created_at, updated_at

#### drops
- id (UUID, PK)
- brand_id (FK: users.id)
- product_link (text)
- quantity (int)
- template_id (FK: templates.id)
- status (enum: draft, active, closed)
- created_at, updated_at

#### applications
- id (UUID, PK)
- drop_id (FK: drops.id)
- creator_id (FK: users.id)
- status (enum: applied, purchased, uploaded, approved, paid, rejected)
- order_id (text)
- order_screenshot (text/url)
- video_url (text/url)
- approval_status (enum: pending, approved, rejected)
- payout_status (enum: pending, paid, failed)
- created_at, updated_at

#### templates
- id (UUID, PK)
- name (text)
- structure (JSONB)
- description (text)
- created_at, updated_at

#### assets
- id (UUID, PK)
- application_id (FK: applications.id)
- video_url (text/url)
- tags (text[])
- quality_rating (float)
- created_at, updated_at

### Notes
- All tables use UUIDs for primary keys.
- Timestamps for auditability.
- Enum types for status fields for data integrity.
- JSONB for flexible profile/template structure.

---

## 2026-02-19: Supabase Project Setup & Table Configuration

### Steps
1. Create a new Supabase project at https://app.supabase.com/
2. Set up a new Postgres database instance.
3. Configure authentication (email/password, social logins as needed).
4. Create the following tables using SQL editor or Table Designer:

#### profiles
```sql
create table profiles (
  id uuid primary key references auth.users(id),
  email text unique not null,
  role text check (role in ('brand', 'creator')) not null,
  profile jsonb,
  trust_score float default 1.0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### drops
```sql
create table drops (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references profiles(id),
  product_link text not null,
  quantity int not null,
  template_id uuid references templates(id),
  status text check (status in ('draft', 'active', 'closed')) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### applications
```sql
create table applications (
  id uuid primary key default gen_random_uuid(),
  drop_id uuid references drops(id),
  creator_id uuid references profiles(id),
  status text check (status in ('applied', 'purchased', 'uploaded', 'approved', 'paid', 'rejected')) not null,
  order_id text,
  order_screenshot text,
  video_url text,
  approval_status text check (approval_status in ('pending', 'approved', 'rejected')) not null,
  payout_status text check (payout_status in ('pending', 'paid', 'failed')) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### templates
```sql
create table templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  structure jsonb,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### assets
```sql
create table assets (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id),
  video_url text,
  tags text[],
  quality_rating float,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

5. Set up Supabase Storage buckets for video assets and screenshots.
6. Configure Row Level Security (RLS) policies for all tables.
7. Enable JWT authentication and set up API keys for backend access.
8. Test table creation and basic CRUD via Supabase dashboard.

---

## 2026-02-19: Authentication & RBAC Implementation

### Steps
1. Use Supabase Auth for JWT-based authentication (email/password, social logins optional).
2. In Fastify, add a JWT verification hook for protected routes:
   ```js
   fastify.decorate('authenticate', async function(request, reply) {
     try {
       const authHeader = request.headers['authorization'];
       if (!authHeader) throw new Error('Missing token');
       const token = authHeader.split(' ')[1];
       const { data: user, error } = await supabase.auth.getUser(token);
       if (error || !user) throw new Error('Invalid token');
       request.user = user;
     } catch (err) {
       reply.code(401).send({ error: 'Unauthorized' });
     }
   });
   ```
3. Add role-based access control (RBAC) middleware:
   ```js
   function requireRole(role) {
     return async function(request, reply) {
       if (!request.user || request.user.role !== role) {
         return reply.code(403).send({ error: 'Forbidden' });
       }
     };
   }
   ```
4. Protect endpoints:
   ```js
   fastify.get('/brand/drops', { preHandler: [fastify.authenticate, requireRole('brand')] }, async (request, reply) => {
     // ...
   });
   fastify.get('/creator/applications', { preHandler: [fastify.authenticate, requireRole('creator')] }, async (request, reply) => {
     // ...
   });
   ```
5. Test authentication and RBAC for all endpoints.

---

## 2026-02-19: API Gateway/BFF Scaffolding (Fastify)

### Steps
1. Initialize a new Node.js project for the API Gateway/BFF:
   ```sh
   mkdir api-gateway && cd api-gateway
   npm init -y
   npm install fastify fastify-cors @supabase/supabase-js dotenv
   ```
2. Create a `.env` file for Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_service_role_key
   ```
3. Create `index.js` to bootstrap Fastify and connect to Supabase:
   ```js
   require('dotenv').config();
   const Fastify = require('fastify');
   const { createClient } = require('@supabase/supabase-js');

   const fastify = Fastify({ logger: true });
   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

   fastify.get('/health', async (request, reply) => {
     return { status: 'ok' };
   });

   // Example: List all drops
   fastify.get('/drops', async (request, reply) => {
     const { data, error } = await supabase.from('drops').select('*');
     if (error) return reply.code(500).send({ error });
     return { data };
   });

   fastify.listen({ port: 3000 }, (err, address) => {
     if (err) throw err;
     fastify.log.info(`server listening on ${address}`);
   });
   ```
4. Add CORS, error handling, and logging middleware as needed.
5. Test the API locally and verify connection to Supabase.

---

## 2026-02-19: Background Worker Infrastructure

### Steps
1. Choose a background job runner (Cloud Run, AWS Lambda, or Supabase Queue). For this log, we'll use Cloud Run (Node.js):
2. Create a new directory: `background-worker/`
3. Initialize Node.js project and install dependencies:
   ```sh
   mkdir background-worker && cd background-worker
   npm init -y
   npm install @supabase/supabase-js node-cron axios dotenv
   ```
4. Create `.env` for Supabase credentials and any API keys.
5. Example: `worker.js` for reminders and payouts:
   ```js
   require('dotenv').config();
   const { createClient } = require('@supabase/supabase-js');
   const cron = require('node-cron');
   const axios = require('axios');

   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

   // Nudge Bot: Reminders
   cron.schedule('0 8 * * *', async () => {
     // Query applications needing reminders
     // Send WhatsApp/SMS/email via Interakt/Wati or fallback
   });

   // Payout Logic
   cron.schedule('0 10 * * *', async () => {
     // Query approved applications past 15 days
     // Trigger payout via RazorpayX API
   });
   ```
6. Deploy worker to Cloud Run or similar serverless platform.
7. Set up monitoring and alerting for job failures.

---

## 2026-02-19: Monitoring & Logging Integration

### Steps
1. **API Gateway/BFF (Fastify):**
   - Install Sentry and Prometheus Fastify plugins:
     ```sh
     npm install @sentry/node prom-client
     ```
   - Add Sentry error tracking:
     ```js
     const Sentry = require('@sentry/node');
     Sentry.init({ dsn: process.env.SENTRY_DSN });
     fastify.addHook('onError', (request, reply, error, done) => {
       Sentry.captureException(error);
       done();
     });
     ```
   - Add Prometheus metrics endpoint:
     ```js
     const client = require('prom-client');
     const collectDefaultMetrics = client.collectDefaultMetrics;
     collectDefaultMetrics();
     fastify.get('/metrics', async (request, reply) => {
       reply.type('text/plain');
       return client.register.metrics();
     });
     ```
2. **Background Worker:**
   - Add Sentry and Prometheus as above.
   - Log job runs, errors, and results to Sentry and Prometheus.
3. **Grafana:**
   - Set up Grafana dashboards to visualize Prometheus metrics and Sentry errors.
4. **Logging:**
   - Use Fastify's built-in logger and aggregate logs with a service like Logtail, Datadog, or AWS CloudWatch.
5. **Alerting:**
   - Configure Sentry and Grafana alerts for error spikes, failed jobs, and performance anomalies.

---

## 2026-02-19: Endpoint & Workflow Documentation

### REST Endpoints (API Gateway/BFF)
- `GET /health` — Health check
- `GET /drops` — List all drops (public/brand)
- `POST /drops` — Create a new drop (brand)
- `GET /drops/:id` — Get drop details
- `PUT /drops/:id` — Update drop (brand)
- `DELETE /drops/:id` — Delete drop (brand)
- `GET /applications` — List applications (creator/brand)
- `POST /applications` — Apply to a drop (creator)
- `PUT /applications/:id` — Update application (creator/brand)
- `GET /templates` — List video templates
- `POST /templates` — Create template (brand)
- `GET /assets` — List assets (brand/creator)
- `POST /assets` — Upload asset (creator)
- `GET /metrics` — Prometheus metrics

### Auth & RBAC
- JWT-based auth for all protected endpoints
- Role-based access for brand/creator actions

### Background Worker Jobs
- Nudge Bot: Scheduled reminders for pending applications
- Payout Logic: Scheduled payouts for approved applications
- Video Processing: (future) Transcoding, moderation

### OpenAPI/GraphQL Docs
- OpenAPI 3.1 spec for all REST endpoints (to be generated)
- GraphQL schema for flexible asset/query needs (future)

### Workflow Summary
- Brand creates drop → Creator applies → Creator uploads order/video → Brand reviews/approves → Payout triggered → Reminders/automation as needed

---

*End-to-end backend foundation is now fully documented and scaffolded. Continue to update this file as features are implemented and endpoints evolve.*

---

## 3. Next Steps
- [ ] Set up Supabase project and configure Postgres, Auth, Storage
- [ ] Scaffold API Gateway/BFF (Fastify/Express.js)
- [ ] Implement authentication and role-based access control
- [ ] Set up background worker infrastructure
- [ ] Integrate monitoring and logging
- [ ] Document all endpoints and workflows

---

## 4. Change Log
- 2026-02-19: Backend development initiated, stack and architecture decisions logged.

---

*Continue to update this file with all backend development changes, decisions, and rationale for future reference.*
