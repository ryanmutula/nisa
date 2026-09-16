'use client';

/* The campaign pair: three portrait frames, each with its own gentler
   push-in as it passes. */

import { useEffect, useRef } from 'react';

import { useReducedMotion } from '../hooks';

const FRAMES = [
  {
    src: '/assets/img/editorial/walk.webp',
    alt: 'Two women walking in oversized black tailoring',
    caption: 'For her — the black suit edit'
  },
  {
    src: '/assets/img/editorial/spray.webp',
    alt: 'A man applying fragrance to his neck, the mist caught in the light',
    caption: 'For him — the first spray of the day'
  },
  {
    src: '/assets/img/editorial/campaign-pair.webp',
    alt: 'Two women in ivory tailoring, one holding a glass perfume bottle',
    caption: 'Together — the ivory edit'
  }
];

export default function CampaignPair() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = wrapRef.current;
    if (!root) return;
    const frames = Array.from(root.querySelectorAll<HTMLElement>('.pair-img'));
    if (!frames.length) return;
    let queued = false;

    function push() {
      queued = false;
      frames.forEach((n) => {
        const r = n.getBoundingClientRect();
        const span = r.height + innerHeight;
        const p = Math.max(0, Math.min(1, (innerHeight - r.top) / span));
        const img = n.firstElementChild as HTMLElement | null;
        if (img) img.style.transform = `scale(${1.04 + p * 0.12})`;
      });
    }
    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(push);
    }

    push();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  return (
    <section className="band wrap">
      <div data-r style={{ maxWidth: '36ch' }}>
        <p className="kicker">The campaign</p>
        <h2 className="d2">Worn in black, worn in white.</h2>
      </div>
      <div className="pair" ref={wrapRef} style={{ marginTop: 'var(--space-8)' }}>
        {FRAMES.map((f) => (
          <figure className="pair-f" key={f.src} data-r="clip">
            <div className="pair-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.src} alt={f.alt} loading="lazy" />
            </div>
            <figcaption>{f.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
