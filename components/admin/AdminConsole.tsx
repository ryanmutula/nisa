'use client';

/* Which of the two the admin page is showing: the door, or the desk. */

import { useCallback, useEffect, useState } from 'react';

import '@/styles/admin.css';

import Dashboard from './Dashboard';
import LoginGate from './LoginGate';

export default function AdminConsole() {
  const [state, setState] = useState<{ signedIn: boolean; configured: boolean } | null>(null);

  const check = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/session', { cache: 'no-store' });
      setState((await res.json()) as { signedIn: boolean; configured: boolean });
    } catch {
      setState({ signedIn: false, configured: true });
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  if (!state) {
    return (
      <div className="adm">
        <div className="adm-gate">
          <p className="muted">One moment…</p>
        </div>
      </div>
    );
  }

  if (!state.signedIn) {
    return (
      <div className="adm">
        <LoginGate configured={state.configured} onSignedIn={check} />
      </div>
    );
  }

  return <Dashboard onSignedOut={() => setState({ ...state, signedIn: false })} />;
}
