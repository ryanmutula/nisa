'use client';

/* ── transition safety ───────────────────────────────────────────────
   A CSS transition only reaches its end value if the document timeline
   advances. Where it does not, getComputedStyle returns the START value
   forever, so anything whose visible state is reached via a transition
   never appears. `no-anim` is set on <html> before first paint and taken
   off here only once the timeline is measured advancing, so every end
   state is applied instantly unless animation is known to work. */

import { useEffect } from 'react';

export default function Transitions() {
  useEffect(() => {
    function now() {
      try {
        return Number(document.timeline?.currentTime) || 0;
      } catch {
        return 0;
      }
    }
    const before = now();
    const timer = setTimeout(() => {
      if (now() > before) document.documentElement.classList.remove('no-anim');
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
