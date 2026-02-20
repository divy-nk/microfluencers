require('dotenv').config();
const Fastify = require('fastify');
const cors = require('fastify-cors');
const { createClient } = require('@supabase/supabase-js');

const fastify = Fastify({ logger: true });

// Register CORS — allow dashboard + marketing site
const ALLOWED_ORIGINS = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.DASHBOARD_URL || 'http://localhost:5173',
].filter(Boolean);

fastify.register(cors, {
    origin: (origin, cb) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            cb(null, true);
        } else {
            cb(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true
});

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    fastify.log.error('Supabase credentials missing in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// MIDDLEWARE
// ==========================================

// JWT Middleware — attaches user + profile to request
fastify.decorate('authenticate', async function (request, reply) {
    try {
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            return reply.code(401).send({ error: 'Missing authorization header' });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return reply.code(401).send({ error: 'Invalid or expired token' });
        }

        // Fetch user profile to get role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        request.user = user;
        request.userRole = profile?.role || null;
    } catch (err) {
        return reply.code(401).send({ error: 'Unauthorized' });
    }
});

// Role guard factory
function requireRole(role) {
    return async function (request, reply) {
        if (request.userRole !== role) {
            return reply.code(403).send({ error: `Forbidden: requires '${role}' role` });
        }
    };
}

// ==========================================
// HEALTH CHECK
// ==========================================
fastify.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});

// ==========================================
// DROPS ROUTES
// ==========================================

// List Drops (with optional campaign_type filter)
fastify.get('/drops', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { type, status } = request.query;

    let query = supabase.from('drops').select('*').order('created_at', { ascending: false });

    if (type) query = query.eq('campaign_type', type);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: error.message });
    }
    return { data };
});

// Create Drop — BRAND ONLY
fastify.post('/drops', { preHandler: [fastify.authenticate, requireRole('brand')] }, async (request, reply) => {
    const {
        title, description, product_link, quantity, template_id,
        campaign_type, product_value, cpm_rate, view_threshold,
        bonus_amount, max_budget, shipping_method
    } = request.body || {};

    // Validate required fields
    if (!title || !product_link) {
        return reply.code(400).send({ error: 'Title and product_link are required' });
    }

    const ct = campaign_type || 'barter';

    if (ct === 'performance' && !cpm_rate) {
        return reply.code(400).send({ error: 'CPM rate is required for performance campaigns' });
    }

    if (ct === 'boosted' && (!view_threshold || !bonus_amount)) {
        return reply.code(400).send({ error: 'View threshold and bonus amount are required for boosted campaigns' });
    }

    // Sanitize numeric inputs
    const safeQuantity = Math.max(1, parseInt(quantity) || 1);
    const safeProductValue = product_value ? Math.max(0, parseFloat(product_value)) : null;
    const safeCpmRate = cpm_rate ? Math.max(0, parseFloat(cpm_rate)) : null;
    const safeViewThreshold = view_threshold ? Math.max(1, parseInt(view_threshold)) : null;
    const safeBonusAmount = bonus_amount ? Math.max(0, parseFloat(bonus_amount)) : null;
    const safeMaxBudget = max_budget ? Math.max(0, parseFloat(max_budget)) : null;

    const { data, error } = await supabase.from('drops').insert({
        brand_id: request.user.id,
        title,
        description,
        product_link,
        quantity: safeQuantity,
        template_id,
        campaign_type: ct,
        product_value: safeProductValue,
        cpm_rate: safeCpmRate,
        view_threshold: safeViewThreshold,
        bonus_amount: safeBonusAmount,
        max_budget: safeMaxBudget,
        shipping_method: shipping_method || 'direct',
        status: 'draft'
    }).select().single();

    if (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: error.message });
    }
    return reply.code(201).send({ data });
});

// ==========================================
// APPLICATIONS ROUTES
// ==========================================

