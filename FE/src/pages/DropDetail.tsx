import React, { useEffect, useState } from 'react';
import { getDrop, updateDrop } from '../components/useDrops';

export default function DropDetail({ id }: { id: string }) {
  const [drop, setDrop] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDrop();
    // eslint-disable-next-line
  }, [id]);

  async function fetchDrop() {
    setLoading(true);
    try {
      const data = await getDrop(id);
      setDrop(data);
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
      await updateDrop(id, form);
      setEdit(false);
      fetchDrop();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!drop) return <div>Drop not found</div>;

  return (
    <div>
      <h2>Drop Detail</h2>
      {edit ? (
        <form onSubmit={handleUpdate}>
          <input value={form.brand_id} onChange={e => setForm((f: any) => ({ ...f, brand_id: e.target.value }))} />
          <input value={form.product_link} onChange={e => setForm((f: any) => ({ ...f, product_link: e.target.value }))} />
          <input type="number" value={form.quantity} onChange={e => setForm((f: any) => ({ ...f, quantity: Number(e.target.value) }))} />
          <input value={form.template_id} onChange={e => setForm((f: any) => ({ ...f, template_id: e.target.value }))} />
          <select value={form.status} onChange={e => setForm((f: any) => ({ ...f, status: e.target.value }))}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
          <button type="submit" disabled={loading}>Save</button>
        </form>
      ) : (
        <div>
          <div>ID: {drop.id}</div>
          <div>Brand: {drop.brand_id}</div>
          <div>Product Link: {drop.product_link}</div>
          <div>Quantity: {drop.quantity}</div>
          <div>Status: {drop.status}</div>
          <button onClick={() => setEdit(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}
