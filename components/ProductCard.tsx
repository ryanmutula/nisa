'use client';

/* One bottle on the shelf. The same markup the old cardHTML() produced,
   so every rule in the stylesheet — the plate, the hover push, the
   chromatic flicker, the tools that fade in — still applies. */

import Link from 'next/link';
import { useState } from 'react';

import { asset } from '@/lib/catalog';
import { productUrl } from '@/lib/routes';
import type { Product } from '@/lib/types';

import { EyeIcon, HeartFullIcon, HeartIcon, ScalesIcon } from './icons';
import { useStore } from './store';

export default function ProductCard({ product: p }: { product: Product }) {
  const { money, ready, addToBag, isSaved, toggleSaved, compare, toggleCompare, openQuickView } =
    useStore();
  const [ml, setMl] = useState(p.sizes[0].ml);

  const size = p.sizes.find((s) => s.ml === ml) ?? p.sizes[0];
  const tag = (p.tags ?? [])[0];
  const savedOn = ready && isSaved(p.id);
  const comparing = compare.includes(p.id);
  const label = `${p.brand} ${p.name}`;

  return (
    <article className="card" data-id={p.id}>
      <span className="flag">{tag ?? ''}</span>

      <div className="card-tools">
        <button
          className="ib"
          type="button"
          aria-pressed={savedOn}
          aria-label={savedOn ? `Remove ${p.name} from your saved list` : `Save ${p.name}`}
          style={savedOn ? { color: 'var(--color-accent-700)' } : undefined}
          onClick={() => toggleSaved(p.id)}
        >
          {savedOn ? <HeartFullIcon /> : <HeartIcon />}
        </button>
        <button
          className="ib"
          type="button"
          aria-label={`Quick view ${p.name}`}
          onClick={() => openQuickView(p.id)}
        >
          <EyeIcon />
        </button>
      </div>

      <Link className="ph" href={productUrl(p.id)} aria-label={label}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(p.thumb || p.image)} alt={`${label} bottle`} loading="lazy" />
      </Link>

      <div className="house">{p.brand}</div>
      <h3>
        <Link href={productUrl(p.id)} style={{ textDecoration: 'none', color: 'inherit' }}>
          {p.name}
        </Link>
      </h3>
      <div className="fam muted">{p.familyLabel}</div>

      <div className="pills">
        {p.sizes.map((s) => (
          <button
            key={s.ml}
            type="button"
            aria-pressed={s.ml === ml}
            aria-label={`${s.ml} millilitres`}
            onClick={() => setMl(s.ml)}
          >
            {s.ml}ml
          </button>
        ))}
      </div>

      <div className="price">
        <span className="d3 num">{money(size.price)}</span>
      </div>

      <div className="row">
        <button
          className="b sm"
          type="button"
          onClick={(e) => addToBag(p.id, ml, 1, e.currentTarget)}
        >
          <span>Add to bag</span>
        </button>
        <button
          className="ib cmp-b"
          type="button"
          aria-pressed={comparing}
          aria-label={`Compare ${p.name}`}
          title="Compare"
          onClick={() => toggleCompare(p.id)}
        >
          <ScalesIcon />
        </button>
      </div>
    </article>
  );
}
