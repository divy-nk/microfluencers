import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './auth';
import type { Payout } from './types';

const TYPE_LABELS: Record<string, string> = {
    reimbursement: '💸 Reimbursement',
    performance: '📈 Performance',
    bonus: '🚀 Bonus',
};

const STATUS_COLORS: Record<string, string> = {
    paid: '#22c55e',
    pending: '#f59e0b',
    processing: '#3b82f6',
    failed: '#ef4444',
};

const EarningsDashboard: React.FC = () => {
    const { user } = useAuth();
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchPayouts();
    }, [user]);

    const fetchPayouts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('payouts')
                .select('*')
                .eq('creator_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPayouts(data || []);
        } catch (err: any) {
            console.error('Error fetching payouts:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const totalEarned = payouts
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingAmount = payouts
        .filter(p => p.status === 'pending' || p.status === 'processing')
        .reduce((sum, p) => sum + Number(p.amount), 0);

    const bonusEarned = payouts
        .filter(p => p.type === 'bonus' && p.status === 'paid')
        .reduce((sum, p) => sum + Number(p.amount), 0);

    if (loading) return <p>Loading earnings...</p>;

    return (
        <div>
            <h3>💰 My Earnings</h3>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '16px' }}>
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: '4px' }}>Total Earned</p>
                    <p style={{ fontSize: '28px', fontWeight: 700, color: '#22c55e' }}>₹{totalEarned.toLocaleString()}</p>
                </div>
                <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '16px' }}>
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: '4px' }}>Pending</p>
                    <p style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>₹{pendingAmount.toLocaleString()}</p>
                </div>
                <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '16px' }}>
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: '4px' }}>Bonuses Earned</p>
                    <p style={{ fontSize: '28px', fontWeight: 700, color: '#a855f7' }}>₹{bonusEarned.toLocaleString()}</p>
                </div>
            </div>

            {/* Payout History */}
            <h4>Payout History</h4>
            {payouts.length === 0 ? (
                <p style={{ color: '#666' }}>No payouts yet. Keep creating amazing content!</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
                            <th style={{ padding: '8px' }}>Type</th>
                            <th style={{ padding: '8px' }}>Amount</th>
                            <th style={{ padding: '8px' }}>Status</th>
                            <th style={{ padding: '8px' }}>UPI Ref</th>
                            <th style={{ padding: '8px' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payouts.map(payout => (
                            <tr key={payout.id} style={{ borderBottom: '1px solid #222' }}>
                                <td style={{ padding: '8px' }}>{TYPE_LABELS[payout.type] || payout.type}</td>
                                <td style={{ padding: '8px', fontWeight: 600 }}>₹{Number(payout.amount).toLocaleString()}</td>
                                <td style={{ padding: '8px' }}>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: '20px', fontSize: '11px',
                                        border: `1px solid ${STATUS_COLORS[payout.status] || '#666'}`,
                                        color: STATUS_COLORS[payout.status] || '#666',
                                    }}>
                                        {payout.status}
                                    </span>
                                </td>
                                <td style={{ padding: '8px', color: '#666', fontSize: '12px' }}>{payout.upi_reference || '—'}</td>
                                <td style={{ padding: '8px', color: '#666' }}>{new Date(payout.created_at || '').toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EarningsDashboard;
