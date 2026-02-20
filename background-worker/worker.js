require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Background worker started (Two-Speed Marketplace).');

// ==========================================
// JOB 1: Nudge Bot — Remind creators about pending applications (daily at 8 AM)
// ==========================================
cron.schedule('0 8 * * *', async () => {
    console.log('[Nudge Bot] Running...');
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const { data: pendingApps, error } = await supabase
            .from('applications')
            .select('*, profiles(email)')
            .eq('status', 'applied')
            .lt('created_at', twoDaysAgo.toISOString());

        if (error) throw error;

        console.log(`[Nudge Bot] Found ${pendingApps.length} pending applications to nudge.`);

        pendingApps.forEach(app => {
            console.log(`[Nudge Bot] Nudging user ${app.profiles?.email || 'unknown'} for application ${app.id}`);
            // TODO: Send WhatsApp/SMS/email via Interakt/Wati
        });

    } catch (err) {
        console.error('[Nudge Bot] Error:', err);
    }
});

// ==========================================
// JOB 2: View Sync — Fetch Instagram view counts for performance/boosted campaigns (every 6 hours)
// ==========================================
cron.schedule('0 */6 * * *', async () => {
    console.log('[View Sync] Running Instagram view sync...');
    try {
        // Get all active performance/boosted applications with a content_url
        const { data: apps, error } = await supabase
            .from('applications')
            .select('*, drops(*)')
            .in('status', ['uploaded', 'approved'])
            .not('content_url', 'is', null);

        if (error) throw error;

        const performanceApps = (apps || []).filter(a =>
            a.drops && (a.drops.campaign_type === 'performance' || a.drops.campaign_type === 'boosted')
        );

        console.log(`[View Sync] Found ${performanceApps.length} performance/boosted applications to sync.`);

        for (const app of performanceApps) {
            try {
                // STUB: In production, call Instagram Graph API with the content_url
                // For now, simulate gradual organic growth
                const currentViews = app.unique_views || 0;
                const viewGrowth = Math.floor(Math.random() * 500) + 100; // 100-600 new views
                const newViews = currentViews + viewGrowth;
                const engagementRate = (3 + Math.random() * 7).toFixed(2); // 3-10%

                // Insert snapshot for audit trail
                await supabase.from('view_snapshots').insert({
                    application_id: app.id,
                    unique_views: newViews,
                    engagement_rate: parseFloat(engagementRate),
                    source: 'instagram'
                });

                // Update application
                await supabase.from('applications').update({
                    unique_views: newViews,
                    engagement_rate: parseFloat(engagementRate),
                    last_view_sync: new Date().toISOString()
                }).eq('id', app.id);

                // Check boosted bonus trigger
                if (app.drops.campaign_type === 'boosted' && !app.bonus_triggered && app.drops.view_threshold) {
                    if (newViews >= app.drops.view_threshold) {
                        console.log(`[View Sync] Bonus triggered for application ${app.id} (${newViews} views >= ${app.drops.view_threshold} threshold)`);

                        await supabase.from('applications').update({ bonus_triggered: true }).eq('id', app.id);
                        await supabase.from('payouts').insert({
                            application_id: app.id,
                            creator_id: app.creator_id,
                            type: 'bonus',
                            amount: app.drops.bonus_amount,
                            status: 'pending'
                        });
                    }
                }

                console.log(`[View Sync] App ${app.id}: ${currentViews} -> ${newViews} views`);
            } catch (syncErr) {
                console.error(`[View Sync] Error syncing app ${app.id}:`, syncErr);
            }
        }

    } catch (err) {
        console.error('[View Sync] Error:', err);
    }
});

