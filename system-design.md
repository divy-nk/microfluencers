# System Design: Product-for-Content Micro-SaaS

## 1. Overview
A platform connecting D2C brands with vetted micro-influencers for product exchange, video asset creation, and verified Amazon reviews. The system automates campaign management, influencer onboarding, asset delivery, order verification, and payout workflows.

---

## 2. High-Level Architecture

```mermaid
graph TD
  A[Brand Dashboard (Web)] -- REST/GraphQL --> B[API Gateway / BFF Layer]
  C[Creator Web App (Mobile-First)] -- REST/GraphQL --> B
  B -- Auth, Data --> D[Supabase (Postgres, Auth, Edge Functions)]
  B -- Messaging --> E[WhatsApp API (Interakt/Wati)]
  B -- Payments --> F[RazorpayX API]
  D -- Storage --> G[Asset Vault (Supabase Storage + CDN)]
  B -- Jobs --> J[Background Worker (e.g., Cloud Run, AWS Lambda, Supabase Queue)]
  J -- Triggers --> H[Nudge Bot]
  J -- Triggers --> I[Payout Logic]
  B -- Monitoring --> K[Observability Stack (Sentry, Prometheus, Grafana)]
```

---

## 3. Core Components

### 3.1 Brand Dashboard
- Multi-step campaign builder
- Template library for video frameworks
- Asset vault for video management

### 3.2 Creator Web App
- Drop feed and application
- Order verification (Amazon Order ID, screenshot upload)
- Video uploader (Supabase direct upload)
- Milestone tracker (Applied → Purchased → Uploaded → Approved → Paid)

### 3.3 Automation Engine
- Nudge Bot: WhatsApp/SMS reminders (T+2, T+5 days), fallback to email/SMS if WhatsApp fails
- Payout Logic: Automated UPI transfer post-approval, handled by background jobs for reliability
- Background Worker: Handles reminders, payouts, video processing, fraud checks, and heavy/async tasks

---

## 4. Data Models (Simplified)

- **User**: id, role (brand/creator), profile, trust_score
- **Drop (Campaign)**: id, brand_id, product_link, quantity, template_id, status
- **Application**: id, drop_id, creator_id, status, order_id, order_screenshot, video_url, approval_status, payout_status
- **Template**: id, name, structure, description
- **Asset**: id, application_id, video_url, tags, quality_rating

---

## 5. API Design Principles
- RESTful endpoints for core CRUD
- GraphQL for flexible asset/query needs
- API Gateway/BFF for request shaping, rate limiting, analytics, and security
- JWT-based authentication (Supabase Auth)
- OpenAPI 3.1 documentation
- Pagination, filtering, and sorting for list endpoints
- Consistent error handling and status codes
- API versioning and deprecation strategy
- Abuse prevention (rate limiting, IP throttling)

---

## 6. Key Workflows

### 6.1 Brand Campaign Creation
1. Brand logs in, creates a Drop (product, quantity, instructions)
2. Selects video template
3. Publishes campaign to Drop Feed

### 6.2 Creator Application & Asset Delivery
1. Creator browses Drop Feed, applies
2. Purchases product on Amazon, uploads Order ID & screenshot
3. Uploads video asset
4. Brand reviews and approves/rejects
5. Upon approval, payout is triggered

### 6.3 Automation
- Nudge Bot sends reminders to creators at T+2, T+5 if milestones are not met
- Payout Logic delays reimbursement for 15 days post-purchase to prevent fraud

---

## 7. Edge Cases & Mitigations
- Ghoster: Blacklist, trust score reduction, automated reminders, escalation workflow
- Return Fraud: Delay payout, monitor order status, semi-automated verification (Amazon API/scraping), anomaly detection
- Poor Video Quality: Revision requests, fee withholding, content moderation (AI/manual), dispute resolution
- Amazon TOS: Compliance checks, disclosure enforcement, automated compliance checks

---

## 8. Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, Framer Motion
- **Backend:** Supabase (Postgres, Auth, Edge Functions), Background Worker (Cloud Run, AWS Lambda, or Supabase Queue)
- **API Gateway/BFF:** Fastify/Express.js or managed gateway (Kong, AWS API Gateway)
- **Messaging:** Interakt/Wati (WhatsApp API), fallback to SMS/Email
- **Payments:** RazorpayX
- **Storage:** Supabase Storage + CDN (Cloudflare, AWS CloudFront)
- **Monitoring:** Sentry, Prometheus, Grafana
- **Animations:** Lenis Scroll

---

## 9. Security & Compliance
- OAuth/JWT authentication
- Role-based access control
- Input validation, virus scanning, and AI-based content moderation for uploads
- Audit logs for sensitive actions
- Refresh token rotation, session invalidation, optional 2FA for brands
- Compliance with Amazon/ASCI guidelines

---

## 10. Scalability & Performance
- Supabase Edge Functions for serverless scaling
- CDN-backed asset delivery for videos and static assets
- Background jobs for heavy/async tasks (uploads, payouts, reminders)
- API Gateway/BFF for rate limiting, caching, and analytics
- Caching for Drop Feed and templates
- Horizontal scaling for web/app/API layers

---

## 11. Developer Experience
- OpenAPI/GraphQL schema docs
- Postman collections
- Mock server for API testing
- SDKs for integration
- API analytics and monitoring dashboards

---

## 12. Future Extensions
- Multi-brand support
- Advanced analytics dashboard
- AI-powered video quality scoring and content moderation
- Integration with other marketplaces
- Automated dispute resolution workflows
- Migration plan for custom backend if Supabase limits are reached

---

## 13. Recommendations & Future-Proofing

- **API Gateway/BFF:** Use a dedicated API gateway or BFF layer for advanced features (rate limiting, analytics, request shaping, security).
- **Background Processing:** Offload heavy/async tasks (reminders, payouts, video processing) to background workers (Cloud Run, AWS Lambda, or Supabase Queue).
- **Media Delivery:** Integrate a CDN for video delivery and plan for scalable storage/egress costs.
- **Monitoring & Observability:** Implement Sentry, Prometheus, and Grafana for error tracking, metrics, and dashboards.
- **Security:** Enforce refresh token rotation, session invalidation, and optional 2FA for brands. Use AI-based content moderation and virus scanning for uploads.
- **Fraud & Abuse:** Add semi-automated order verification and anomaly detection for fraud prevention.
- **Edge Cases:** Add escalation and dispute resolution workflows for brands/creators.
- **Migration Path:** Plan for migration to a custom backend if Supabase limits are reached.
