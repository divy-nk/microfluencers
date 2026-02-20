import React, { useState } from 'react';
import { createApplication } from '../components/useApplications';

export default function ApplicationCreate({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState({
    drop_id: '',
    creator_id: '',
    status: 'applied',
    order_id: '',
    order_screenshot: '',
    video_url: '',
    approval_status: 'pending',
    payout_status: 'pending',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createApplication(form);
      setForm({ drop_id: '', creator_id: '', status: 'applied', order_id: '', order_screenshot: '', video_url: '', approval_status: 'pending', payout_status: 'pending' });
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Application</h3>
      <input placeholder="Drop ID" value={form.drop_id} onChange={e => setForm(f => ({ ...f, drop_id: e.target.value }))} required />
      <input placeholder="Creator ID" value={form.creator_id} onChange={e => setForm(f => ({ ...f, creator_id: e.target.value }))} required />
      <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
        <option value="applied">Applied</option>
        <option value="purchased">Purchased</option>
        <option value="uploaded">Uploaded</option>
        <option value="approved">Approved</option>
        <option value="paid">Paid</option>
        <option value="rejected">Rejected</option>
      </select>
      <input placeholder="Order ID" value={form.order_id} onChange={e => setForm(f => ({ ...f, order_id: e.target.value }))} />
      <input placeholder="Order Screenshot URL" value={form.order_screenshot} onChange={e => setForm(f => ({ ...f, order_screenshot: e.target.value }))} />
      <input placeholder="Video URL" value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} />
      <select value={form.approval_status} onChange={e => setForm(f => ({ ...f, approval_status: e.target.value }))}>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      <select value={form.payout_status} onChange={e => setForm(f => ({ ...f, payout_status: e.target.value }))}>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
        <option value="failed">Failed</option>
      </select>
      <button type="submit" disabled={loading}>Create</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}