// ==========================================
// JOB 3: Performance Payout Calculator (daily at 10 AM)
// ==========================================
cron.schedule('0 10 * * *', async () => {
    console.log('[Payout Calculator] Running...');
    try {
        // Get performance campaigns with views to settle
        const { data: apps, error } = await supabase
            .from('applications')
            .select('*, drops(*)')
            .in('status', ['uploaded', 'approved'])
            .gt('unique_views', 0);

        if (error) throw error;

        const performanceApps = (apps || []).filter(a =>
            a.drops && a.drops.campaign_type === 'performance' && a.drops.cpm_rate
        );

        // Group apps by drop_id to calculate campaign-level budget usage
        const appsByDrop = {};
        for (const app of performanceApps) {
            if (!appsByDrop[app.drop_id]) appsByDrop[app.drop_id] = [];
            appsByDrop[app.drop_id].push(app);
        }

        for (const [dropId, dropApps] of Object.entries(appsByDrop)) {
            const drop = dropApps[0].drops;
            const totalExistingSpend = dropApps.reduce((sum, a) => sum + (a.performance_payout || 0), 0);
            const remainingBudget = drop.max_budget ? Math.max(0, drop.max_budget - totalExistingSpend) : Infinity;

            for (const app of dropApps) {
                // Calculate CPM-based payout: (views / 1000) * cpm_rate
                const cpmPayout = (app.unique_views / 1000) * drop.cpm_rate;
                const idealPayout = Math.min(cpmPayout, (app.performance_payout || 0) + remainingBudget);

                if (idealPayout > (app.performance_payout || 0)) {
                    const incrementalPayout = idealPayout - (app.performance_payout || 0);

                    // Update application with new payout amount
                    await supabase.from('applications').update({
                        performance_payout: idealPayout
                    }).eq('id', app.id);

                    // ----------------------------------------------------------------
                    // FAKE VIEW DEFENSE SYSTEM (ENGAGEMENT FLOOR)
                    // If a video has massive views (> 5000) but terrible engagement (< 1.5%),
                    // it is highly likely a bot network. Flag it and pause payout.
                    // ----------------------------------------------------------------
                    const isSuspicious = app.unique_views >= 5000 && (app.engagement_rate || 0) < 1.5;
                    const payoutStatus = isSuspicious ? 'failed' : 'pending';
                    const isPaused = isSuspicious;

                    if (isSuspicious) {
                        console.warn(`[FRAUD ALERT] App ${app.id} (Creator: ${app.creator_id}): ${app.unique_views} views but only ${app.engagement_rate}% engagement. Flagging as fake views.`);

                        // Auto-blacklist creator
                        await supabase.from('profiles').update({
                            trust_score: 0,
                            blacklist_status: true,
                        }).eq('id', app.creator_id);

                        // Mark application as having an issue
                        await supabase.from('applications').update({
                            approval_status: 'rejected',
                            payout_status: 'failed'
                        }).eq('id', app.id);
                    }

                    // Insert payout record for the incremental amount
                    if (incrementalPayout > 1) { // Only create payout if > ₹1
                        await supabase.from('payouts').insert({
                            application_id: app.id,
                            creator_id: app.creator_id,
                            type: 'performance',
                            amount: incrementalPayout,
                            status: payoutStatus,
                            paused_by_brand: isPaused // System-paused
                        });
                        console.log(`[Payout Calculator] App ${app.id}: ₹${incrementalPayout.toFixed(2)} performance payout queued (Status: ${payoutStatus})`);
                    }
                }

                // Auto-close campaigns that have hit max_budget
                const { data: drops } = await supabase
                    .from('drops')
                    .select('*')
                    .eq('campaign_type', 'performance')
                    .eq('status', 'active')
                    .not('max_budget', 'is', null);

                for (const drop of drops || []) {
                    const { data: dropApps } = await supabase
                        .from('applications')
                        .select('performance_payout')
                        .eq('drop_id', drop.id);

                    const totalSpend = (dropApps || []).reduce((sum, a) => sum + (a.performance_payout || 0), 0);

                    if (totalSpend >= drop.max_budget) {
                        await supabase.from('drops').update({ status: 'closed' }).eq('id', drop.id);
                        console.log(`[Payout Calculator] Campaign ${drop.id} auto-closed (budget exhausted: ₹${totalSpend}/${drop.max_budget})`);
                    }
                }

            } catch (err) {
                console.error('[Payout Calculator] Error:', err);
            }
        });

// ==========================================
// NOTE: Payment disbursement (UPI/Bank) is handled MANUALLY in the MVP.
// The payouts table serves as a ledger — admin reviews pending payouts
// in the Supabase dashboard and marks them as 'paid' after manual transfer.
// ==========================================


// ==========================================
// JOB 6: Duplicate Order Scanner (daily at midnight)
// ==========================================
cron.schedule('0 0 * * *', async () => {
    console.log('[Fraud Scanner] Scanning for duplicate orders...');
    try {
        const { data: duplicates, error } = await supabase.rpc('detect_duplicate_orders');

        if (error) throw error;

        for (const dup of duplicates || []) {
            console.log(`[Fraud Scanner] Duplicate order_id "${dup.order_id}" used by ${dup.usage_count} creators: ${dup.creator_ids.join(', ')}`);

            // Auto-blacklist all involved creators
            for (const creatorId of dup.creator_ids) {
                await supabase.from('profiles').update({
                    trust_score: 0,
                    blacklist_status: true,
                }).eq('id', creatorId);

                // Pause all their pending reimbursements
                await supabase.from('payouts')
                    .update({ paused_by_brand: true })
                    .eq('creator_id', creatorId)
                    .eq('type', 'reimbursement')
                    .eq('status', 'pending');

                console.log(`[Fraud Scanner] Blacklisted creator ${creatorId}`);
            }
        }

        console.log(`[Fraud Scanner] Scan complete. ${(duplicates || []).length} duplicate order(s) found.`);
    } catch (err) {
        console.error('[Fraud Scanner] Error:', err);
    }
});

