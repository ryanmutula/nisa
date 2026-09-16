'use client';

/* The door. One password, checked on the server; what comes back is a
   signed, httpOnly cookie, so nothing about the session is readable or
   forgeable from here. */

import Link from 'next/link';
import { useState } from 'react';

import { routes } from '@/lib/routes';

export default function LoginGate({
  configured,
  onSignedIn
}: {
  configured: boolean;
  onSignedIn: () => void;
}) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (body.ok) {
        setPassword('');
        onSignedIn();
        return;
      }
      setError(body.error ?? 'That password is not right.');
    } catch {
      setError('We could not reach the server. Try again in a moment.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adm-gate">
      <div className="adm-gate-in">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/img/brand/nisa-mark-dark.png" alt="Nisa Perfumes" />
        <p className="kicker" style={{ marginBottom: 'var(--space-2)' }}>
          The order desk
        </p>
        <h1 className="d3">Sign in.</h1>
        <p className="muted small" style={{ marginTop: 'var(--space-2)' }}>
          Every order placed on the site arrives here — what was bought, by whom, and where it is
          up to.
        </p>

        {configured ? (
          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="adm-pw">Password</label>
              <input
                className="in"
                id="adm-pw"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button
              className="b fill"
              type="submit"
              style={{ width: '100%' }}
              disabled={busy || !password}
            >
              <span>{busy ? 'Checking…' : 'Sign in'}</span>
            </button>
          </form>
        ) : (
          <p className="adm-err" style={{ marginTop: 'var(--space-6)' }}>
            No admin password is set on this server. Put <code>ADMIN_PASSWORD</code> and{' '}
            <code>ADMIN_SESSION_SECRET</code> in the environment (see <code>.env.example</code>) and
            restart.
          </p>
        )}

        <div aria-live="polite">{error && <p className="adm-err">{error}</p>}</div>

        <p style={{ marginTop: 'var(--space-6)', marginBottom: 0 }}>
          <Link className="lnk" href={routes.home}>
            Back to the shop
          </Link>
        </p>
      </div>
    </div>
  );
}
