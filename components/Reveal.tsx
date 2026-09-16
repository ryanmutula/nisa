'use client';

/* ═══════════════════════════════════════════════════════════════════
   Scroll choreography.

   One watcher for the whole page: every [data-r] group gets `data-in`
   once it has risen into view, and the [data-s] children inside it
   stagger in behind it. That is the same arrangement the old site.js
   had, with three changes:

   · it reveals on a measured position rather than an IntersectionObserver,
     because the observer is throttled or inert in some embedded contexts
     and a reveal that never fires must never be why copy is invisible;
   · a MutationObserver picks up whatever React renders next, so a filtered
     shelf or a freshly routed page animates the same as the first paint;
   · anything still hidden after four seconds is shown regardless.
   ═══════════════════════════════════════════════════════════════════ */

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const IN = 'data-in';

export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const doc = document.documentElement;
    doc.classList.add('js-reveal');

    let queued = false;
    let bail: ReturnType<typeof setTimeout>;

    function showAll() {
      document.querySelectorAll('[data-r]').forEach((n) => n.setAttribute(IN, '1'));
    }

    function scan() {
      queued = false;
      const edge = innerHeight * 0.94;
      document.querySelectorAll(`[data-r]:not([${IN}])`).forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.top < edge && r.bottom > 0) n.setAttribute(IN, '1');
      });
    }

    function queue() {
      if (queued) return;
      queued = true;
      setTimeout(scan, 16);
    }

    scan();
    /* Anything already on screen at load should be in before the first
       frame; anything added a tick later still gets caught. */
    requestAnimationFrame(scan);

    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);

    const mo = new MutationObserver(queue);
    mo.observe(document.body, { childList: true, subtree: true });

    bail = setTimeout(showAll, 4000);

    return () => {
      removeEventListener('scroll', queue);
      removeEventListener('resize', queue);
      mo.disconnect();
      clearTimeout(bail);
    };
  }, [pathname]);

  return null;
}
