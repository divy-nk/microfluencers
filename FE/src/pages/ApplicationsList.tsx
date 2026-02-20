import React from 'react';
import { useApplications } from '../components/useApplications';

export default function ApplicationsList() {
  const { applications, loading, error, refresh } = useApplications();

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Applications</h2>
      <button onClick={refresh}>Refresh</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Drop</th>
            <th>Creator</th>
            <th>Status</th>
            <th>Approval</th>
            <th>Payout</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.drop_id}</td>
              <td>{app.creator_id}</td>
              <td>{app.status}</td>
              <td>{app.approval_status}</td>
              <td>{app.payout_status}</td>
              <td>{/* TODO: Link to detail/edit */}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* TODO: Add create button */}
    </div>
  );
}
