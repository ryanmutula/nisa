'use client';

/* ═══════════════════════════════════════════════════════════════════
   The shelf: the family strip, the house directory, the filter column
   and the grid, all reading one piece of state.

   The state is the URL. Arriving at /shop?brand=nishane&tag=bestseller shows
   that selection, and every click rewrites the address with
   history.replaceState — so a filtered shelf can be sent to someone, and
   the back button still means "the page before", not "one filter ago".
   ═══════════════════════════════════════════════════════════════════ */

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Shelf from '@/components/Shelf';
import { useStore } from '@/components/store';
import { brandOf, brands, countInFamily, families, products } from '@/lib/catalog';
import { deliveryMarkets } from '@/lib/money';
import { routes } from '@/lib/routes';
import type { Product } from '@/lib/types';

type MultiKey = 'brand' | 'family' | 'gender' | 'tag';

interface State {
  brand: string[];
  family: string[];
  gender: string[];
  tag: string[];
  market: string;
  max: number;
  sort: string;
}

const SORTS: [string, string][] = [
  ['feat', 'Featured'],
  ['new', 'Newest in'],
  ['low', 'Price · low to high'],
  ['high', 'Price · high to low'],
  ['az', 'A–Z']
];

const CHARACTER = ['bestseller', 'signature', 'new', 'oud', 'gourmand', 'fresh', 'value', 'rare'];
const PRICE_STEPS = [0, 15000, 25000, 40000];