// Apply to a drop — CREATOR ONLY
fastify.post('/applications', { preHandler: [fastify.authenticate, requireRole('creator')] }, async (request, reply) => {
    const { drop_id } = request.body || {};

    if (!drop_id) {
        return reply.code(400).send({ error: 'drop_id is required' });
    }

    // Verify the drop exists and is active
    const { data: drop, error: dropErr } = await supabase
        .from('drops')
        .select('id, status, quantity')
        .eq('id', drop_id)
        .single();

    if (dropErr || !drop) {
        return reply.code(404).send({ error: 'Drop not found' });
    }
    if (drop.status !== 'active') {
        return reply.code(400).send({ error: 'This drop is no longer accepting applications' });
    }

    // Check if creator already applied
    const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('drop_id', drop_id)
        .eq('creator_id', request.user.id)
        .maybeSingle();

    if (existing) {
        return reply.code(409).send({ error: 'You have already applied to this drop' });
    }

    const { data, error } = await supabase.from('applications').insert({
        drop_id,
        creator_id: request.user.id,
        status: 'applied',
        approval_status: 'pending',
        payout_status: 'pending'
    }).select().single();

    if (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: error.message });
    }
    return reply.code(201).send({ data });
});

// Submit content URL — CREATOR ONLY, must own the application
fastify.put('/applications/:id/submit-content', { preHandler: [fastify.authenticate, requireRole('creator')] }, async (request, reply) => {
    const { id } = request.params;
    const { content_url, video_url } = request.body || {};

    if (!content_url && !video_url) {
        return reply.code(400).send({ error: 'At least one of content_url or video_url is required' });
    }

    const updateObj = { status: 'uploaded' };
    if (content_url) updateObj.content_url = content_url;
    if (video_url) updateObj.video_url = video_url;

    const { data, error } = await supabase.from('applications')
        .update(updateObj)
        .eq('id', id)
        .eq('creator_id', request.user.id) // Ownership check
        .select().single();

    if (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: error.message });
    }
    if (!data) {
        return reply.code(404).send({ error: 'Application not found or not owned by you' });
    }
    return { data };
});

// Manually trigger view sync — ADMIN/INTERNAL only (no public access)
// In production, this would be called by the background worker or an admin panel
fastify.post('/applications/:id/sync-views', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const { unique_views, engagement_rate } = request.body || {};

    // Only the brand that owns the drop OR an admin should be able to sync views
    const { data: app, error: appErr } = await supabase
        .from('applications')
        .select('*, drops(brand_id, campaign_type, view_threshold, bonus_amount)')
        .eq('id', id)
        .single();

    if (appErr || !app) {
        return reply.code(404).send({ error: 'Application not found' });
    }

    // Ownership: must be the brand that owns the drop
    if (app.drops?.brand_id !== request.user.id) {
        return reply.code(403).send({ error: 'Only the campaign owner can sync views' });
    }

    const safeViews = Math.max(0, parseInt(unique_views) || 0);
    const safeEngagement = Math.max(0, parseFloat(engagement_rate) || 0);

    // Insert snapshot with error handling
    const { error: snapErr } = await supabase.from('view_snapshots').insert({
        application_id: id,
        unique_views: safeViews,
        engagement_rate: safeEngagement,
        source: 'instagram'
    });

    if (snapErr) {
        fastify.log.error('View snapshot insert failed:', snapErr);
        return reply.status(500).send({ error: 'Failed to record view snapshot' });
    }

    // Update application
    const { data: updated, error: updateErr } = await supabase.from('applications')
        .update({
            unique_views: safeViews,
            engagement_rate: safeEngagement,
            last_view_sync: new Date().toISOString()
        })
        .eq('id', id)
        .select().single();

    if (updateErr) {
        fastify.log.error(updateErr);
        return reply.status(500).send({ error: updateErr.message });
    }

    // Check if bonus should be triggered (for boosted campaigns)
    if (app.drops?.campaign_type === 'boosted' && !app.bonus_triggered && app.drops.view_threshold) {
        if (safeViews >= app.drops.view_threshold) {
            await supabase.from('applications').update({ bonus_triggered: true }).eq('id', id);
            await supabase.from('payouts').insert({
                application_id: id,
                creator_id: app.creator_id,
                type: 'bonus',
                amount: app.drops.bonus_amount,
                status: 'pending'
            });
            fastify.log.info(`Bonus triggered for application ${id}`);
        }
    }

    return { data: updated, message: 'View sync completed' };
});

// ==========================================
// EARNINGS / STATS ROUTES
// ==========================================

