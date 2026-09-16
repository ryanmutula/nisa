'use client';

/* Three rooms, one chain: a slow cross-fade with a drift, a hairline
   that fills while each scene holds, and dots to jump between them.
   Hovering the frame stops the clock. */

import { useCallback, useEffect, useRef, useState } from 'react';

import { useReducedMotion } from '../hooks';

const SCENES = [
  {
    img: '/assets/img/editorial/stockroom.webp',
    t: 'Checked against the list',
    c: 'Every carton is opened at the Nairobi holding and counted against its packing list before it moves again.'
  },
  {
    img: '/assets/img/editorial/boutique.webp',
    t: 'On the right shelf',
    c: 'Stockists across five markets, quoted landed and supplied from one place instead of four.'
  },
  {
    img: '/assets/img/editorial/counter.webp',
    t: 'Tried before it is bought',
    c: 'Blotters first, bottle second. Two samples travel with every order for the same reason.'
  }
];

const HOLD_MS = 7000;

export default function HouseAtWork() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => {
    stop();
    if (reduced || paused) return;
    timer.current = setInterval(() => setI((v) => (v + 1) % SCENES.length), HOLD_MS);
    return stop;
  }, [reduced, paused, i, stop]);

  return (
    <div
      className="show"
      data-r="clip"
      style={{ marginTop: 'var(--space-8)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="show-stage">
        {SCENES.map((s, n) => (
          <div className={`show-slide${n === i ? ' on' : ''}`} key={s.img}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt={s.t} loading="lazy" />
            <div className="show-cap">
              <p>
                <span className="t">{s.t}</span>
                {s.c}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="show-rail" role="tablist" aria-label="Choose a scene">
        {SCENES.map((s, n) => (
          <button
            key={s.img}
            type="button"
            role="tab"
            aria-current={n === i}
            aria-selected={n === i}
            aria-label={s.t}
            onClick={() => setI(n)}
          >
            {/* The fill animation is keyed so it restarts on every change. */}
            <span key={`${n}-${i}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
