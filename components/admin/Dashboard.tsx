'use client';

/* ═══════════════════════════════════════════════════════════════════
   The order desk.

   Every order the shop takes lands here: the numbers along the top, the
   book below it, and one order opened to the side. Search matches a
   reference, a name, an email, a phone or a city; the chips filter by
   where an order is up to; and the whole book exports as CSV for whoever
   does the accounts.

   It polls once a minute so a desk left open stays current, and refreshes
   the moment the tab comes back to the front.
   ═══════════════════════════════════════════════════════════════════ */

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { formatKes } from '@/lib/money';
import { routes } from '@/lib/routes';
import { ORDER_STATUSES, type Order, type OrderStatus } from '@/lib/types';

import OrderDetail from './OrderDetail';
import StatusPill from './StatusPill';

type SortKey = 'placedAt' | 'total';

const OPEN: OrderStatus[] = ['new', 'confirmed', 'paid', 'packed', 'dispatched'];
const POLL_MS = 60_000;

function shortWhen(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function csv(orders: Order[]): string {
  const head = [
    'Reference',
    'Placed',
    'Status',
    'Name',
    'Email',
    'Phone',
    'City',
    'Country',
    'Payment',
    'Items',
    'Subtotal KES',
    'Discount KES',
    'Code',
    'Delivery KES',
    'Total KES'
  ];
  const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = orders.map((o) =>
    [
      o.ref,
      o.placedAt,
      o.status,
      `${o.customer.first_name} ${o.customer.last_name}`,
      o.customer.email,
      o.customer.phone,
      o.customer.city,
      o.customer.country,
      o.customer.payment,
      o.lines.map((l) => `${l.name} ${l.ml}ml x${l.q}`).join('; '),
      o.subtotal,
      o.discount,
      o.code,
      o.delivery,
      o.total
    ]
      .map(cell)
      .join(',')
  );
  return [head.map(cell).join(','), ...rows].join('\r\n');
}

export default function Dashboard({ onSignedOut }: { onSignedOut: () => void }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<OrderStatus | 'all' | 'open'>('all');
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({
    key: 'placedAt',
    desc: true
  });
  const [openRef, setOpenRef] = useState<string | null>(null);

  const load = useCallback(
    async (quiet = false) => {
      if (!quiet) setError('');
      try {
        const res = await fetch('/api/admin/orders', { cache: 'no-store' });
        if (res.status === 401) {
          onSignedOut();
          return;
        }
        const body = (await res.json()) as { ok?: boolean; orders?: Order[]; error?: string };
        if (body.ok && body.orders) {
          setOrders(body.orders);
          setError('');
        } else if (!quiet) {
          setError(body.error ?? 'The order book could not be read.');
        }
      } catch {
        if (!quiet) setError('We could not reach the server.');
      }
    },
    [onSignedOut]
  );

  useEffect(() => {
    load();
  }, [load]);

  /* A desk left open should not go stale, and coming back to the tab
     should show the truth immediately. */
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') load(true);
    }, POLL_MS);
    function onVisible() {
      if (document.visibilityState === 'visible') load(true);
    }
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load]);

  async function patch(ref: string, body: { status?: OrderStatus; note?: string }) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(ref)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.status === 401) {
        onSignedOut();
        return;
      }
      const result = (await res.json()) as { ok?: boolean; order?: Order; error?: string };
      if (result.ok && result.order) {
        setOrders((prev) =>
          (prev ?? []).map((o) => (o.ref === ref ? (result.order as Order) : o))
        );
      } else {
        setError(result.error ?? 'That change did not save.');
      }
    } catch {
      setError('We could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(ref: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(ref)}`, {
        method: 'DELETE'
      });
      if (res.status === 401) {
        onSignedOut();
        return;
      }
      const result = (await res.json()) as { ok?: boolean; error?: string };
      if (result.ok) {
        setOrders((prev) => (prev ?? []).filter((o) => o.ref !== ref));
        setOpenRef(null);
      } else {
        setError(result.error ?? 'That order could not be deleted.');
      }
    } catch {
      setError('We could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => undefined);
    onSignedOut();
  }

  function exportCsv() {
    const blob = new Blob([csv(shown)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nisa-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* One stable array, so the memos below are not invalidated every render
     by a fresh [] literal. */
  const all = useMemo(() => orders ?? [], [orders]);

  const stats = useMemo(() => {
    const open = all.filter((o) => OPEN.includes(o.status));
    const settled = all.filter((o) => o.status !== 'cancelled');
    const today = new Date().toDateString();
    return {
      count: all.length,
      open: open.length,
      unopened: all.filter((o) => o.status === 'new').length,
      today: all.filter((o) => new Date(o.placedAt).toDateString() === today).length,
      revenue: settled.reduce((a, o) => a + o.total, 0),
      average: settled.length
        ? Math.round(settled.reduce((a, o) => a + o.total, 0) / settled.length)
        : 0
    };
  }, [all]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    all.forEach((o) => map.set(o.status, (map.get(o.status) ?? 0) + 1));
    return map;
  }, [all]);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = all.filter((o) => {
      if (filter === 'open' && !OPEN.includes(o.status)) return false;
      if (filter !== 'all' && filter !== 'open' && o.status !== filter) return false;
      if (!needle) return true;
      const hay = [
        o.ref,
        o.customer.first_name,
        o.customer.last_name,
        o.customer.email,
        o.customer.phone,
        o.customer.city,
        o.customer.country,
        ...o.lines.map((l) => l.name)
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(needle);
    });
    const dir = sort.desc ? -1 : 1;
    return list.slice().sort((a, b) => {
      if (sort.key === 'total') return (a.total - b.total) * dir;
      return a.placedAt.localeCompare(b.placedAt) * dir;
    });
  }, [all, query, filter, sort]);

  const open = openRef ? (all.find((o) => o.ref === openRef) ?? null) : null;

  function sortBy(key: SortKey) {
    setSort((prev) => ({ key, desc: prev.key === key ? !prev.desc : true }));
  }

  const chips: { value: OrderStatus | 'all' | 'open'; label: string; n: number }[] = [
    { value: 'all', label: 'All', n: all.length },
    { value: 'open', label: 'Open', n: stats.open },
    ...ORDER_STATUSES.map((s) => ({ value: s, label: s, n: counts.get(s) ?? 0 }))
  ];

  return (
    <div className="adm">
      <header className="adm-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/img/brand/nisa-mark-dark.png" alt="Nisa" />
        <div className="adm-head-t">
          <h1>The order desk</h1>
          <span className="small muted">
            {orders === null
              ? 'Reading the order book…'
              : `${stats.count} order${stats.count === 1 ? '' : 's'} · ${stats.unopened} not yet looked at`}
          </span>
        </div>
        <div className="adm-head-acts">
          <button className="b sm" type="button" onClick={() => load()} disabled={busy}>
            <span>Refresh</span>
          </button>
          <button className="b sm" type="button" onClick={exportCsv} disabled={!shown.length}>
            <span>Export CSV</span>
          </button>
          <Link className="b sm" href={routes.home}>
            <span>The shop</span>
          </Link>
          <button className="b fill sm" type="button" onClick={signOut}>
            <span>Sign out</span>
          </button>
        </div>
      </header>

      <div className="adm-body">
        <div aria-live="polite">{error && <p className="adm-err">{error}</p>}</div>

        <div className="adm-stats">
          <div className="adm-stat">
            <span className="k">Orders</span>
            <span className="v num">{stats.count}</span>
            <span className="s muted">{stats.today} placed today</span>
          </div>
          <div className="adm-stat">
            <span className="k">Still open</span>
            <span className="v num">{stats.open}</span>
            <span className="s muted">{stats.unopened} brand new</span>
          </div>
          <div className="adm-stat">
            <span className="k">Booked</span>
            <span className="v num">{formatKes(stats.revenue)}</span>
            <span className="s muted">cancellations excluded</span>
          </div>
          <div className="adm-stat">
            <span className="k">Average order</span>
            <span className="v num">{formatKes(stats.average)}</span>
            <span className="s muted">across every market</span>
          </div>
        </div>

        <div className="adm-tools">
          <input
            className="in"
            type="search"
            placeholder="A reference, a name, an email, a town…"
            aria-label="Search the order book"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="adm-chips">
            {chips.map((c) => (
              <button
                key={c.value}
                className="adm-chip"
                type="button"
                aria-pressed={filter === c.value}
                onClick={() => setFilter(c.value)}
              >
                {c.label}
                <span className="n">{c.n}</span>
              </button>
            ))}
          </div>
        </div>

        {orders === null ? (
          <p className="muted">Reading the order book…</p>
        ) : !all.length ? (
          <div className="empty">
            <h2 className="d3">No orders yet.</h2>
            <p className="muted">
              The first one placed on the site will appear here, with everything needed to pick,
              pack and chase it.
            </p>
          </div>
        ) : !shown.length ? (
          <div className="empty">
            <h2 className="d3">Nothing matches that.</h2>
            <p className="muted">Clear the search, or pick another status.</p>
          </div>
        ) : (
          <>
            {/* On a desk: the book as a table. */}
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>
                      <button type="button" onClick={() => sortBy('placedAt')}>
                        Placed {sort.key === 'placedAt' ? (sort.desc ? '↓' : '↑') : ''}
                      </button>
                    </th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>
                      <button type="button" onClick={() => sortBy('total')}>
                        Total {sort.key === 'total' ? (sort.desc ? '↓' : '↑') : ''}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((o) => (
                    <tr
                      key={o.ref}
                      aria-selected={o.ref === openRef}
                      tabIndex={0}
                      onClick={() => setOpenRef(o.ref)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setOpenRef(o.ref);
                        }
                      }}
                    >
                      <td className="ref">{o.ref}</td>
                      <td className="muted" style={{ whiteSpace: 'nowrap' }}>
                        {shortWhen(o.placedAt)}
                      </td>
                      <td className="who">
                        <strong>
                          {o.customer.first_name} {o.customer.last_name}
                        </strong>
                        <span className="small muted">
                          {o.customer.city}, {o.customer.country}
                        </span>
                      </td>
                      <td className="muted">
                        {o.lines.reduce((a, l) => a + l.q, 0)} ·{' '}
                        {o.lines.map((l) => l.name).join(', ')}
                      </td>
                      <td>
                        <StatusPill status={o.status} />
                      </td>
                      <td className="money">{formatKes(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* On a phone: one card per order, because a six-column table
                on a 380px screen is a scroll bar with data behind it. */}
            <div className="adm-cards">
              {shown.map((o) => (
                <button
                  key={o.ref}
                  className="adm-card"
                  type="button"
                  onClick={() => setOpenRef(o.ref)}
                >
                  <div className="top">
                    <strong>
                      {o.customer.first_name} {o.customer.last_name}
                    </strong>
                    <StatusPill status={o.status} />
                  </div>
                  <span className="meta muted">
                    {o.ref} · {shortWhen(o.placedAt)}
                  </span>
                  <span className="small muted">
                    {o.lines.reduce((a, l) => a + l.q, 0)} item
                    {o.lines.reduce((a, l) => a + l.q, 0) === 1 ? '' : 's'} ·{' '}
                    {o.customer.city}, {o.customer.country}
                  </span>
                  <span className="meta">{formatKes(o.total)}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <OrderDetail
        order={open}
        busy={busy}
        onClose={() => setOpenRef(null)}
        onStatus={(status) => open && patch(open.ref, { status })}
        onNote={(note) => open && patch(open.ref, { note })}
        onDelete={() => open && remove(open.ref)}
      />
    </div>
  );
}
