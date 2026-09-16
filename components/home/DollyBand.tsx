'use client';

/* The dolly zoom: the frame pushes in as the band passes while the copy
   holds still, so the room appears to move around the reader. */

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { shopUrl } from '@/lib/routes';

import { useReducedMotion } from '../hooks';

export default function DollyBand() {
  const imgRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const node = imgRef.current;
    const band = node?.parentElement;
    if (!node || !band) return;
    let queued = false;

    function push() {
      queued = false;
      const r = band!.getBoundingClientRect();
      const span = r.height + innerHeight;
      const p = Math.max(0, Math.min(1, (innerHeight - r.top) / span));
      node!.style.transform = `scale(${1.02 + p * 0.16}) translateY(${(p - 0.5) * -26}px)`;
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
      node.style.transform = '';
    };
  }, [reduced]);

  return (
    <section className="dolly" id="ritual">
      <div className="dolly-img" ref={imgRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/img/editorial/ritual.webp"
          alt="A woman at the moment of applying fragrance to her throat"
        />
      </div>
      <div className="dolly-veil" />
      <div className="dolly-in">
        <div className="wrap">
          <div className="dolly-copy" data-r>
            <p className="kicker" data-s="1">
              The first thirty seconds
            </p>
            <h2 className="d2" data-s="2">
              You do not read a
              <br />
              fragrance. You wear it.
            </h2>
            <p className="lead muted" data-s="3" style={{ marginTop: 'var(--space-4)' }}>
              Which is why every order leaves here with two samples chosen to sit beside what you
              bought — so the next bottle is a decision, not a gamble.
            </p>
            <div style={{ marginTop: 'var(--space-6)' }} data-s="4">
              <Link className="b gold" href={shopUrl({ tag: 'signature' })}>
                <span>Signature scents</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