// Creator earnings summary — CREATOR ONLY
fastify.get('/creator/earnings', { preHandler: [fastify.authenticate, requireRole('creator')] }, async (request, reply) => {
    const creatorId = request.user.id;

    const { data: payouts, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });

    if (error) {
        return reply.status(500).send({ error: error.message });
    }

    const totalEarned = (payouts || [])
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingPayouts = (payouts || [])
        .filter(p => p.status === 'pending' || p.status === 'processing')
        .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
        total_earned: totalEarned,
        pending_payouts: pendingPayouts,
        payout_history: payouts || []
    };
});

// Brand campaign stats — BRAND ONLY, must own the campaign
fastify.get('/brand/campaign-stats/:id', { preHandler: [fastify.authenticate, requireRole('brand')] }, async (request, reply) => {
    const { id } = request.params;

    const { data: drop, error: dropErr } = await supabase
        .from('drops')
        .select('*')
        .eq('id', id)
        .eq('brand_id', request.user.id) // Ownership check
        .single();

    if (dropErr || !drop) {
        return reply.code(404).send({ error: 'Campaign not found or not owned by you' });
    }

    const { data: applications } = await supabase.from('applications')
        .select('id, status, unique_views, engagement_rate, performance_payout, bonus_triggered, content_url, creator_id')
        .eq('drop_id', id);

    const totalViews = (applications || []).reduce((sum, a) => sum + (a.unique_views || 0), 0);
    const totalSpend = (applications || []).reduce((sum, a) => sum + (a.performance_payout || 0), 0);
    const cpm = totalViews > 0 ? (totalSpend / totalViews * 1000).toFixed(2) : '0.00';

    return {
        drop,
        total_applications: (applications || []).length,
        total_views: totalViews,
        total_spend: totalSpend,
        effective_cpm: cpm,
        applications: applications || []
    };
});

// ==========================================
// TRUST SCORE ENGINE
// ==========================================

const TRUST_EVENTS = {
    SUCCESSFUL_POST: 5,
    HIGH_ENGAGEMENT: 2,
    RETURN_FRAUD: -Infinity, // special case: set to 0 + blacklist
    FLAG_RETURN: -20,
};

async function updateTrustScore(creatorId, event) {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('trust_score, successful_drops, blacklist_status')
        .eq('id', creatorId)
        .single();

    if (error || !profile) {
        fastify.log.error(`Trust score update failed for ${creatorId}: profile not found`);
        return null;
    }

    if (profile.blacklist_status && event !== 'RETURN_FRAUD') {
        fastify.log.warn(`Creator ${creatorId} is blacklisted, skipping trust update`);
        return profile;
    }

    let newScore = profile.trust_score || 50;
    let newSuccessfulDrops = profile.successful_drops || 0;
    let blacklisted = profile.blacklist_status || false;

    switch (event) {
        case 'RETURN_FRAUD':
            newScore = 0;
            blacklisted = true;
            break;
        case 'SUCCESSFUL_POST':
            newScore = Math.min(100, newScore + TRUST_EVENTS.SUCCESSFUL_POST);
            newSuccessfulDrops += 1;
            break;
        case 'HIGH_ENGAGEMENT':
            newScore = Math.min(100, newScore + TRUST_EVENTS.HIGH_ENGAGEMENT);
            break;
        case 'FLAG_RETURN':
            newScore = Math.max(0, newScore + TRUST_EVENTS.FLAG_RETURN);
            break;
        default:
            fastify.log.warn(`Unknown trust event: ${event}`);
            return profile;
    }

    const { data: updated } = await supabase
        .from('profiles')
        .update({
            trust_score: newScore,
            successful_drops: newSuccessfulDrops,
            blacklist_status: blacklisted,
        })
        .eq('id', creatorId)
        .select('trust_score, successful_drops, blacklist_status')
        .single();

    fastify.log.info(`Trust update for ${creatorId}: ${event} → score=${newScore}, blacklisted=${blacklisted}`);
    return updated;
}

function getTrustTier(score) {
    if (score >= 80) return 'INSTANT';
    if (score >= 60) return 'EXPRESS';
    return 'STANDARD';
}

// NOTE: /creator/trust-dashboard (below) serves as the unified trust endpoint.
// No separate /creator/trust needed — reduces API surface.

