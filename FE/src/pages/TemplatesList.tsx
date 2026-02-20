import React from 'react';
import { useTemplates } from '../components/useTemplates';

export default function TemplatesList() {
  const { templates, loading, error, refresh } = useTemplates();

  if (loading) return <div>Loading templates...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Templates</h2>
      <button onClick={refresh}>Refresh</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(template => (
            <tr key={template.id}>
              <td>{template.id}</td>
              <td>{template.name}</td>
              <td>{template.description}</td>
              <td>{/* TODO: Link to detail/edit */}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* TODO: Add create button */}
    </div>
  );
}
