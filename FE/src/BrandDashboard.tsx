import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './auth';
import type { Drop } from './types';
import TemplateLibrary from './TemplateLibrary';

const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  barter: '🎁 Barter Drop',
  performance: '📈 Performance Challenge',
  boosted: '🚀 Boosted Drop',
};

const BrandDashboard: React.FC = () => {
  const { user } = useAuth();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDrop, setNewDrop] = useState({
    title: '',
    description: '',
    product_link: '',
    quantity: 10,
    template_id: '',
    campaign_type: 'barter' as 'barter' | 'performance' | 'boosted',
    product_value: '',
    cpm_rate: '',
    view_threshold: '',
    bonus_amount: '',
    max_budget: '',
    shipping_method: 'direct' as 'direct' | 'quick_commerce' | 'self_purchase',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchDrops();
    }
  }, [user]);

  const fetchDrops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('drops')
        .select('*')
        .eq('brand_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDrops(data || []);
    } catch (error: any) {
      console.error('Error fetching drops:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const createDrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const insertData: any = {
        brand_id: user.id,
        title: newDrop.title,
        description: newDrop.description,
        product_link: newDrop.product_link,
        quantity: newDrop.quantity,
        campaign_type: newDrop.campaign_type,
        shipping_method: newDrop.shipping_method,
        status: 'active',
      };

      if (newDrop.product_value) insertData.product_value = parseFloat(newDrop.product_value);
      if (newDrop.cpm_rate) insertData.cpm_rate = parseFloat(newDrop.cpm_rate);
      if (newDrop.view_threshold) insertData.view_threshold = parseInt(newDrop.view_threshold);
      if (newDrop.bonus_amount) insertData.bonus_amount = parseFloat(newDrop.bonus_amount);
      if (newDrop.max_budget) insertData.max_budget = parseFloat(newDrop.max_budget);

      const { error } = await supabase
        .from('drops')
        .insert([insertData])
        .select();

      if (error) throw error;

      setMessage('Drop created successfully!');
      setNewDrop({
        title: '', description: '', product_link: '', quantity: 10, template_id: '',
        campaign_type: 'barter', product_value: '', cpm_rate: '', view_threshold: '',
        bonus_amount: '', max_budget: '', shipping_method: 'direct',
      });
      fetchDrops();
    } catch (error: any) {
      setMessage('Error creating drop: ' + error.message);
    }
  };

  const showPerformanceFields = newDrop.campaign_type === 'performance' || newDrop.campaign_type === 'boosted';
  const showBoostedFields = newDrop.campaign_type === 'boosted';

  return (
    <div style={{ padding: '20px' }}>
      <h2>Brand Dashboard</h2>
      <p>Welcome, {user?.email}!</p>

      <div style={{ marginBottom: '40px', border: '1px solid #333', padding: '20px', borderRadius: '12px', background: '#111' }}>
        <h3>Create New Campaign</h3>
        <form onSubmit={createDrop}>

          {/* Campaign Type Selector */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Campaign Type:</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['barter', 'performance', 'boosted'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setNewDrop({ ...newDrop, campaign_type: type })}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: newDrop.campaign_type === type ? '2px solid #fff' : '1px solid #444',
                    background: newDrop.campaign_type === type ? '#222' : 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  {CAMPAIGN_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Common Fields */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Campaign Title:</label>
            <input
              type="text"
              value={newDrop.title}
              onChange={(e) => setNewDrop({ ...newDrop, title: e.target.value })}
              required
              placeholder="e.g., Summer Skincare Launch"
              style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
            <textarea
              value={newDrop.description}
              onChange={(e) => setNewDrop({ ...newDrop, description: e.target.value })}
              placeholder="Describe the campaign, product, and what you're looking for..."
              style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#fff', minHeight: '80px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Product Link:</label>
            <input
              type="text"
              value={newDrop.product_link}
              onChange={(e) => setNewDrop({ ...newDrop, product_link: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Quantity:</label>
              <input
                type="number"
                value={newDrop.quantity}
                onChange={(e) => setNewDrop({ ...newDrop, quantity: parseInt(e.target.value) })}
                min="1"
                required
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Product Value (₹):</label>
              <input
                type="number"
                value={newDrop.product_value}
                onChange={(e) => setNewDrop({ ...newDrop, product_value: e.target.value })}
                placeholder="e.g., 1499"
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Shipping:</label>
              <select
                value={newDrop.shipping_method}
                onChange={(e) => setNewDrop({ ...newDrop, shipping_method: e.target.value as any })}
                style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}
              >
                <option value="direct">Direct Ship</option>
                <option value="quick_commerce">Quick Commerce (Blinkit/Zepto)</option>
                <option value="self_purchase">Self Purchase + Reimburse</option>
              </select>
            </div>
          </div>

          {/* Performance Fields */}
          {showPerformanceFields && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px', padding: '12px', border: '1px dashed #555', borderRadius: '8px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>CPM Rate (₹ per 1K views):</label>
                <input
                  type="number"
                  value={newDrop.cpm_rate}
                  onChange={(e) => setNewDrop({ ...newDrop, cpm_rate: e.target.value })}
                  required={newDrop.campaign_type === 'performance'}
                  placeholder="e.g., 50"
                  style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Max Budget (₹):</label>
                <input
                  type="number"
                  value={newDrop.max_budget}
                  onChange={(e) => setNewDrop({ ...newDrop, max_budget: e.target.value })}
                  placeholder="e.g., 10000"
                  style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}
                />
              </div>
            </div>
          )}

          {/* Boosted-only Fields */}
          {showBoostedFields && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px', padding: '12px', border: '1px dashed #a855f7', borderRadius: '8px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>View Threshold (for bonus):</label>
                <input
                  type="number"
                  value={newDrop.view_threshold}
                  onChange={(e) => setNewDrop({ ...newDrop, view_threshold: e.target.value })}
                  required
                  placeholder="e.g., 2000"
                  style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Bonus Amount (₹):</label>
                <input
                  type="number"
                  value={newDrop.bonus_amount}
                  onChange={(e) => setNewDrop({ ...newDrop, bonus_amount: e.target.value })}
                  required
                  placeholder="e.g., 500"
                  style={{ width: '100%', padding: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}
                />
              </div>
            </div>
          )}

          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 600 }}>
            Launch Campaign
          </button>
        </form>
        {message && <p style={{ marginTop: '10px', color: message.includes('Error') ? '#ef4444' : '#22c55e' }}>{message}</p>}
      </div>

      <TemplateLibrary />

      <h3>Your Campaigns</h3>
      {loading ? (
        <p>Loading campaigns...</p>
      ) : drops.length === 0 ? (
        <p>No campaigns created yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
              <th style={{ padding: '10px' }}>Title</th>
              <th style={{ padding: '10px' }}>Type</th>
              <th style={{ padding: '10px' }}>Product</th>
              <th style={{ padding: '10px' }}>Qty</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {drops.map((drop) => (
              <tr key={drop.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '10px' }}>{drop.title || '—'}</td>
                <td style={{ padding: '10px' }}>{CAMPAIGN_TYPE_LABELS[drop.campaign_type] || drop.campaign_type}</td>
                <td style={{ padding: '10px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{drop.product_link}</td>
                <td style={{ padding: '10px' }}>{drop.quantity}</td>
                <td style={{ padding: '10px' }}>{drop.status}</td>
                <td style={{ padding: '10px' }}>{new Date(drop.created_at || '').toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BrandDashboard;
