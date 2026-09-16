'use client';

/* The hero: four bottles, a swatch beneath to swap between them, and a
   light drift on the packshot as the page moves. */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { asset, byId, products } from '@/lib/catalog';
import { productUrl } from '@/lib/routes';
import type { Product } from '@/lib/types';

import { useReducedMotion } from '../hooks';
import { useStore } from '../store';

const PICKS = ['amouage-interlude-man', 'pdm-layton', 'nishane-hacivat', 'amouage-oud-ulya'];

function heroBottles(): Product[] {
  const picks = PICKS.map((id) => byId(id)).filter((p): p is Product => Boolean(p));
  /* If one of the four has left the catalogue, fill the gap with a
     bestseller rather than showing three. */
  for (const p of products) {
    if (picks.length >= 4) break;
    if (!picks.includes(p) && (p.tags ?? []).includes('bestseller')) picks.push(p);
  }
  return picks.slice(0, 4);
}

export default function HeroStage() {
  const { money } = useStore();
  const reduced = useReducedMotion();
  const bottles = heroBottles();

  const [index, setIndex] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const shotRef = useRef<HTMLImageElement>(null);
  const swap = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showing = bottles[index];

  function choose(next: number) {
    if (next === index) return;
    if (reduced) {
      setIndex(next);
      return;
    }
    setSwapping(true);
    if (swap.current) clearTimeout(swap.current);
    swap.current = setTimeout(() => {
      setIndex(next);
      setSwapping(false);
    }, 260);
  }

  /* The packshot drifts against the scroll — the old data-par="0.05". */
  useEffect(() => {
    if (reduced) return;
    const node = shotRef.current;
    if (!node) return;
    let queued = false;

    function tick() {
      queued = false;
      const r = node!.getBoundingClientRect();
      const mid = r.top + r.height / 2 - innerHeight / 2;
      node!.style.transform = `translate3d(0,${mid * -0.05}px,0)`;
    }
    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(tick);
    }

    tick();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      node.style.transform = '';
    };
  }, [reduced]);

  useEffect(() => () => {
    if (swap.current) clearTimeout(swap.current);
  }, []);

  return (
    <div className="hero-stage" data-r="scale">
      <div className="hero-shotwrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={shotRef}
          className={`shot${swapping ? ' swap' : ''}`}
          src={asset(showing.image)}
          alt={`${showing.brand} ${showing.name} bottle`}
          width={1000}
          height={1000}
          fetchPriority="high"
        />
      </div>
      <div className="hero-foot">
        <div className="hero-meta muted">
          <Link href={productUrl(showing.id)} style={{ textDecoration: 'none', color: 'inherit' }}>
            {showing.brand} · {showing.name} ·{' '}
            <span className="num">{money(showing.sizes[0].price)}</span>
          </Link>
        </div>
        <div className="hero-swatch" role="group" aria-label="Choose a bottle">
          {bottles.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={i === index}
              aria-label={`${p.brand} ${p.name}`}
              onClick={() => choose(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(p.thumb)} alt="" width={52} height={62} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
