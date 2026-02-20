# PRD: Creator Onboarding Module – "The Talent Filter"

## 1. Objective
To vet creators based on their communication skills (The Intro) and their proven performance (The Top Asset), ensuring brands only work with creators who can actually move the needle.

## 2. Functional Requirements

### 2.1 The "Elevator Pitch" (Introductory Video)
- **Requirement**: A 20-30 second video recorded directly in the app or uploaded.
- **Prompt for Creator**: "Tell us your name, your primary niche, and one brand you’d die to work with. Keep it high energy!"
- **What this vets**:
    - **Speaking Clarity**: Can they deliver a script without stumbling?
    - **Vibe Check**: Does their personality align with premium or "relatable" brands?
    - **Language Proficiency**: Identifying their comfort level with English, Hindi, or regional languages.

### 2.2 The "Algorithm Winner" (Top Performing Video)
- **Requirement**: Upload or link (Instagram/TikTok/YouTube) of their best-performing video.
- **Metadata Collection**: Creator must provide the View Count and Engagement Rate (estimated) for this video.
- **What this vets**:
    - **Hook Mastery**: Did they stop the scroll?
    - **Editing Quality**: Do they understand pacing, captions, and transitions?
    - **Social Proof**: Does their content actually resonate with a real audience?

### 2.3 Profile Metadata (The "Data Moat")
- **Niche Tags**: Select up to 2 (e.g., Skincare, Fintech, Pet-care).
- **Location**: Important for regional brand campaigns.
- **Device Info**: (e.g., iPhone 15, Sony ZV-1).

## 3. The User Flow (Creator Experience)

1. **Identity**: Signup via Google or Instagram Auth.
2. **The Intro (Screen 1)**:
    - UI shows a "Camera Viewfinder" style box.
    - Text Overlay: "Give us a 20s intro. Show us your personality!"
    - Action: Record or Upload.
3. **The Proof (Screen 2)**:
    - UI asks: "What’s your best work?"
    - Action: Link or File Upload.
    - Input: "Why did this video go viral?" (This helps brands see their strategic thinking).
4. **The "Waiting Room"**:
    - Message: "Our curators are reviewing your vibe. You’ll be notified on WhatsApp when your first Drop is ready."

## 4. Technical Validation Logic (For Next.js Backend)

| Field | Validation Requirement | Failure Trigger |
| :--- | :--- | :--- |
| **Intro Video** | Length: 15s - 45s | Reject if < 10s (too short to judge). |
| **Intro Video** | File Size: < 50MB | Alert user to compress to save Supabase storage costs. |
| **Top Video** | URL/File presence | Cannot proceed to "Waiting Room" without proof. |
| **Niche Selection** | Minimum 1 tag | Prevents "Generalist" profiles that brands hate. |

## 5. Edge Cases & Risks

- **The "Fake" Video**: A creator uploads a video that isn't theirs.
    - *Mitigation*: In the "Intro Video," they must state their name. If the voice/face doesn't match the "Top Performing Video," they are flagged for manual review.
- **Poor Lighting in Intro**:
    - *Mitigation*: Use a simple UI nudge: "We noticed your intro is a bit dark. Brands love bright, clear faces!"
- **Link Privacy**: Instagram links might be private.
    - *Mitigation*: Encourage File Uploads directly to your Supabase bucket to ensure brands can always view them.

## 6. Success Metrics for this Module

- **Onboarding Friction**: % of creators who start signup but don't finish the Intro Video (if this is >50%, we need to simplify).
- **Approval Rate**: % of applicants that you actually "Accept" (Lower is better for your MOAT).
- **Brand Satisfaction**: % of brands that "Favorite" a creator after seeing their Intro Video.
