import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './auth';
import type { TrustDashboardData } from './types';

const TIER_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    STANDARD: { label: 'Standard', color: '#f59e0b', icon: '🛡️' },
    EXPRESS: { label: 'Express', color: '#3b82f6', icon: '⚡' },
    INSTANT: { label: 'Instant', color: '#22c55e', icon: '🚀' },
};

const STATUS_COLORS: Record<string, string> = {
    pending: '#f59e0b',
    processing: '#3b82f6',
    paid: '#22c55e',
    failed: '#ef4444',
};

function CountdownTimer({ holdUntil }: { holdUntil: string }) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        function update() {
            const target = new Date(holdUntil).getTime();
            const now = Date.now();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft('Releasing soon...');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft(`${days}d ${hours}h ${mins}m`);
        }

        update();
        const interval = setInterval(update, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [holdUntil]);

    return <span style={{ fontFamily: 'monospace', color: '#f59e0b' }}>{timeLeft}</span>;
}

const TrustDashboard: React.FC = () => {
    const { user } = useAuth();
    const [data, setData] = useState<TrustDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchTrustData();
    }, [user]);

    const fetchTrustData = async () => {
        try {
            setLoading(true);

            // Fetch trust info
            const { data: profile } = await supabase
                .from('profiles')
                .select('trust_score, successful_drops, blacklist_status')
                .eq('id', user?.id)
                .single();

            // Fetch upcoming payouts
            const { data: payouts } = await supabase
                .from('payouts')
                .select('*')
                .eq('creator_id', user?.id)
                .in('status', ['pending', 'processing'])
                .order('hold_until', { ascending: true, nullsFirst: true });

            const ts = profile?.trust_score || 50;
            const tier = ts >= 80 ? 'INSTANT' : ts >= 60 ? 'EXPRESS' : 'STANDARD';

            setData({
                trust: {
                    score: ts,
                    tier,
                    successful_drops: profile?.successful_drops || 0,
                    blacklisted: profile?.blacklist_status || false,
                    next_tier_at: ts < 60 ? 60 : ts < 80 ? 80 : null,
                    points_to_next: ts < 60 ? 60 - ts : ts < 80 ? 80 - ts : 0,
                },
                upcoming_payouts: (payouts || []).map(p => ({
                    id: p.id,
                    type: p.type,
                    amount: p.amount,
                    status: p.status,
                    hold_until: p.hold_until,
                    paused: p.paused_by_brand || false,
                    campaign: 'Campaign',
                    days_remaining: p.hold_until
                        ? Math.max(0, Math.ceil((new Date(p.hold_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                        : 0,
                })),
            });
        } catch (err: any) {
            console.error('Error fetching trust data:', err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading trust data...</p>;
    if (!data) return <p>Unable to load trust data.</p>;

    const { trust, upcoming_payouts } = data;
    const tierConfig = TIER_CONFIG[trust.tier] || TIER_CONFIG.STANDARD;

    return (
        <div>
            <h3>🛡️ Trust Score</h3>

            {/* Blacklist Warning */}
            {trust.blacklisted && (
                <div style={{ background: '#7f1d1d', border: '1px solid #ef4444', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <p style={{ color: '#fca5a5', fontWeight: 600, margin: 0 }}>⚠️ Account Restricted</p>
                    <p style={{ color: '#fca5a5', fontSize: '13px', margin: '4px 0 0' }}>
                        Your account has been flagged for suspicious activity. All payouts are paused. Contact support if you believe this is an error.
                    </p>
                </div>
            )}

            {/* Trust Score + Tier Card */}
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                        <p style={{ color: '#999', fontSize: '12px', marginBottom: '4px' }}>Your Trust Score</p>
                        <p style={{ fontSize: '48px', fontWeight: 700, margin: 0, lineHeight: 1 }}>{trust.score}</p>
                    </div>
                    <div style={{
                        padding: '8px 16px', borderRadius: '20px',
                        border: `1px solid ${tierConfig.color}`,
                        color: tierConfig.color,
                        fontSize: '14px', fontWeight: 600
                    }}>
                        {tierConfig.icon} {tierConfig.label} Tier
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ position: 'relative', height: '12px', background: '#222', borderRadius: '6px', overflow: 'hidden' }}>
                    <div
                        style={{
                            width: `${trust.score}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${tierConfig.color}88, ${tierConfig.color})`,
                            borderRadius: '6px',
                            transition: 'width 0.8s ease',
                        }}
                    />
                    {/* Tier markers */}
                    <div style={{ position: 'absolute', left: '60%', top: 0, bottom: 0, width: '2px', background: '#555' }} />
                    <div style={{ position: 'absolute', left: '80%', top: 0, bottom: 0, width: '2px', background: '#555' }} />
                </div>

                {/* Tier labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: '#666' }}>
                    <span>0 — Standard</span>
                    <span>60 — Express</span>
                    <span>80 — Instant</span>
                    <span>100</span>
                </div>

                {/* Next tier hint */}
                {trust.next_tier_at && (
                    <p style={{ color: '#777', fontSize: '13px', marginTop: '12px', marginBottom: 0 }}>
                        🎯 {trust.points_to_next} more point{trust.points_to_next !== 1 ? 's' : ''} to unlock <strong style={{ color: tierConfig.color }}>
                            {trust.next_tier_at === 60 ? 'Express' : 'Instant'} Tier
                        </strong>
                        {trust.next_tier_at === 80 && ' (24-hour reimbursements!)'}
                    </p>
                )}
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '16px' }}>
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: '4px' }}>Successful Drops</p>
                    <p style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>{trust.successful_drops}</p>
                </div>
                <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '16px' }}>
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: '4px' }}>Reimbursement Speed</p>
                    <p style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: tierConfig.color }}>
                        {trust.tier === 'INSTANT' ? '< 24 hours' : trust.tier === 'EXPRESS' ? '15 days' : '30 days'}
                    </p>
                </div>
            </div>

            {/* Upcoming Payouts */}
            <h4>📅 Upcoming Payouts</h4>
            {upcoming_payouts.length === 0 ? (
                <p style={{ color: '#666' }}>No pending payouts. Complete more drops to earn!</p>
            ) : (
                <div style={{ display: 'grid', gap: '8px' }}>
                    {upcoming_payouts.map(payout => (
                        <div
                            key={payout.id}
                            style={{
                                background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '14px',
                                opacity: payout.paused ? 0.5 : 1,
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontWeight: 600 }}>
                                        ₹{Number(payout.amount).toLocaleString()}
                                    </span>
                                    <span style={{
                                        marginLeft: '8px', padding: '2px 6px', borderRadius: '4px', fontSize: '10px',
                                        background: payout.type === 'reimbursement' ? '#1e3a5f' : payout.type === 'bonus' ? '#3b1f5b' : '#1f3a1f',
                                        color: payout.type === 'reimbursement' ? '#93c5fd' : payout.type === 'bonus' ? '#c4b5fd' : '#86efac',
                                    }}>
                                        {payout.type}
                                    </span>
                                </div>
                                <span style={{
                                    padding: '2px 8px', borderRadius: '20px', fontSize: '11px',
                                    border: `1px solid ${STATUS_COLORS[payout.status] || '#666'}`,
                                    color: STATUS_COLORS[payout.status] || '#666',
                                }}>
                                    {payout.paused ? '⏸ Paused' : payout.status}
                                </span>
                            </div>

                            {/* Countdown for held reimbursements */}
                            {payout.hold_until && !payout.paused && payout.status === 'pending' && (
                                <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
                                    🕐 Releases in: <CountdownTimer holdUntil={payout.hold_until} />
                                    <span style={{ marginLeft: '8px', color: '#555' }}>
                                        ({new Date(payout.hold_until).toLocaleDateString()})
                                    </span>
                                </div>
                            )}

                            {!payout.hold_until && payout.status === 'pending' && !payout.paused && (
                                <div style={{ marginTop: '8px', fontSize: '12px', color: '#22c55e' }}>
                                    ⚡ Instant release — processing shortly
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrustDashboard;
