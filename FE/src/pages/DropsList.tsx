import React from 'react';
import { useDrops } from '../components/useDrops';

export default function DropsList() {
  const { drops, loading, error, refresh } = useDrops();

  if (loading) return <div>Loading drops...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Drops</h2>
      <button onClick={refresh}>Refresh</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Product Link</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drops.map(drop => (
            <tr key={drop.id}>
              <td>{drop.id}</td>
              <td>{drop.brand_id}</td>
              <td>{drop.product_link}</td>
              <td>{drop.quantity}</td>
              <td>{drop.status}</td>
              <td>
                {/* TODO: Link to detail/edit */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* TODO: Add create button */}
    </div>
  );
}
