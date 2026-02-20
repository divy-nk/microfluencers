import React, { useEffect, useState } from 'react';

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/metrics')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch metrics');
        return res.text();
      })
      .then(setMetrics)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Prometheus Metrics</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <pre style={{ background: '#222', color: '#0f0', padding: 16, borderRadius: 8, overflowX: 'auto' }}>{metrics}</pre>
    </div>
  );
}