const SORTERS: Record<string, (a: Product, b: Product) => number> = {
  low: (a, b) => a.sizes[0].price - b.sizes[0].price,
  high: (a, b) => b.sizes[0].price - a.sizes[0].price,
  az: (a, b) => `${a.brand}${a.name}`.localeCompare(`${b.brand}${b.name}`),
  new: (a, b) =>
    Number((b.tags ?? []).includes('new')) - Number((a.tags ?? []).includes('new')),
  feat: (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
};

function count(fn: (p: Product) => boolean): number {
  return products.filter(fn).length;
}

export default function ShopBrowser() {
  const params = useSearchParams();
  const { money } = useStore();

  const [state, setState] = useState<State>(() => ({
    brand: [
      ...params.getAll('brand'),
      ...(params.get('brands') ?? '').split(',').filter(Boolean)
    ],
    family: params.getAll('family'),
    gender: params.getAll('gender'),
    tag: params.getAll('tag'),
    market: params.get('market') ?? '',
    max: Number(params.get('max')) || 0,
    sort: params.get('sort') ?? 'feat'
  }));

  /* Following a link from the footer or the advisor changes the query
     while this component stays mounted; pick the new selection up. */
  const search = params.toString();
  useEffect(() => {
    const q = new URLSearchParams(search);
    setState({
      brand: [...q.getAll('brand'), ...(q.get('brands') ?? '').split(',').filter(Boolean)],
      family: q.getAll('family'),
      gender: q.getAll('gender'),
      tag: q.getAll('tag'),
      market: q.get('market') ?? '',
      max: Number(q.get('max')) || 0,
      sort: q.get('sort') ?? 'feat'
    });
  }, [search]);

  const list = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        (!state.brand.length || state.brand.includes(p.brandSlug)) &&
        (!state.family.length || state.family.includes(p.family)) &&
        (!state.gender.length || state.gender.includes(p.gender)) &&
        (!state.tag.length || state.tag.some((t) => (p.tags ?? []).includes(t))) &&
        (!state.market || (p.availability ?? []).includes(state.market)) &&
        (!state.max || p.sizes.some((s) => s.price <= state.max))
    );
    return filtered.slice().sort(SORTERS[state.sort] ?? SORTERS.feat);
  }, [state]);

  /* Keep the address bar honest, without adding history entries. */
  useEffect(() => {
    const qs = new URLSearchParams();
    (['brand', 'family', 'gender', 'tag'] as MultiKey[]).forEach((k) =>
      state[k].forEach((v) => qs.append(k, v))
    );
    if (state.market) qs.set('market', state.market);
    if (state.max) qs.set('max', String(state.max));
    if (state.sort !== 'feat') qs.set('sort', state.sort);
    const next = `${routes.shop}${qs.toString() ? `?${qs}` : ''}`;
    if (next !== location.pathname + location.search) {
      history.replaceState(null, '', next);
    }
  }, [state]);

  const toggle = useCallback((key: MultiKey, value: string) => {
    setState((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value]
    }));
  }, []);

  const clear = () =>
    setState({ brand: [], family: [], gender: [], tag: [], market: '', max: 0, sort: 'feat' });

  const singleHouse = state.brand.length === 1 ? brandOf(state.brand[0]) : undefined;

  const group = (
    title: string,
    key: MultiKey,
    opts: { v: string; l: string; n: number }[]
  ) => (
    <div className="fgroup" key={key}>
      <h4>{title}</h4>
      {opts.map((o) => (
        <label key={o.v}>
          <input
            type="checkbox"
            checked={state[key].includes(o.v)}
            onChange={() => toggle(key, o.v)}
          />
          <span>{o.l}</span>
          <span className="muted small" style={{ marginLeft: 'auto' }}>
            {o.n}
          </span>
        </label>
      ))}
    </div>
  );

  return (
    <>
      {/* family strip */}
      <div className="wrap">
        <div className="fams" data-r>
          {families.map((f) => {
            const on = state.family.includes(f.slug);
            return (
              <button
                className="fam-tile"
                type="button"
                key={f.slug}
                aria-pressed={on}
                style={on ? { background: 'var(--ink)', color: '#efece6' } : undefined}
                onClick={() => toggle('family', f.slug)}
              >
                <span className="d3">{f.label}</span>
                <span className="c">{countInFamily(f.slug)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* house directory */}
      <section className="wrap band" style={{ paddingBlock: 'clamp(40px,6vw,80px)' }}>
        <p className="kicker" data-r>
          The houses
        </p>
        <div className="houses" data-r>
          {brands.map((b) => (
            <button
              className="house-b"
              type="button"
              key={b.slug}
              aria-pressed={state.brand.includes(b.slug)}
              onClick={() => toggle('brand', b.slug)}
            >
              <span className="n">{b.name}</span>
              <span className="o">{b.origin}</span>
            </button>
          ))}
        </div>
        {singleHouse && (
          <div
            style={{
              border: '1px solid var(--rule)',
              borderTop: 0,
              padding: 'var(--space-6) var(--space-4)'
            }}
          >
            <div className="split" style={{ alignItems: 'start', gap: 'var(--space-8)' }}>
              <div>
                <h3 className="d3">{singleHouse.name}</h3>
                <p className="small muted">
                  {singleHouse.origin} · est. {singleHouse.founded} ·{' '}
                  <span className="it">{singleHouse.tagline}</span>
                </p>
              </div>
              <p className="muted" style={{ margin: 0 }}>
                {singleHouse.blurb}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="wrap" style={{ paddingBottom: 'clamp(64px,9vw,120px)' }}>
        <div className="shop-lay">
          <aside className="filters" aria-label="Filters">
            {group('Wear', 'gender', [
              { v: 'women', l: 'Women', n: count((p) => p.gender === 'women') },
              { v: 'men', l: 'Men', n: count((p) => p.gender === 'men') },
              { v: 'unisex', l: 'Unisex', n: count((p) => p.gender === 'unisex') }
            ])}

            {group(
              'Family',
              'family',
              families.map((f) => ({ v: f.slug, l: f.label, n: countInFamily(f.slug) }))
            )}

            {group(
              'Character',
              'tag',
              CHARACTER.map((t) => ({
                v: t,
                l: t.charAt(0).toUpperCase() + t.slice(1),
                n: count((p) => (p.tags ?? []).includes(t))
              }))
            )}

            <div className="fgroup">
              <h4>Price</h4>
              {PRICE_STEPS.map((v) => (
                <label key={v}>
                  <input
                    type="radio"
                    name="fmax"
                    checked={state.max === v}
                    onChange={() => setState((prev) => ({ ...prev, max: v }))}
                  />
                  <span>{v ? `Under ${money(v)}` : 'Any price'}</span>
                </label>
              ))}
            </div>

            <div className="fgroup">
              <h4>
                <label htmlFor="f-market">In stock for</label>
              </h4>
              <select
                className="in"
                id="f-market"
                value={state.market}
                onChange={(e) => setState((prev) => ({ ...prev, market: e.target.value }))}
              >
                <option value="">Any market</option>
                {deliveryMarkets().map((m) => (
                  <option key={m.code} value={m.code}>
                    {m.flag} {m.country}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          <div>
            <div className="shop-bar">
              <span className="muted small" aria-live="polite">
                {list.length} of {products.length} fragrances
              </span>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <label className="small muted" htmlFor="sort">
                  Sort
                </label>
                <select
                  className="cur-sel"
                  id="sort"
                  value={state.sort}
                  onChange={(e) => setState((prev) => ({ ...prev, sort: e.target.value }))}
                >
                  {SORTS.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
                <button className="b sm" type="button" onClick={clear}>
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {list.length ? (
              <Shelf products={list} />
            ) : (
              <div className="empty">
                <h3 className="d3">Nothing matches that combination.</h3>
                <p className="muted">
                  Loosen one filter, or{' '}
                  <button
                    className="lnk"
                    type="button"
                    style={{ background: 'none', border: 0, cursor: 'pointer' }}
                    onClick={clear}
                  >
                    start again
                  </button>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
