'use client';

/* The one-line confirmation that slides up from the bottom. */

import { useStore } from './store';

export default function Toast() {
  const { toast } = useStore();
  return (
    <div className={`toast${toast ? ' on' : ''}`} role="status" aria-live="polite">
      {toast}
    </div>
  );
}