// ==========================================
// SPLIT-PAYOUT LIFECYCLE: processPayout
// ==========================================

async function processPayout(applicationId) {
    // Fetch application with drop and creator profile
    const { data: app, error: appErr } = await supabase
        .from('applications')
        .select('*, drops(*)')
        .eq('id', applicationId)
        .single();

    if (appErr || !app) {
        throw new Error(`Application ${applicationId} not found`);
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('trust_score, blacklist_status')
        .eq('id', app.creator_id)
        .single();

    if (profile?.blacklist_status) {
        throw new Error(`Creator ${app.creator_id} is blacklisted — no payouts will be processed`);
    }

    const trustScore = profile?.trust_score || 50;
    const results = { bonus: null, reimbursement: null };

    // --- Phase 1: The Hook — Instant Performance Bonus ---
    if (app.drops && (app.drops.campaign_type === 'performance' || app.drops.campaign_type === 'boosted')) {
        const views = app.unique_views || 0;
        const cpmRate = app.drops.cpm_rate || 0;
        const bonusAmount = (views / 1000) * cpmRate;

        if (bonusAmount > 0) {
            const { data: bonusPayout, error: bonusErr } = await supabase.from('payouts').insert({
                application_id: applicationId,
                creator_id: app.creator_id,
                type: 'performance',
                amount: bonusAmount,
                status: 'pending',
                hold_until: null, // Instant — no hold
                paused_by_brand: false,
            }).select().single();

            if (!bonusErr) {
                results.bonus = bonusPayout;
                // Update participation status
                await supabase.from('applications').update({
                    participation_status: 'BONUS_PAID',
                }).eq('id', applicationId);
            }
        }
    }

    // --- Phase 2: The Safety — Product Reimbursement ---
    const productValue = app.drops?.product_value || 0;
    if (productValue > 0 && app.drops?.shipping_method === 'self_purchase') {
        const postDate = app.post_date ? new Date(app.post_date) : new Date();
        let holdUntil = null;

        if (trustScore < 80) {
            // Standard hold: 30 days from post date
            holdUntil = new Date(postDate);
            holdUntil.setDate(holdUntil.getDate() + 30);
        }
        // If trustScore >= 80: holdUntil stays null → instant reimbursement

        const reimbursementSchedule = holdUntil ? holdUntil.toISOString() : null;

        const { data: reimbPayout, error: reimbErr } = await supabase.from('payouts').insert({
            application_id: applicationId,
            creator_id: app.creator_id,
            type: 'reimbursement',
            amount: productValue,
            status: 'pending',
            hold_until: reimbursementSchedule,
            paused_by_brand: false,
        }).select().single();

        if (!reimbErr) {
            results.reimbursement = reimbPayout;
            await supabase.from('applications').update({
                participation_status: holdUntil ? 'REIMBURSEMENT_PENDING' : 'COMPLETED',
                reimbursement_scheduled_at: reimbursementSchedule,
            }).eq('id', applicationId);
        }
    }

    // Update trust score for successful post
    await updateTrustScore(app.creator_id, 'SUCCESSFUL_POST');

    // Check engagement bonus
    if ((app.engagement_rate || 0) > 5) {
        await updateTrustScore(app.creator_id, 'HIGH_ENGAGEMENT');
    }

    return results;
}

// API endpoint to trigger processPayout
fastify.post('/applications/:id/process-payout', { preHandler: [fastify.authenticate, requireRole('brand')] }, async (request, reply) => {
    const { id } = request.params;

    // Verify brand owns this campaign
    const { data: app } = await supabase
        .from('applications')
        .select('drops(brand_id)')
        .eq('id', id)
        .single();

    if (!app || app.drops?.brand_id !== request.user.id) {
        return reply.code(403).send({ error: 'Only the campaign owner can process payouts' });
    }

    try {
        const results = await processPayout(id);
        return { message: 'Payout processed', results };
    } catch (err) {
        fastify.log.error(err);
        return reply.code(400).send({ error: err.message });
    }
});

// ==========================================
// ANTI-SCAM: Duplicate Order Detection
// ==========================================

fastify.get('/admin/duplicate-orders', { preHandler: [fastify.authenticate, requireRole('brand')] }, async (request, reply) => {
    // Only allow brands/admins to check — restricted in production
    const { data, error } = await supabase.rpc('detect_duplicate_orders');

    if (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: error.message });
    }

    // Auto-blacklist flagged creators
    for (const dup of data || []) {
        for (const creatorId of dup.creator_ids) {
            await updateTrustScore(creatorId, 'RETURN_FRAUD');
            fastify.log.warn(`Blacklisted creator ${creatorId} for duplicate order_id: ${dup.order_id}`);
        }
    }

    return {
        flagged: data || [],
        message: `${(data || []).length} duplicate order(s) detected and blacklisted`,
    };
});

