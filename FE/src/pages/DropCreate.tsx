import React, { useState } from 'react';
import { createDrop } from '../components/useDrops';

export default function DropCreate({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState({
    brand_id: '',
    product_link: '',
    quantity: 1,
    template_id: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createDrop(form);
      setForm({ brand_id: '', product_link: '', quantity: 1, template_id: '', status: 'draft' });
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Drop</h3>
      <input placeholder="Brand ID" value={form.brand_id} onChange={e => setForm(f => ({ ...f, brand_id: e.target.value }))} required />
      <input placeholder="Product Link" value={form.product_link} onChange={e => setForm(f => ({ ...f, product_link: e.target.value }))} required />
      <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))} required />
      <input placeholder="Template ID" value={form.template_id} onChange={e => setForm(f => ({ ...f, template_id: e.target.value }))} />
      <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="closed">Closed</option>
      </select>
      <button type="submit" disabled={loading}>Create</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}
