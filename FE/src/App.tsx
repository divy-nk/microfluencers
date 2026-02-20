

import { useState } from 'react';
import { useAuth } from './auth';
import AppRouter from './AppRouter';

function App() {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (loading) return <div>Loading...</div>;


  if (!user) {
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

        {/* Background Gradients */}
        <div className="animate-blob" style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', backgroundColor: 'rgba(147, 51, 234, 0.2)', borderRadius: '50%', filter: 'blur(120px)', mixBlendMode: 'screen' }}></div>
        <div className="animate-blob animation-delay-2000" style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', backgroundColor: 'rgba(37, 99, 235, 0.1)', borderRadius: '50%', filter: 'blur(120px)', mixBlendMode: 'screen' }}></div>

        {/* Floating Nav Pill (Mocked for visual sync) */}
        <nav style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', padding: '12px 24px', backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '9999px', zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 10px rgba(34,197,94,0.5)' }}></span>
            <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-outfit)', fontWeight: 700, color: 'white', letterSpacing: '-0.025em' }}>
              brandklip.app
            </span>
          </div>
        </nav>

        {/* Login Card */}
        <div className="glass-card animate-fade-in" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center' }}>

          <h2 style={{ marginBottom: '8px', fontSize: '2rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '32px', fontFamily: 'var(--font-inter)' }}>Sign in to access your dashboard.</p>

          <form
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              try {
                await signIn(email, password);
              } catch (err: any) {
                setError(err.message);
              }
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ textAlign: 'left' }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <button type="submit" style={{ width: '100%', marginTop: '8px', padding: '12px' }}>
              Sign In
            </button>

            {error && (
              <div style={{ color: '#ef4444', marginTop: '16px', fontSize: '0.875rem', padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  // If user is logged in, show the router (role-based dashboards)
  return <AppRouter />;
}

export default App;