// ==========================================
// ANTI-SCAM: Brand "Flag Return" Webhook
// ==========================================

fastify.post('/webhooks/flag-return', { preHandler: [fastify.authenticate, requireRole('brand')] }, async (request, reply) => {
    const { application_id, reason } = request.body || {};

    if (!application_id) {
        return reply.code(400).send({ error: 'application_id is required' });
    }

    // Verify brand owns this campaign
    const { data: app, error: appErr } = await supabase
        .from('applications')
        .select('creator_id, drops(brand_id)')
        .eq('id', application_id)
        .single();

    if (appErr || !app || app.drops?.brand_id !== request.user.id) {
        return reply.code(403).send({ error: 'You can only flag returns on your own campaigns' });
    }

    // Pause all pending reimbursement payouts for this application
    const { data: paused, error: pauseErr } = await supabase.from('payouts')
        .update({ paused_by_brand: true })
        .eq('application_id', application_id)
        .eq('type', 'reimbursement')
        .eq('status', 'pending')
        .select();

    if (pauseErr) {
        fastify.log.error(pauseErr);
        return reply.code(500).send({ error: 'Failed to pause payouts' });
    }

    // Reduce trust score
    await updateTrustScore(app.creator_id, 'FLAG_RETURN');

    fastify.log.warn(`Brand flagged return for application ${application_id}: ${reason || 'no reason given'}`);

    return {
        message: 'Return flagged — reimbursement paused',
        paused_payouts: (paused || []).length,
    };
});

// ==========================================
// CREATOR TRUST DASHBOARD DATA
// ==========================================

fastify.get('/creator/trust-dashboard', { preHandler: [fastify.authenticate, requireRole('creator')] }, async (request, reply) => {
    const creatorId = request.user.id;

    // Trust info
    const { data: profile } = await supabase
        .from('profiles')
        .select('trust_score, successful_drops, blacklist_status')
        .eq('id', creatorId)
        .single();

    // Upcoming payouts (only pending/processing, ordered by hold_until)
    const { data: upcomingPayouts } = await supabase
        .from('payouts')
        .select('*, applications(drops(title, product_link))')
        .eq('creator_id', creatorId)
        .in('status', ['pending', 'processing'])
        .order('hold_until', { ascending: true, nullsFirst: true });

    const trustScore = profile?.trust_score || 50;

    return {
        trust: {
            score: trustScore,
            tier: getTrustTier(trustScore),
            successful_drops: profile?.successful_drops || 0,
            blacklisted: profile?.blacklist_status || false,
            next_tier_at: trustScore < 60 ? 60 : trustScore < 80 ? 80 : null,
            points_to_next: trustScore < 60 ? 60 - trustScore : trustScore < 80 ? 80 - trustScore : 0,
        },
        upcoming_payouts: (upcomingPayouts || []).map(p => ({
            id: p.id,
            type: p.type,
            amount: p.amount,
            status: p.status,
            hold_until: p.hold_until,
            paused: p.paused_by_brand,
            campaign: p.applications?.drops?.title || 'Unknown Campaign',
            days_remaining: p.hold_until
                ? Math.max(0, Math.ceil((new Date(p.hold_until) - Date.now()) / (1000 * 60 * 60 * 24)))
                : 0,
        })),
    };
});

// ==========================================
// SERVER START
// ==========================================
const start = async () => {
    try {
        const port = parseInt(process.env.PORT) || 3001;
        await fastify.listen({ port, host: '0.0.0.0' });
        fastify.log.info(`API Gateway listening on port ${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
