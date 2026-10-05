'use client';

/* One bottle, in full: the packshot, the notes, the sizes, the price and
   the two buttons that matter. The parts that need the visitor's chosen
   currency or their saved list are why this is a client component; the
   copy around it is rendered on the server. */

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { HeartFullIcon, HeartIcon, ScalesIcon } from '@/components/icons';
import NotePyramid from '@/components/NotePyramid';
import { useStore } from '@/components/store';
import { asset, hasArt } from '@/lib/catalog';
import { config } from '@/lib/config';
import { deliveryMarkets } from '@/lib/money';
import { shopUrl, whatsAppUrl } from '@/lib/routes';
import type { Product } from '@/lib/types';

export default function ProductDetail({ product: p }: { product: Product }) {
  const { money, ready, addToBag, isSaved, toggleSaved, compare, toggleCompare, noteSeen } =
    useStore();
  const [ml, setMl] = useState(p.sizes[0].ml);
  const [qty, setQty] = useState(1);

  /* Remember it for "where you left off". */
  useEffect(() => {
    noteSeen(p.id);
  }, [p.id, noteSeen]);

  const size = p.sizes.find((s) => s.ml === ml) ?? p.sizes[0];
  const savedOn = ready && isSaved(p.id);
  const comparing = compare.includes(p.id);

  const availability = (p.availability ?? [])
    .map((code) => {
      const m = deliveryMarkets().find((x) => x.code === code);
      return m ? `${m.flag} ${m.country}` : code;
    })
    .join(' · ');

  return (
    <div className="pdp">
      <div className="gal" data-r="scale">
        <div className="main">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(p.image)}
            alt={`${p.brand} ${p.name} bottle`}
            width={1000}
            height={1000}
            fetchPriority="high"
          />
        </div>
        <p className="small muted">
          {hasArt(p)
            ? 'Official packshot, supplied by the house.'
            : 'Photography for this bottle is on its way. Everything else on this page is final — call or WhatsApp us and we will describe it.'}
        </p>
      </div>

      <div data-r>
        <div
          className="house"
          data-s="1"
          style={{
            fontSize: 11,
            letterSpacing: '.17em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-700)'
          }}
        >
          <Link
            href={shopUrl({ brand: p.brandSlug })}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {p.brand}
          </Link>
        </div>

        <h1 className="d2" style={{ margin: '4px 0 6px' }} data-s="2">
          {p.name}
        </h1>

        <p className="it muted" data-s="2">
          {p.concentration} ·{' '}
          <Link href={shopUrl({ family: p.family })} style={{ color: 'inherit' }}>
            {p.familyLabel}
          </Link>{' '}
          · {p.gender}
        </p>

        <p className="lead" style={{ marginTop: 'var(--space-4)' }} data-s="3">
          {p.description}
        </p>

        <div data-s="4">
          <NotePyramid notes={p.notes} />
        </div>

        <div className="pills" data-s="5">
          {p.sizes.map((s) => (
            <button
              key={s.ml}
              type="button"
              aria-pressed={s.ml === size.ml}
              onClick={() => setMl(s.ml)}
            >
              {s.ml}ml · {money(s.price)}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
            margin: 'var(--space-6) 0 var(--space-4)'
          }}
          data-s="5"
        >
          <span className="d2 num">{money(size.price)}</span>
          <span className="small muted">
            incl. duty ·{' '}
            {size.price >= config.freeDeliveryOver
              ? 'free delivery'
              : `delivery from ${money(config.deliveryFlat)}`}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }} data-s="6">
          <div className="qty" style={{ height: 48 }}>
            <button
              type="button"
              aria-label="One fewer"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="num" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              aria-label="One more"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
            >
              +
            </button>
          </div>

          <button
            className="b fill"
            type="button"
            style={{ flex: 1, minWidth: 200 }}
            onClick={(e) => addToBag(p.id, size.ml, qty, e.currentTarget)}
          >
            <span>Add to bag</span>
          </button>

          <button
            className="ib cmp-b"
            type="button"
            aria-pressed={savedOn}
            aria-label={savedOn ? 'Remove from your saved list' : 'Save this fragrance'}
            style={{
              width: 48,
              height: 48,
              color: savedOn ? 'var(--color-accent-700)' : undefined
            }}
            onClick={() => toggleSaved(p.id)}
          >
            {savedOn ? <HeartFullIcon /> : <HeartIcon />}
          </button>

          <button
            className="ib cmp-b"
            type="button"
            aria-pressed={comparing}
            aria-label="Add to compare"
            title="Compare"
            style={{ width: 48, height: 48 }}
            onClick={() => toggleCompare(p.id)}
          >
            <ScalesIcon />
          </button>
        </div>

        <p className="small muted" style={{ marginTop: 'var(--space-4)' }}>
          Two 2ml samples travel with every order. Stocked for: {availability}.
        </p>

        <div className="note" style={{ marginTop: 'var(--space-4)' }}>
          Prefer to buy over WhatsApp?{' '}
          <a
            href={whatsAppUrl(config.phoneRaw, `Hello Nisa — is ${p.brand} ${p.name} in stock?`)}
            target="_blank"
            rel="noopener"
          >
            Ask about this bottle
          </a>
          .
        </div>
      </div>
    </div>
  );
}
