'use client';

/* Search: a house, a note, a name. It reads the catalogue in the browser,
   so there is no request to wait for and no query leaves the device. */

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { asset, haystack, products } from '@/lib/catalog';
import { productUrl, routes } from '@/lib/routes';

import { Dialog } from '../Sheet';
import { useStore } from '../store';

export default function SearchSheet() {
  const { overlay, closeOverlay, money } = useStore();
  const [q, setQ] = useState('');
  const open = overlay === 'search';

  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return products.filter((p) => haystack(p).includes(needle)).slice(0, 8);
  }, [q]);

  return (
    <Dialog open={open} onClose={closeOverlay} label="Search" width="min(680px,92vw)">
      <div style={{ padding: 28 }}>
        <label className="hp" htmlFor="sq">
          Search
        </label>
        <input
          className="in"
          id="sq"
          placeholder="A house, a note, a name…"
          autoComplete="off"
          aria-label="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div
          id="sr"
          style={{ marginTop: 18, maxHeight: '52vh', overflow: 'auto' }}
          aria-live="polite"
        >
          {hits.length
            ? hits.map((p) => (
                <Link
                  key={p.id}
                  href={productUrl(p.id)}
                  onClick={closeOverlay}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '48px 1fr auto',
                    gap: 14,
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--rule)',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(p.thumb)}
                    alt=""
                    style={{ width: 48, height: 56, objectFit: 'contain' }}
                  />
                  <span>
                    <span className="small muted">{p.brand}</span>
                    <br />
                    <strong
                      style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 400 }}
                    >
                      {p.name}
                    </strong>
                  </span>
                  <span className="num small">{money(p.sizes[0].price)}</span>
                </Link>
              ))
            : q.trim() && (
                <p className="muted">
                  Nothing under that name.{' '}
                  <Link href={routes.shop} onClick={closeOverlay}>
                    Browse everything
                  </Link>
                  .
                </p>
              )}
        </div>
      </div>
    </Dialog>
  );
}
