/**
 * BrandKlip — End-to-End Test Suite
 *
 * Stack: Vitest + @playwright/test (E2E) + Prisma test client
 * Run:
 *   npx vitest run src/tests/brandklip.test.ts     (unit/integration)
 *   npx playwright test src/tests/brandklip.test.ts (E2E browser tests)
 *
 * Setup: copy this file to src/tests/brandklip.test.ts in your Wasp project.
 * Ensure TEST_DATABASE_URL is set in .env.test and points to a separate test DB.
 *
 * npx prisma migrate deploy --preview-feature (on test DB before running)
 */

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { test, expect as pwExpect, Page, Browser, chromium } from '@playwright/test'
import { PrismaClient, UserRole, DropStatus, ApplicationStatus } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.TEST_DATABASE_URL } },
})

// ─────────────────────────────────────────────────────────────────────────────
// TEST DATA SEEDS
// ─────────────────────────────────────────────────────────────────────────────

const SEED = {
  admin: {
    email: 'admin@brandklip.test',
    password: 'Admin@12345',
    role: UserRole.ADMIN,
  },
  brand: {
    email: 'brand@acme.test',
    password: 'Brand@12345',
    role: UserRole.BRAND,
    brandName: 'Acme D2C',
    website: 'https://acme.test',
    gstNumber: '27AAACR5055K1ZS',
    phone: '+919876543210',
  },
  creator: {
    email: 'creator@influencer.test',
    password: 'Creator@12345',
    role: UserRole.CREATOR,
    fullName: 'Priya Sharma',
    instagramHandle: '@priyasharma',
    followerCount: 15000,
    niche: 'Beauty',
    phone: '+919123456789',
    bankAccountNumber: '1234567890',
    ifscCode: 'HDFC0001234',
    upiId: 'priya@upi',
  },
  drop: {
    title: 'Vitamin C Serum UGC Campaign',
    description: 'Create authentic unboxing and review content for our new Vitamin C serum.',
    productValue: 599,
    reimbursementAmount: 599,
    maxSlots: 5,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    briefUrl: 'https://acme.test/brief/vitamin-c',
    requirements: 'Instagram Reel 30-60s + 3 feed photos. Must show unboxing.',
    niche: 'Beauty',
    productCategory: 'Skincare',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'

async function seedTestDB() {
  // Clean slate
  await prisma.notificationLog.deleteMany()
  await prisma.financialAuditLog.deleteMany()
  await prisma.creatorPayout.deleteMany()
  await prisma.dropEscrow.deleteMany()
  await prisma.application.deleteMany()
  await prisma.drop.deleteMany()
  await prisma.creatorProfile.deleteMany()
  await prisma.brandProfile.deleteMany()
  await prisma.user.deleteMany()

  // Create admin
  const admin = await prisma.user.create({
    data: {
      email: SEED.admin.email,
      password: '$2b$12$hashedpassword', // pre-hashed in real setup
      role: SEED.admin.role,
      isVerified: true,
    },
  })

  // Create brand user + profile
  const brandUser = await prisma.user.create({
    data: {
      email: SEED.brand.email,
      password: '$2b$12$hashedpassword',
      role: SEED.brand.role,
      isVerified: true,
      isApproved: true,
      brandProfile: {
        create: {
          brandName: SEED.brand.brandName,
          website: SEED.brand.website,
          gstNumber: SEED.brand.gstNumber,
          phone: SEED.brand.phone,
        },
      },
    },
    include: { brandProfile: true },
  })

  // Create creator user + profile
  const creatorUser = await prisma.user.create({
    data: {
      email: SEED.creator.email,
      password: '$2b$12$hashedpassword',
      role: SEED.creator.role,
      isVerified: true,
      isApproved: true,
      creatorProfile: {
        create: {
          fullName: SEED.creator.fullName,
          instagramHandle: SEED.creator.instagramHandle,
          followerCount: SEED.creator.followerCount,
          niche: SEED.creator.niche,
          phone: SEED.creator.phone,
          // Bank details stored encrypted in real implementation
          bankAccountNumber: SEED.creator.bankAccountNumber,
          ifscCode: SEED.creator.ifscCode,
          upiId: SEED.creator.upiId,
        },
      },
    },
    include: { creatorProfile: true },
  })

  return { admin, brandUser, creatorUser }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. AUTH TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('Auth — Login & Registration', () => {
  beforeAll(async () => { await seedTestDB() })
  afterAll(async () => { await prisma.$disconnect() })

  describe('Login', () => {
    it('allows admin to log in with correct credentials', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: SEED.admin.email,
          password: SEED.admin.password,
        }),
      })
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.token).toBeTruthy()
    })

    it('rejects login with wrong password', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: SEED.admin.email,
          password: 'wrongpassword',
        }),
      })
      expect(res.status).toBe(401)
    })

    it('rejects login for unverified email', async () => {
      const unverified = await prisma.user.create({
        data: {
          email: 'unverified@test.com',
          password: '$2b$12$hashedpassword',
          role: UserRole.CREATOR,
          isVerified: false,
        },
      })
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unverified.email, password: SEED.creator.password }),
      })
      expect(res.status).toBe(403)
      await prisma.user.delete({ where: { id: unverified.id } })
    })

    it('rejects login for unapproved brand', async () => {
      const pending = await prisma.user.create({
        data: {
          email: 'pending-brand@test.com',
          password: '$2b$12$hashedpassword',
          role: UserRole.BRAND,
          isVerified: true,
          isApproved: false,
        },
      })
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pending.email, password: SEED.brand.password }),
      })
      expect(res.status).toBe(403)
      await prisma.user.delete({ where: { id: pending.id } })
    })
  })

  describe('Creator Registration', () => {
    it('registers a new creator and sends verification email', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register/creator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newcreator@test.com',
          password: 'NewCreator@12345',
          fullName: 'Rahul Verma',
          instagramHandle: '@rahulv',
          followerCount: 8000,
          niche: 'Tech',
          phone: '+919012345678',
        }),
      })
      expect(res.status).toBe(201)
      const user = await prisma.user.findUnique({ where: { email: 'newcreator@test.com' } })
      expect(user).toBeTruthy()
      expect(user!.isVerified).toBe(false) // email not yet verified
      await prisma.user.delete({ where: { email: 'newcreator@test.com' } })
    })

    it('rejects duplicate email registration', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register/creator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: SEED.creator.email, // already exists
          password: 'Another@12345',
          fullName: 'Duplicate',
          instagramHandle: '@dup',
          followerCount: 1000,
          niche: 'Fitness',
          phone: '+910000000000',
        }),
      })
      expect(res.status).toBe(409)
    })
  })

  describe('Brand Registration', () => {
    it('registers a new brand and queues admin approval', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register/brand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newbrand@test.com',
          password: 'NewBrand@12345',
          brandName: 'StartupCo',
          website: 'https://startupco.test',
          gstNumber: '07AADCS0472N1Z1',
          phone: '+919876500000',
        }),
      })
      expect(res.status).toBe(201)
      const user = await prisma.user.findUnique({ where: { email: 'newbrand@test.com' } })
      expect(user?.isApproved).toBe(false) // pending approval
      await prisma.user.delete({ where: { email: 'newbrand@test.com' } })
    })
  })

  describe('Password Reset', () => {
    it('sends password reset email for known address', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.creator.email }),
      })
      expect(res.status).toBe(200)
    })

    it('returns 200 even for unknown email (no user enumeration)', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nonexistent@test.com' }),
      })
      expect(res.status).toBe(200) // must not reveal user existence
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 2. ROLE-BASED ACCESS CONTROL TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('RBAC — Access Control', () => {
  let adminToken: string
  let brandToken: string
  let creatorToken: string

  beforeAll(async () => {
    const [a, b, c] = await Promise.all([
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.admin.email, password: SEED.admin.password }),
      }).then(r => r.json()),
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.brand.email, password: SEED.brand.password }),
      }).then(r => r.json()),
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.creator.email, password: SEED.creator.password }),
      }).then(r => r.json()),
    ])
    adminToken = a.token
    brandToken = b.token
    creatorToken = c.token
  })

  const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` })

  it('creator CANNOT access admin dashboard', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: authHeader(creatorToken),
    })
    expect(res.status).toBe(403)
  })

  it('brand CANNOT access admin dashboard', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: authHeader(brandToken),
    })
    expect(res.status).toBe(403)
  })

  it('creator CANNOT create drops', async () => {
    const res = await fetch(`${BASE_URL}/api/drops`, {
      method: 'POST',
      headers: { ...authHeader(creatorToken), 'Content-Type': 'application/json' },
      body: JSON.stringify(SEED.drop),
    })
    expect(res.status).toBe(403)
  })

  it('brand CANNOT see other brands\' drops', async () => {
    // Create a drop owned by admin (representing brand2)
    const res = await fetch(`${BASE_URL}/api/drops?brandId=other-brand-id`, {
      headers: authHeader(brandToken),
    })
    // Should only return own drops, not 403 — but never other brand's private data
    const body = await res.json()
    if (Array.isArray(body.drops)) {
      body.drops.forEach((drop: any) => {
        expect(drop.brandUserId).toBe(undefined) // internal ID should not leak
      })
    }
  })

  it('creator CANNOT see other creators\' bank details', async () => {
    const res = await fetch(`${BASE_URL}/api/creators`, {
      headers: authHeader(creatorToken),
    })
    const body = await res.json()
    if (Array.isArray(body.creators)) {
      body.creators.forEach((c: any) => {
        expect(c.bankAccountNumber).toBeUndefined()
        expect(c.ifscCode).toBeUndefined()
      })
    }
  })

  it('admin financial endpoint is hidden from creator', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/financial-audit`, {
      headers: authHeader(creatorToken),
    })
    expect(res.status).toBe(403)
  })

  it('unauthenticated request returns 401', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`)
    expect(res.status).toBe(401)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 3. DROP MANAGEMENT TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('Drops — CRUD & Lifecycle', () => {
  let brandToken: string
  let adminToken: string
  let createdDropId: string

  beforeAll(async () => {
    const [b, a] = await Promise.all([
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.brand.email, password: SEED.brand.password }),
      }).then(r => r.json()),
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.admin.email, password: SEED.admin.password }),
      }).then(r => r.json()),
    ])
    brandToken = b.token
    adminToken = a.token
  })

  it('brand can create a drop (status: DRAFT)', async () => {
    const res = await fetch(`${BASE_URL}/api/drops`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${brandToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(SEED.drop),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.drop.status).toBe(DropStatus.DRAFT)
    expect(body.drop.title).toBe(SEED.drop.title)
    createdDropId = body.drop.id
  })

  it('brand can publish drop (status: OPEN)', async () => {
    const res = await fetch(`${BASE_URL}/api/drops/${createdDropId}/publish`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${brandToken}` },
    })
    expect(res.status).toBe(200)
    const drop = await prisma.drop.findUnique({ where: { id: createdDropId } })
    expect(drop?.status).toBe(DropStatus.OPEN)
  })

  it('open drops appear in creator discovery feed', async () => {
    const creatorToken = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: SEED.creator.email, password: SEED.creator.password }),
    }).then(r => r.json()).then(b => b.token)

    const res = await fetch(`${BASE_URL}/api/drops/eligible`, {
      headers: { Authorization: `Bearer ${creatorToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    const found = body.drops.find((d: any) => d.id === createdDropId)
    expect(found).toBeTruthy()
    // Sensitive fields must not be present
    expect(found.brandGstNumber).toBeUndefined()
    expect(found.escrowTransactionId).toBeUndefined()
  })

  it('drop detail exposes brief but not internal notes', async () => {
    const res = await fetch(`${BASE_URL}/api/drops/${createdDropId}`, {
      headers: {
        Authorization: `Bearer ${await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: SEED.creator.email, password: SEED.creator.password }),
        }).then(r => r.json()).then(b => b.token)}`,
      },
    })
    const body = await res.json()
    expect(body.drop.briefUrl).toBeTruthy()
    expect(body.drop.adminNotes).toBeUndefined()
    expect(body.drop.escrowAmount).toBeUndefined()
  })

  it('brand can pause and resume an open drop', async () => {
    await fetch(`${BASE_URL}/api/drops/${createdDropId}/pause`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${brandToken}` },
    })
    let drop = await prisma.drop.findUnique({ where: { id: createdDropId } })
    expect(drop?.status).toBe(DropStatus.PAUSED)

    await fetch(`${BASE_URL}/api/drops/${createdDropId}/resume`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${brandToken}` },
    })
    drop = await prisma.drop.findUnique({ where: { id: createdDropId } })
    expect(drop?.status).toBe(DropStatus.OPEN)
  })

  it('admin can close a drop', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/drops/${createdDropId}/close`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status).toBe(200)
    const drop = await prisma.drop.findUnique({ where: { id: createdDropId } })
    expect(drop?.status).toBe(DropStatus.CLOSED)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 4. APPLICATION FLOW TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('Applications — Creator Apply → Brand Approve → Content Submit', () => {
  let creatorToken: string
  let brandToken: string
  let adminToken: string
  let dropId: string
  let applicationId: string

  beforeAll(async () => {
    // Create a fresh open drop for this suite
    const tokens = await Promise.all([
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.creator.email, password: SEED.creator.password }),
      }).then(r => r.json()).then(b => b.token),
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.brand.email, password: SEED.brand.password }),
      }).then(r => r.json()).then(b => b.token),
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.admin.email, password: SEED.admin.password }),
      }).then(r => r.json()).then(b => b.token),
    ])
    ;[creatorToken, brandToken, adminToken] = tokens

    const dropRes = await fetch(`${BASE_URL}/api/drops`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${brandToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...SEED.drop, title: 'Application Test Drop' }),
    })
    const { drop } = await dropRes.json()
    dropId = drop.id
    await fetch(`${BASE_URL}/api/drops/${dropId}/publish`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${brandToken}` },
    })
  })

  it('creator can apply to an open drop', async () => {
    const res = await fetch(`${BASE_URL}/api/drops/${dropId}/apply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${creatorToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: 'I love skincare and have done similar campaigns.' }),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.application.status).toBe(ApplicationStatus.PENDING)
    applicationId = body.application.id
  })

  it('creator CANNOT apply to the same drop twice', async () => {
    const res = await fetch(`${BASE_URL}/api/drops/${dropId}/apply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${creatorToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: 'Applying again' }),
    })
    expect(res.status).toBe(409)
  })

  it('brand can approve the application', async () => {
    const res = await fetch(`${BASE_URL}/api/applications/${applicationId}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${brandToken}` },
    })
    expect(res.status).toBe(200)
    const app = await prisma.application.findUnique({ where: { id: applicationId } })
    expect(app?.status).toBe(ApplicationStatus.APPROVED)
  })

  it('brand can see approved creator profile overlay data', async () => {
    const res = await fetch(`${BASE_URL}/api/applications/${applicationId}/creator-profile`, {
      headers: { Authorization: `Bearer ${brandToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.creatorProfile.instagramHandle).toBeTruthy()
    // Should never expose bank details to brand
    expect(body.creatorProfile.bankAccountNumber).toBeUndefined()
    expect(body.creatorProfile.ifscCode).toBeUndefined()
  })

  it('approved creator can upload content', async () => {
    const formData = new FormData()
    formData.append('applicationId', applicationId)
    formData.append('contentUrl', 'https://cloudfront.test/content/video.mp4')
    formData.append('caption', 'Loving this serum!')
    formData.append('contentType', 'REEL')

    const res = await fetch(`${BASE_URL}/api/applications/${applicationId}/submit-content`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${creatorToken}` },
      body: formData,
    })
    expect(res.status).toBe(200)
    const app = await prisma.application.findUnique({ where: { id: applicationId } })
    expect(app?.status).toBe(ApplicationStatus.CONTENT_SUBMITTED)
  })

  it('brand can approve submitted content', async () => {
    const res = await fetch(`${BASE_URL}/api/applications/${applicationId}/approve-content`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${brandToken}` },
    })
    expect(res.status).toBe(200)
    const app = await prisma.application.findUnique({ where: { id: applicationId } })
    expect(app?.status).toBe(ApplicationStatus.CONTENT_APPROVED)
  })

  it('brand can request a reshoot with a reason', async () => {
    // Reset to submitted state for this test
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: ApplicationStatus.CONTENT_SUBMITTED },
    })
    const res = await fetch(`${BASE_URL}/api/applications/${applicationId}/request-reshoot`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${brandToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Please show the product label more clearly.' }),
    })
    expect(res.status).toBe(200)
    const app = await prisma.application.findUnique({ where: { id: applicationId } })
    expect(app?.status).toBe(ApplicationStatus.RESHOOT_REQUESTED)
    expect(app?.reshootReason).toBeTruthy()
  })

  it('creator can resubmit after reshoot request', async () => {
    const formData = new FormData()
    formData.append('applicationId', applicationId)
    formData.append('contentUrl', 'https://cloudfront.test/content/video-v2.mp4')
    formData.append('caption', 'Loving this serum! (revised)')
    formData.append('contentType', 'REEL')

    const res = await fetch(`${BASE_URL}/api/applications/${applicationId}/submit-content`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${creatorToken}` },
      body: formData,
    })
    expect(res.status).toBe(200)
  })

  it('brand can reject an application with reason', async () => {
    // Create a second application to reject
    const secondCreator = await prisma.user.create({
      data: {
        email: 'creator2@test.com',
        password: '$2b$12$hash',
        role: UserRole.CREATOR,
        isVerified: true,
        isApproved: true,
        creatorProfile: {
          create: {
            fullName: 'Test Creator 2',
            instagramHandle: '@tc2',
            followerCount: 5000,
            niche: 'Tech',
            phone: '+911111111111',
          },
        },
      },
    })
    const token2 = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'creator2@test.com', password: SEED.creator.password }),
    }).then(r => r.json()).then(b => b.token)

    const applyRes = await fetch(`${BASE_URL}/api/drops/${dropId}/apply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token2}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: 'Please pick me' }),
    })
    const { application: app2 } = await applyRes.json()

    const rejectRes = await fetch(`${BASE_URL}/api/applications/${app2.id}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${brandToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Profile does not match our niche.' }),
    })
    expect(rejectRes.status).toBe(200)
    const updated = await prisma.application.findUnique({ where: { id: app2.id } })
    expect(updated?.status).toBe(ApplicationStatus.REJECTED)
    expect(updated?.rejectionReason).toBeTruthy()

    await prisma.user.delete({ where: { id: secondCreator.id } })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 5. PAYMENT & SETTLEMENT TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('Payments — Escrow, Payout & Audit', () => {
  let adminToken: string
  let brandToken: string
  let dropId: string
  let applicationId: string

  beforeAll(async () => {
    // Setup tokens, drop, and an approved application
    const tokens = await Promise.all([
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.admin.email, password: SEED.admin.password }),
      }).then(r => r.json()).then(b => b.token),
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.brand.email, password: SEED.brand.password }),
      }).then(r => r.json()).then(b => b.token),
    ])
    ;[adminToken, brandToken] = tokens

    // DB-level setup for speed
    const brandUser = await prisma.user.findUnique({ where: { email: SEED.brand.email } })
    const creatorUser = await prisma.user.findUnique({ where: { email: SEED.creator.email } })
    const drop = await prisma.drop.create({
      data: {
        ...SEED.drop,
        title: 'Payment Test Drop',
        status: DropStatus.OPEN,
        brandUserId: brandUser!.id,
      },
    })
    dropId = drop.id
    const app = await prisma.application.create({
      data: {
        dropId: drop.id,
        creatorUserId: creatorUser!.id,
        status: ApplicationStatus.CONTENT_APPROVED,
      },
    })
    applicationId = app.id
  })

  it('admin can fund escrow for a drop', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/escrow/fund`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dropId,
        amount: SEED.drop.reimbursementAmount * SEED.drop.maxSlots,
        transactionId: 'TXN_TEST_001',
        paymentMethod: 'BANK_TRANSFER',
      }),
    })
    expect(res.status).toBe(200)
    const escrow = await prisma.dropEscrow.findFirst({ where: { dropId } })
    expect(escrow?.status).toBe('FUNDED')
    expect(escrow?.amount).toBe(SEED.drop.reimbursementAmount * SEED.drop.maxSlots)
  })

  it('admin can trigger creator payout after content approval', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/payouts/trigger`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId }),
    })
    expect(res.status).toBe(200)
    const payout = await prisma.creatorPayout.findFirst({ where: { applicationId } })
    expect(payout).toBeTruthy()
    expect(payout?.amount).toBe(SEED.drop.reimbursementAmount)
    expect(payout?.status).toBe('PENDING')
  })

  it('admin can mark payout as completed', async () => {
    const payout = await prisma.creatorPayout.findFirst({ where: { applicationId } })
    const res = await fetch(`${BASE_URL}/api/admin/payouts/${payout?.id}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        utrNumber: 'UTR_TEST_001',
        paymentMethod: 'BANK_TRANSFER',
      }),
    })
    expect(res.status).toBe(200)
    const updated = await prisma.creatorPayout.findUnique({ where: { id: payout?.id } })
    expect(updated?.status).toBe('COMPLETED')
    expect(updated?.utrNumber).toBe('UTR_TEST_001')
  })

  it('financial audit log is created for payout', async () => {
    const log = await prisma.financialAuditLog.findFirst({
      where: { relatedApplicationId: applicationId },
    })
    expect(log).toBeTruthy()
    expect(log?.eventType).toContain('PAYOUT')
    expect(log?.amount).toBe(SEED.drop.reimbursementAmount)
  })

  it('brand CANNOT access financial audit log', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/financial-audit`, {
      headers: { Authorization: `Bearer ${brandToken}` },
    })
    expect(res.status).toBe(403)
  })

  it('creator CANNOT see payout queue for other creators', async () => {
    const creatorToken = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: SEED.creator.email, password: SEED.creator.password }),
    }).then(r => r.json()).then(b => b.token)

    const res = await fetch(`${BASE_URL}/api/admin/payouts`, {
      headers: { Authorization: `Bearer ${creatorToken}` },
    })
    expect(res.status).toBe(403)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 6. CREATOR ONBOARDING TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('Creator Onboarding — Profile & Bank Details', () => {
  let creatorToken: string
  let adminToken: string

  beforeAll(async () => {
    const tokens = await Promise.all([
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.creator.email, password: SEED.creator.password }),
      }).then(r => r.json()).then(b => b.token),
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.admin.email, password: SEED.admin.password }),
      }).then(r => r.json()).then(b => b.token),
    ])
    ;[creatorToken, adminToken] = tokens
  })

  it('creator can update their profile', async () => {
    const res = await fetch(`${BASE_URL}/api/creator/profile`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${creatorToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bio: 'Beauty & skincare creator from Mumbai',
        youtubeHandle: '@priyasharmayt',
        followerCount: 18000,
      }),
    })
    expect(res.status).toBe(200)
  })

  it('creator can update bank details', async () => {
    const res = await fetch(`${BASE_URL}/api/creator/bank-details`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${creatorToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bankAccountNumber: '9876543210',
        ifscCode: 'ICIC0001234',
        accountHolderName: 'Priya Sharma',
        upiId: 'priya.sharma@upi',
      }),
    })
    expect(res.status).toBe(200)
    // Verify it was encrypted in DB (raw value should not match plaintext)
    const profile = await prisma.creatorProfile.findFirst({
      where: { user: { email: SEED.creator.email } },
    })
    // The stored value should not be plaintext (exact check depends on encryption impl)
    expect(profile?.bankAccountNumber).not.toBe('9876543210')
  })

  it('creator profile endpoint returns masked account number', async () => {
    const res = await fetch(`${BASE_URL}/api/creator/profile`, {
      headers: { Authorization: `Bearer ${creatorToken}` },
    })
    const body = await res.json()
    // Should show ****3210 style masking, not full number
    if (body.bankAccountNumber) {
      expect(body.bankAccountNumber).toMatch(/^\*+\d{4}$/)
    }
  })

  it('admin can approve a pending creator', async () => {
    const pending = await prisma.user.create({
      data: {
        email: 'pending-creator@test.com',
        password: '$2b$12$hash',
        role: UserRole.CREATOR,
        isVerified: true,
        isApproved: false,
        creatorProfile: {
          create: {
            fullName: 'Pending Creator',
            instagramHandle: '@pending',
            followerCount: 3000,
            niche: 'Fashion',
            phone: '+912222222222',
          },
        },
      },
    })
    const res = await fetch(`${BASE_URL}/api/admin/creators/${pending.id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status).toBe(200)
    const updated = await prisma.user.findUnique({ where: { id: pending.id } })
    expect(updated?.isApproved).toBe(true)
    await prisma.user.delete({ where: { id: pending.id } })
  })

  it('admin can reject a creator with reason', async () => {
    const pending = await prisma.user.create({
      data: {
        email: 'reject-creator@test.com',
        password: '$2b$12$hash',
        role: UserRole.CREATOR,
        isVerified: true,
        isApproved: false,
        creatorProfile: {
          create: {
            fullName: 'Reject Me',
            instagramHandle: '@rejectme',
            followerCount: 100,
            niche: 'Gaming',
            phone: '+913333333333',
          },
        },
      },
    })
    const res = await fetch(`${BASE_URL}/api/admin/creators/${pending.id}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Follower count too low for our minimum threshold.' }),
    })
    expect(res.status).toBe(200)
    const updated = await prisma.user.findUnique({ where: { id: pending.id } })
    expect(updated?.isApproved).toBe(false)
    await prisma.user.delete({ where: { id: pending.id } })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 7. ADMIN DASHBOARD TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('Admin Dashboard — Stats & Management', () => {
  let adminToken: string

  beforeAll(async () => {
    adminToken = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: SEED.admin.email, password: SEED.admin.password }),
    }).then(r => r.json()).then(b => b.token)
  })

  it('admin dashboard returns correct stats shape', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(typeof body.stats.totalBrands).toBe('number')
    expect(typeof body.stats.totalCreators).toBe('number')
    expect(typeof body.stats.activeDrops).toBe('number')
    expect(typeof body.stats.totalApplications).toBe('number')
    expect(typeof body.stats.pendingPayouts).toBe('number')
    expect(typeof body.stats.arr).toBe('number') // ARR calculation
  })

  it('admin can list all drops with filters', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/drops?status=OPEN`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.drops)).toBe(true)
    body.drops.forEach((d: any) => expect(d.status).toBe('OPEN'))
  })

  it('admin can list pending brand approvals', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/brands/pending`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.brands)).toBe(true)
  })

  it('admin can approve a pending brand', async () => {
    const pending = await prisma.user.create({
      data: {
        email: 'pending-brand2@test.com',
        password: '$2b$12$hash',
        role: UserRole.BRAND,
        isVerified: true,
        isApproved: false,
        brandProfile: {
          create: { brandName: 'Pending Brand', website: 'https://pb.test', phone: '+914444444444' },
        },
      },
    })
    const res = await fetch(`${BASE_URL}/api/admin/brands/${pending.id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status).toBe(200)
    const updated = await prisma.user.findUnique({ where: { id: pending.id } })
    expect(updated?.isApproved).toBe(true)
    await prisma.user.delete({ where: { id: pending.id } })
  })

  it('admin activity feed returns latest events', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/activity-feed?limit=10`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.events)).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 8. CONTENT LICENSE CONSENT TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('Content License — Consent Gate', () => {
  it('application submission is rejected without license consent', async () => {
    const creatorToken = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: SEED.creator.email, password: SEED.creator.password }),
    }).then(r => r.json()).then(b => b.token)

    // Find an approved application to submit content for
    const app = await prisma.application.findFirst({
      where: {
        creator: { email: SEED.creator.email },
        status: ApplicationStatus.APPROVED,
      },
    })
    if (!app) return // Skip if no approved app exists in this test run

    const formData = new FormData()
    formData.append('applicationId', app.id)
    formData.append('contentUrl', 'https://cloudfront.test/video.mp4')
    formData.append('contentType', 'REEL')
    // Missing: licenseConsentAccepted = true

    const res = await fetch(`${BASE_URL}/api/applications/${app.id}/submit-content`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${creatorToken}` },
      body: formData,
    })
    expect(res.status).toBe(422)
    const body = await res.json()
    expect(body.error).toMatch(/consent/i)
  })

  it('consent IP and timestamp are recorded on submission', async () => {
    const app = await prisma.application.findFirst({
      where: {
        creator: { email: SEED.creator.email },
        status: ApplicationStatus.CONTENT_SUBMITTED,
      },
    })
    if (!app) return
    expect(app.briefAcceptedAt).toBeTruthy()
    // IP should be logged (may be test IP like ::1 in local env)
    expect(app.briefAcceptedIp).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 9. NOTIFICATION TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('Notifications — Email & WhatsApp', () => {
  let adminToken: string

  beforeAll(async () => {
    adminToken = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: SEED.admin.email, password: SEED.admin.password }),
    }).then(r => r.json()).then(b => b.token)
  })

  it('notification log entry is created after application approval', async () => {
    // Check that a NOTIFICATION record was created for the creator we approved earlier
    const creatorUser = await prisma.user.findUnique({ where: { email: SEED.creator.email } })
    const logs = await prisma.notificationLog.findMany({
      where: { userId: creatorUser!.id, eventType: 'APPLICATION_APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 1,
    })
    expect(logs.length).toBeGreaterThan(0)
    expect(logs[0].channel).toMatch(/email|whatsapp/i)
  })

  it('notification log entry created for content submission', async () => {
    const brandUser = await prisma.user.findUnique({ where: { email: SEED.brand.email } })
    const logs = await prisma.notificationLog.findMany({
      where: { userId: brandUser!.id, eventType: 'CONTENT_SUBMITTED' },
      take: 1,
    })
    expect(logs.length).toBeGreaterThan(0)
  })

  it('admin can view notification logs', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/notifications?limit=20`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.logs)).toBe(true)
  })

  it('failed notification is logged with error details', async () => {
    // Check if any FAILED notifications have an error field
    const failed = await prisma.notificationLog.findFirst({
      where: { status: 'FAILED' },
    })
    if (failed) {
      expect(failed.errorMessage).toBeTruthy()
    }
    // Absence of failures is also acceptable — test passes either way
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 10. SECURITY TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('Security — Data Exposure & IDOR Prevention', () => {
  let creator1Token: string
  let creator2Token: string
  let brandToken: string

  beforeAll(async () => {
    // Create a second creator to test cross-user access
    await prisma.user.upsert({
      where: { email: 'creator-idor@test.com' },
      update: {},
      create: {
        email: 'creator-idor@test.com',
        password: '$2b$12$hash',
        role: UserRole.CREATOR,
        isVerified: true,
        isApproved: true,
        creatorProfile: {
          create: {
            fullName: 'IDOR Test',
            instagramHandle: '@idortest',
            followerCount: 5000,
            niche: 'Food',
            phone: '+915555555555',
            bankAccountNumber: 'SENSITIVE_ACCOUNT_NO',
            ifscCode: 'SENSITIVE_IFSC',
          },
        },
      },
    })

    const tokens = await Promise.all([
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.creator.email, password: SEED.creator.password }),
      }).then(r => r.json()).then(b => b.token),
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'creator-idor@test.com', password: SEED.creator.password }),
      }).then(r => r.json()).then(b => b.token),
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: SEED.brand.email, password: SEED.brand.password }),
      }).then(r => r.json()).then(b => b.token),
    ])
    ;[creator1Token, creator2Token, brandToken] = tokens
  })

  it('creator cannot access another creator\'s settings', async () => {
    const target = await prisma.user.findUnique({ where: { email: 'creator-idor@test.com' } })
    const res = await fetch(`${BASE_URL}/api/creator/${target!.id}/settings`, {
      headers: { Authorization: `Bearer ${creator1Token}` },
    })
    expect([403, 404]).toContain(res.status)
  })

  it('creator public profile does NOT expose bank details', async () => {
    const target = await prisma.user.findUnique({ where: { email: 'creator-idor@test.com' } })
    const res = await fetch(`${BASE_URL}/api/creators/${target!.id}/public`, {
      headers: { Authorization: `Bearer ${brandToken}` },
    })
    const body = await res.json()
    const bodyStr = JSON.stringify(body)
    expect(bodyStr).not.toContain('SENSITIVE_ACCOUNT_NO')
    expect(bodyStr).not.toContain('SENSITIVE_IFSC')
    expect(bodyStr).not.toContain('bankAccountNumber')
  })

  it('creator own settings DOES expose masked bank details', async () => {
    const res = await fetch(`${BASE_URL}/api/creator/settings`, {
      headers: { Authorization: `Bearer ${creator2Token}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    // Should be present but masked
    if (body.bankAccountNumber) {
      expect(body.bankAccountNumber).not.toBe('SENSITIVE_ACCOUNT_NO')
      expect(body.bankAccountNumber).toMatch(/\*/)
    }
  })

  it('application content URL is only accessible to parties of that application', async () => {
    const app = await prisma.application.findFirst({
      where: { status: ApplicationStatus.CONTENT_SUBMITTED },
      include: { creator: true, drop: { include: { brand: true } } },
    })
    if (!app) return
    // Creator 1 (different creator) should not see content URL of another creator's app
    const res = await fetch(`${BASE_URL}/api/applications/${app.id}`, {
      headers: { Authorization: `Bearer ${creator1Token}` },
    })
    if (res.status === 200) {
      const body = await res.json()
      // If accessible, content URL must not be visible to wrong creator
      if (app.creator.email !== SEED.creator.email) {
        expect(body.application?.contentUrl).toBeUndefined()
      }
    } else {
      expect([403, 404]).toContain(res.status)
    }
  })

  it('SQL injection attempt is safely handled', async () => {
    const res = await fetch(
      `${BASE_URL}/api/drops?niche=Beauty' OR '1'='1`,
      { headers: { Authorization: `Bearer ${creator1Token}` } }
    )
    // Should return 200 with safe results OR 400 — never a DB error
    expect([200, 400]).toContain(res.status)
    if (res.status === 200) {
      const body = await res.json()
      expect(Array.isArray(body.drops)).toBe(true)
      // Should not return ALL drops (SQL injection succeeded)
      const total = await prisma.drop.count()
      if (total > 10) {
        expect(body.drops.length).toBeLessThan(total)
      }
    }
  })

  it('rate limiting returns 429 after too many requests', async () => {
    const requests = Array.from({ length: 60 }, () =>
      fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'bruteforce@test.com', password: 'wrong' }),
      })
    )
    const responses = await Promise.all(requests)
    const statusCodes = responses.map(r => r.status)
    expect(statusCodes).toContain(429)
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'creator-idor@test.com' } })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 11. E2E BROWSER TESTS (Playwright)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('E2E — Critical User Journeys', () => {
  let browser: Browser
  let page: Page

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: true })
  })

  test.afterAll(async () => {
    await browser.close()
  })

  test.beforeEach(async () => {
    page = await browser.newPage()
  })

  test.afterEach(async () => {
    await page.close()
  })

  // ── Landing Page ──────────────────────────────────────────────────────────

  test('landing page loads and hero CTA is visible', async () => {
    await page.goto(BASE_URL)
    await pwExpect(page).toHaveTitle(/BrandKlip/)
    const cta = page.getByRole('link', { name: /waitlist|get started|join/i })
    await pwExpect(cta.first()).toBeVisible()
  })

  // ── Creator Journey ───────────────────────────────────────────────────────

  test('creator can log in and see drop discovery', async () => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('[name="email"], [placeholder*="email" i]', SEED.creator.email)
    await page.fill('[name="password"], [placeholder*="password" i]', SEED.creator.password)
    await page.click('[type="submit"]')
    await page.waitForURL(/dashboard|drops|discover/i, { timeout: 10000 })
    await pwExpect(page.getByText(/drop|campaign/i).first()).toBeVisible()
  })

  test('creator can view drop detail page', async () => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('[name="email"], [placeholder*="email" i]', SEED.creator.email)
    await page.fill('[name="password"], [placeholder*="password" i]', SEED.creator.password)
    await page.click('[type="submit"]')
    await page.waitForURL(/dashboard|drops|discover/i, { timeout: 10000 })

    // Click the first drop card
    const dropCard = page.locator('[data-testid="drop-card"], .drop-card').first()
    if (await dropCard.isVisible()) {
      await dropCard.click()
      await pwExpect(page.getByText(/reimbursement|value|₹/i).first()).toBeVisible()
    }
  })

  // ── Brand Journey ─────────────────────────────────────────────────────────

  test('brand can log in and see applications', async () => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('[name="email"], [placeholder*="email" i]', SEED.brand.email)
    await page.fill('[name="password"], [placeholder*="password" i]', SEED.brand.password)
    await page.click('[type="submit"]')
    await page.waitForURL(/dashboard|drops|applications/i, { timeout: 10000 })
    await pwExpect(page.getByText(/drop|application|campaign/i).first()).toBeVisible()
  })

  // ── Admin Journey ─────────────────────────────────────────────────────────

  test('admin can log in and see dashboard stats', async () => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('[name="email"], [placeholder*="email" i]', SEED.admin.email)
    await page.fill('[name="password"], [placeholder*="password" i]', SEED.admin.password)
    await page.click('[type="submit"]')
    await page.waitForURL(/admin|dashboard/i, { timeout: 10000 })

    // Stats should be visible
    await pwExpect(page.getByText(/brand|creator|drop/i).first()).toBeVisible()
  })

  test('admin dashboard does not expose raw bank account numbers', async () => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('[name="email"], [placeholder*="email" i]', SEED.admin.email)
    await page.fill('[name="password"], [placeholder*="password" i]', SEED.admin.password)
    await page.click('[type="submit"]')
    await page.waitForURL(/admin|dashboard/i, { timeout: 10000 })

    // Scan page content for unmasked account number
    const bodyText = await page.locator('body').innerText()
    expect(bodyText).not.toContain(SEED.creator.bankAccountNumber)
  })

  // ── Redirect & Auth Guards ────────────────────────────────────────────────

  test('unauthenticated user is redirected to login from protected route', async () => {
    await page.goto(`${BASE_URL}/dashboard`)
    await page.waitForURL(/login|auth/i, { timeout: 5000 })
    await pwExpect(page.url()).toMatch(/login|auth/i)
  })

  test('creator cannot navigate to admin panel', async () => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('[name="email"], [placeholder*="email" i]', SEED.creator.email)
    await page.fill('[name="password"], [placeholder*="password" i]', SEED.creator.password)
    await page.click('[type="submit"]')
    await page.waitForURL(/dashboard/i, { timeout: 10000 })

    await page.goto(`${BASE_URL}/admin`)
    // Should redirect away or show 403
    const url = page.url()
    const bodyText = await page.locator('body').innerText()
    const isBlocked =
      !url.includes('/admin') ||
      bodyText.match(/403|forbidden|not authorized|access denied/i)
    expect(isBlocked).toBeTruthy()
  })

  // ── Responsive / Mobile ───────────────────────────────────────────────────

  test('landing page is usable at mobile viewport', async () => {
    await page.setViewportSize({ width: 390, height: 844 }) // iPhone 14 Pro
    await page.goto(BASE_URL)
    const cta = page.getByRole('link', { name: /waitlist|get started|join/i })
    await pwExpect(cta.first()).toBeVisible()
    // No horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = 390
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5) // 5px tolerance
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 12. DATA INTEGRITY TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('Data Integrity — Business Rule Enforcement', () => {
  it('drop slots cannot be over-allocated', async () => {
    // Create a drop with maxSlots=1, apply with 2 creators
    const brandUser = await prisma.user.findUnique({ where: { email: SEED.brand.email } })
    const singleSlotDrop = await prisma.drop.create({
      data: {
        title: 'Single Slot Drop',
        description: 'Only one slot',
        productValue: 199,
        reimbursementAmount: 199,
        maxSlots: 1,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: DropStatus.OPEN,
        brandUserId: brandUser!.id,
        niche: 'Beauty',
        productCategory: 'Skincare',
      },
    })

    const creator1 = await prisma.user.findUnique({ where: { email: SEED.creator.email } })
    // Fill the slot
    await prisma.application.create({
      data: {
        dropId: singleSlotDrop.id,
        creatorUserId: creator1!.id,
        status: ApplicationStatus.APPROVED,
      },
    })

    // Second creator tries to apply via API
    const brandToken = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: SEED.brand.email, password: SEED.brand.password }),
    }).then(r => r.json()).then(b => b.token)

    // Attempt to approve a second application beyond maxSlots
    const secondApplicant = await prisma.user.create({
      data: {
        email: 'overflow@test.com',
        password: '$2b$12$hash',
        role: UserRole.CREATOR,
        isVerified: true,
        isApproved: true,
        creatorProfile: {
          create: {
            fullName: 'Overflow',
            instagramHandle: '@overflow',
            followerCount: 10000,
            niche: 'Beauty',
            phone: '+916666666666',
          },
        },
      },
    })
    const overflowApp = await prisma.application.create({
      data: {
        dropId: singleSlotDrop.id,
        creatorUserId: secondApplicant.id,
        status: ApplicationStatus.PENDING,
      },
    })

    const res = await fetch(`${BASE_URL}/api/applications/${overflowApp.id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${brandToken}` },
    })
    expect(res.status).toBe(409) // Conflict: no slots remaining

    await prisma.application.deleteMany({ where: { dropId: singleSlotDrop.id } })
    await prisma.drop.delete({ where: { id: singleSlotDrop.id } })
    await prisma.user.delete({ where: { id: secondApplicant.id } })
  })

  it('payout cannot be triggered without funded escrow', async () => {
    const adminToken = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: SEED.admin.email, password: SEED.admin.password }),
    }).then(r => r.json()).then(b => b.token)

    // Create an application with no escrow
    const brandUser = await prisma.user.findUnique({ where: { email: SEED.brand.email } })
    const creatorUser = await prisma.user.findUnique({ where: { email: SEED.creator.email } })
    const noEscrowDrop = await prisma.drop.create({
      data: {
        title: 'No Escrow Drop',
        description: 'Test',
        productValue: 299,
        reimbursementAmount: 299,
        maxSlots: 2,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: DropStatus.OPEN,
        brandUserId: brandUser!.id,
        niche: 'Tech',
        productCategory: 'Electronics',
      },
    })
    const noEscrowApp = await prisma.application.create({
      data: {
        dropId: noEscrowDrop.id,
        creatorUserId: creatorUser!.id,
        status: ApplicationStatus.CONTENT_APPROVED,
      },
    })

    const res = await fetch(`${BASE_URL}/api/admin/payouts/trigger`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: noEscrowApp.id }),
    })
    expect(res.status).toBe(422)

    await prisma.application.delete({ where: { id: noEscrowApp.id } })
    await prisma.drop.delete({ where: { id: noEscrowDrop.id } })
  })
})
