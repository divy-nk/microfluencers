import React, { useEffect, useState } from 'react';
import { getApplication, updateApplication } from '../components/useApplications';

export default function ApplicationDetail({ id }: { id: string }) {
  const [application, setApplication] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplication();
    // eslint-disable-next-line
  }, [id]);

  async function fetchApplication() {
    setLoading(true);
    try {
      const data = await getApplication(id);
      setApplication(data);
      setForm(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateApplication(id, form);
      setEdit(false);
      fetchApplication();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!application) return <div>Application not found</div>;

  return (
    <div>
      <h2>Application Detail</h2>
      {edit ? (
        <form onSubmit={handleUpdate}>
          <input value={form.drop_id} onChange={e => setForm((f: any) => ({ ...f, drop_id: e.target.value }))} />
          <input value={form.creator_id} onChange={e => setForm((f: any) => ({ ...f, creator_id: e.target.value }))} />
          <select value={form.status} onChange={e => setForm((f: any) => ({ ...f, status: e.target.value }))}>
            <option value="applied">Applied</option>
            <option value="purchased">Purchased</option>
            <option value="uploaded">Uploaded</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
          <input value={form.order_id} onChange={e => setForm((f: any) => ({ ...f, order_id: e.target.value }))} />
          <input value={form.order_screenshot} onChange={e => setForm((f: any) => ({ ...f, order_screenshot: e.target.value }))} />
          <input value={form.video_url} onChange={e => setForm((f: any) => ({ ...f, video_url: e.target.value }))} />
          <select value={form.approval_status} onChange={e => setForm((f: any) => ({ ...f, approval_status: e.target.value }))}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={form.payout_status} onChange={e => setForm((f: any) => ({ ...f, payout_status: e.target.value }))}>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
          <button type="submit" disabled={loading}>Save</button>
        </form>
      ) : (
        <div>
          <div>ID: {application.id}</div>
          <div>Drop: {application.drop_id}</div>
          <div>Creator: {application.creator_id}</div>
          <div>Status: {application.status}</div>
          <div>Approval: {application.approval_status}</div>
          <div>Payout: {application.payout_status}</div>
          <button onClick={() => setEdit(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}
