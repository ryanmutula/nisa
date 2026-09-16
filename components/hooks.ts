'use client';

/* Small shared hooks. Each one starts at a server-safe value and settles
   on the truth after mount, so the first client render always matches the
   markup the server sent. */

import { useEffect, useState } from 'react';

/** Matches a media query, reactively. False until mounted. */
export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = matchMedia(query);
    setMatches(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** The same test the old site.js used to decide phone from desk. */
export function useIsPhone(): boolean {
  const narrow = useMedia('(max-width: 720px)');
  const coarse = useMedia('(pointer: coarse) and (max-width: 1024px)');
  return narrow || coarse;
}

export function useReducedMotion(): boolean {
  return useMedia('(prefers-reduced-motion: reduce)');
}

/** True once the component has mounted in the browser. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** How far down the page we are, in pixels. Throttled to a frame. */
export function useScrollY(): number {
  const [y, setY] = useState(0);

  useEffect(() => {
    let queued = false;
    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        setY(scrollY);
      });
    }
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return y;
}
