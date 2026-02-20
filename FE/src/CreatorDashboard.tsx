import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './auth';
import type { Drop } from './types';
import CreatorApplications from './CreatorApplications';
import EarningsDashboard from './EarningsDashboard';
import TrustDashboard from './TrustDashboard';

const CAMPAIGN_TYPE_BADGES: Record<string, { label: string; color: string }> = {
  barter: { label: '🎁 Barter', color: '#22c55e' },
  performance: { label: '📈 Performance', color: '#3b82f6' },
  boosted: { label: '🚀 Boosted', color: '#a855f7' },
};

const CreatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [availableDrops, setAvailableDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'drops' | 'earnings' | 'trust'>('drops');

  useEffect(() => {
    if (user) {
      fetchAvailableDrops();
    }
  }, [user]);

  const fetchAvailableDrops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('drops')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvailableDrops(data || []);
    } catch (error: any) {
      console.error('Error fetching drops:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyToDrop = async (dropId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            drop_id: dropId,
            creator_id: user.id,
            status: 'applied',
            approval_status: 'pending',
            payout_status: 'pending'
          }
        ]);

      if (error) {
        if (error.code === '23505') {
          setMessage('You have already applied to this drop.');
        } else {
          throw error;
        }
      } else {
        setMessage('Application submitted successfully!');
        window.location.reload();
      }
    } catch (error: any) {
      setMessage('Error applying: ' + error.message);
    }
  };

  const filteredDrops = filterType === 'all'
    ? availableDrops
    : availableDrops.filter(d => d.campaign_type === filterType);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Creator Dashboard</h2>
      <p>Welcome, {user?.email}!</p>

      {message && <p style={{ color: '#3b82f6', marginBottom: '12px' }}>{message}</p>}

      {/* Tab Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('drops')}
          style={{
            padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: activeTab === 'drops' ? '#fff' : '#222',
            color: activeTab === 'drops' ? '#000' : '#999',
            fontWeight: 600,
          }}
        >
          Browse Drops
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          style={{
            padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: activeTab === 'earnings' ? '#fff' : '#222',
            color: activeTab === 'earnings' ? '#000' : '#999',
            fontWeight: 600,
          }}
        >
          💰 My Earnings
        </button>
        <button
          onClick={() => setActiveTab('trust')}
          style={{
            padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: activeTab === 'trust' ? '#fff' : '#222',
            color: activeTab === 'trust' ? '#000' : '#999',
            fontWeight: 600,
          }}
        >
          🛡️ Trust
        </button>
      </div>

      {activeTab === 'trust' ? (
        <TrustDashboard />
      ) : activeTab === 'earnings' ? (
        <EarningsDashboard />
      ) : (
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Available Drops</h3>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['all', 'barter', 'performance', 'boosted'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                      border: filterType === type ? '1px solid #fff' : '1px solid #444',
                      background: filterType === type ? '#333' : 'transparent',
                      color: '#fff', cursor: 'pointer',
                    }}
                  >
                    {type === 'all' ? 'All' : CAMPAIGN_TYPE_BADGES[type]?.label || type}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p>Loading drops...</p>
            ) : filteredDrops.length === 0 ? (
              <p>No active drops available at the moment.</p>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {filteredDrops.map(drop => {
                  const badge = CAMPAIGN_TYPE_BADGES[drop.campaign_type] || { label: drop.campaign_type, color: '#999' };
                  return (
                    <div key={drop.id} style={{ border: '1px solid #333', padding: '15px', borderRadius: '12px', background: '#111' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0 }}>{drop.title || 'Untitled Drop'}</h4>
                        <span style={{
                          padding: '2px 8px', borderRadius: '20px', fontSize: '11px',
                          border: `1px solid ${badge.color}`, color: badge.color,
                        }}>
                          {badge.label}
                        </span>
                      </div>
                      {drop.description && <p style={{ color: '#999', fontSize: '14px', marginBottom: '8px' }}>{drop.description}</p>}
                      <p style={{ fontSize: '13px', color: '#666' }}>
                        <a href={drop.product_link} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>Product Link</a>
                        {' · '}Qty: {drop.quantity}
                        {drop.product_value && ` · ₹${drop.product_value}`}
                        {drop.cpm_rate && ` · ₹${drop.cpm_rate}/1K views`}
                        {drop.bonus_amount && ` · ₹${drop.bonus_amount} bonus at ${drop.view_threshold} views`}
                      </p>
                      <button
                        onClick={() => applyToDrop(drop.id)}
                        style={{ marginTop: '8px', padding: '6px 16px', cursor: 'pointer', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}
                      >
                        Apply Now
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <CreatorApplications />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorDashboard;
