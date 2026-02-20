# Product-for-Content Micro-SaaS — Project Plan

## 1. Executive Summary

### Problem
Indian D2C brands struggle to generate high-converting video assets for ads and verified Amazon reviews. Agencies are costly, and influencer platforms are noisy and manual. Maintaining a 4.5+ Amazon rating is logistically challenging.

### Solution
A Micro-SaaS platform for "Product-for-Content" exchange: Brands provide products, vetted micro-influencers deliver video assets and verified reviews. The platform automates discovery, briefing, purchase verification, and reimbursement.

---

## 2. User Roles & Workflows

### 2.1 Brand (Customer)
- **Goal:** 20-50 high-quality videos/month, boost Amazon rankings.
- **Workflow:**
  1. Create a "Drop" (campaign) with product links/quantity.
  2. Select a video framework (e.g., 3-Second Hook).
  3. Review applicants by video style.
  4. Download assets from a central library.

### 2.2 Creator (Supply)
- **Goal:** Free premium products, build UGC portfolio.
- **Workflow:**
  1. Browse "Drop Feed" and apply.
  2. Buy product on Amazon (for verified purchase).
  3. Upload Order ID and 30-60s video.
  4. Receive reimbursement + fee via UPI.

---

## 3. Functional Requirements

### 3.1 Brand Dashboard
- **FR 1.1:** Campaign Builder (multi-step form: Amazon URL, USPs, instructions)
- **FR 1.2:** Template Library (dropdown of video structures)
- **FR 1.3:** Asset Vault (preview, tag, bulk-download videos)

### 3.2 Creator Web App (Mobile-First)
- **FR 2.1:** Milestone Tracker (stepped UI: Applied → Purchased → Uploaded → Approved → Paid)
- **FR 2.2:** Order Verification (Amazon Order ID input, screenshot upload)
- **FR 2.3:** Video Uploader (direct-to-Supabase, progress bars)

### 3.3 Automation Engine
- **FR 3.1:** Nudge Bot (WhatsApp/SMS reminders: T+2, T+5 days)
- **FR 3.2:** Payout Logic (RazorpayX UPI transfer after approval)

---

## 4. Edge Cases & Risk Mitigation
| Edge Case         | Impact                  | Mitigation Strategy                                                                 |
|-------------------|------------------------|-------------------------------------------------------------------------------------|
| The "Ghoster"     | Brand loses a unit     | Blacklist influencer, Trust Score restricts access to high-value drops              |
| Return Fraud      | Reimbursement loss     | Delay payout until 15 days post-purchase                                            |
| Poor Video Quality| Unusable asset         | "Request Revision"; after 2 fails, only reimburse product, no creator fee          |
| Amazon TOS Flag   | Account risk           | Enforce "Product Gifted"/"Paid Partnership" as per ASCI & Amazon India guidelines   |

---

## 5. Technical Stack (Lean Build)
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **Backend:** Supabase (Auth, PostgreSQL, Edge Functions)
- **Communication:** Interakt / Wati (WhatsApp API)
- **Payments:** RazorpayX (Payouts API)
- **Animations:** Lenis Scroll for premium UI
