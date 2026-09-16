'use client';

/* ═══════════════════════════════════════════════════════════════════
   Checkout.

   Placing an order does three things: it files the order on the server
   (POST /api/orders, which re-prices every line from the catalogue and
   hands back the reference), it clears the bag, and it gives the customer
   a prefilled WhatsApp message so nothing depends on email.

   The totals shown here are the same arithmetic the server runs, so the
   figure on screen is the figure that gets filed. If the two ever
   disagree the server's is the one that counts — it is the only one that
   cannot be edited from a browser console.

   To plug in a real gateway, see the note at the end of this file.
   ═══════════════════════════════════════════════════════════════════ */

import Link from 'next/link';
import { useState } from 'react';

import { useStore } from '@/components/store';
import { config } from '@/lib/config';
import { deliveryMarkets } from '@/lib/money';
import { discountFor, lookupCoupon, priceLines } from '@/lib/pricing';
import { routes, shopUrl, whatsAppUrl } from '@/lib/routes';
import type { Order, PaymentMethod } from '@/lib/types';

const PAYMENTS: [PaymentMethod, string, string][] = [
  ['mpesa', 'M-Pesa', 'We send an STK push to the number above.'],
  ['card', 'Card', 'Visa or Mastercard, taken on a secure page.'],
  ['paypal', 'PayPal', 'For customers paying from outside the region.'],
  ['cod', 'Cash on delivery', 'Nairobi, Mombasa and Kisumu only.']
];

const AFTER: Record<PaymentMethod, (o: Order, money: (n: number) => string) => string> = {
  mpesa: (o) => `We will send an M-Pesa request to ${o.customer.phone} shortly.`,
  card: (o) => `We will send a secure card link to ${o.customer.email}.`,
  paypal: (o) => `We will send a PayPal request to ${o.customer.email}.`,
  cod: (o, money) =>
    `Pay the rider on delivery — ${money(o.total)}, exact change appreciated.`
};

export default function CheckoutBody() {
  const { bag, clearBag, money, market, ready } = useStore();

  const [codeInput, setCodeInput] = useState('');
  const [coupon, setCoupon] = useState<ReturnType<typeof lookupCoupon>>(null);
  const [codeMessage, setCodeMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [placed, setPlaced] = useState<{ order: Order; stored: boolean } | null>(null);

  /* ── the confirmation ──────────────────────────────────────────── */
  if (placed) {
    const { order, stored } = placed;
    const message =
      `Order ${order.ref}\n` +
      order.lines
        .map((l) => `· ${l.name} ${l.ml}ml ×${l.q} — ${money(l.line)}`)
        .join('\n') +
      (order.discount ? `\nDiscount ${order.code} − ${money(order.discount)}` : '') +
      `\nTotal ${money(order.total)}\n\n${order.customer.first_name} ${order.customer.last_name}` +
      `\n${order.customer.phone} · ${order.customer.email}` +
      `\n${order.customer.address}, ${order.customer.city}, ${order.customer.country}` +
      `\nPayment: ${order.customer.payment}`;

    return (
      <div className="split" style={{ alignItems: 'start' }}>
        <div>
          <p className="kicker">Order placed</p>
          <h2 className="d2">Thank you, {order.customer.first_name}.</h2>
          <p className="lead muted">
            Your reference is <strong className="num">{order.ref}</strong>.{' '}
            {AFTER[order.customer.payment](order, money)}
          </p>
          {!stored && (
            <p className="note" style={{ marginTop: 'var(--space-4)' }}>
              We could not file this order automatically. Send it to us on WhatsApp and we will
              pick it up immediately.
            </p>
          )}
          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              marginTop: 'var(--space-6)'
            }}
          >
            <a
              className="b gold"
              href={whatsAppUrl(config.phoneRaw, message)}
              target="_blank"
              rel="noopener"
            >
              <span>Confirm on WhatsApp</span>
            </a>
            <Link className="b" href={routes.shop}>
              <span>Back to the shop</span>
            </Link>
          </div>
        </div>

        <div style={{ border: '1px solid var(--rule)', padding: 'var(--space-6)' }}>
          <h3 className="d3">What we have</h3>
          {order.lines.map((l) => (
            <div
              key={`${l.id}:${l.ml}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                fontSize: 14,
                padding: '6px 0',
                borderBottom: '1px solid var(--rule)'
              }}
            >
              <span>
                {l.name}{' '}
                <span className="muted num">
                  {l.ml}ml ×{l.q}
                </span>
              </span>
              <span className="num">{money(l.line)}</span>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 'var(--space-4)'
            }}
          >
            <span className="d3">Total</span>
            <span className="d3 num">{money(order.total)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!ready) return <div className="empty" aria-hidden="true" style={{ minHeight: 240 }} />;

  /* ── the form ──────────────────────────────────────────────────── */
  const lines = priceLines(bag.map((l) => ({ id: l.id, ml: l.ml, q: l.q })));

  if (!lines.length) {
    return (
      <div className="empty">
        <h2 className="d3">Your bag is empty.</h2>
        <p className="muted">Nothing to check out yet.</p>
        <div style={{ marginTop: 20 }}>
          <Link className="b gold" href={shopUrl()}>
            <span>Go to the shop</span>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = lines.reduce((a, l) => a + l.line, 0);
  const discount = discountFor(lines, subtotal, coupon);
  let ship = subtotal - discount >= config.freeDeliveryOver ? 0 : config.deliveryFlat;
  if (coupon?.freeDelivery) ship = 0;
  const total = subtotal - discount + ship;

  function applyCode() {
    if (coupon) {
      setCoupon(null);
      setCodeInput('');
      setCodeMessage('');
      return;
    }
    const hit = lookupCoupon(codeInput);
    if (!hit) {
      setCodeMessage('That code is not recognised.');
      return;
    }
    setCoupon(hit);
    setCodeMessage(hit.label);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError('');

    const data: Record<string, string> = {};
    new FormData(form).forEach((v, k) => {
      data[k] = String(v).trim();
    });
    if (data.botcheck) return;

    const missing = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      '[required]'
    )).filter((i) => !i.value.trim());
    if (missing.length) {
      missing[0].focus();
      setError('A few fields still need filling in.');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: bag.map((l) => ({ id: l.id, ml: l.ml, q: l.q })),
          code: coupon?.code ?? '',
          market: market.code,
          customer: data
        })
      });
      const body = (await res.json()) as { ok?: boolean; stored?: boolean; order?: Order; error?: string };

      if (body.order) {
        /* Either it was filed, or the server could not file it but handed
           the reference back anyway — both cases give the customer
           something to hold, and the second says so on screen. */
        try {
          localStorage.setItem('nisa:last-order', JSON.stringify(body.order));
        } catch {
          /* nothing to do */
        }
        clearBag();
        setPlaced({ order: body.order, stored: body.ok === true && body.stored !== false });
        scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setError(body.error ?? 'Something went wrong placing the order. Please try again.');
    } catch {
      setError(
        'We could not reach the server. Check your connection, or send the order to us on WhatsApp.'
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="split wide" style={{ alignItems: 'start' }}>
      <form onSubmit={onSubmit}>
        <h2 className="d3">Where it goes</h2>

        <div className="grid cols-2" style={{ gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          <div className="field">
            <label htmlFor="c-first">First name</label>
            <input
              className="in"
              id="c-first"
              name="first_name"
              autoComplete="given-name"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="c-last">Last name</label>
            <input className="in" id="c-last" name="last_name" autoComplete="family-name" required />
          </div>
        </div>

        <div className="grid cols-2" style={{ gap: 'var(--space-4)' }}>
          <div className="field">
            <label htmlFor="c-mail">Email</label>
            <input
              className="in"
              id="c-mail"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="c-tel">Phone (M-Pesa number if paying by M-Pesa)</label>
            <input
              className="in"
              id="c-tel"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
            />
          </div>
        </div>

        <div className="grid cols-2" style={{ gap: 'var(--space-4)' }}>
          <div className="field">
            <label htmlFor="c-country">Country</label>
            <select
              className="in"
              id="c-country"
              name="country"
              autoComplete="country-name"
              defaultValue={
                deliveryMarkets().find((m) => m.code === market.code)?.country ??
                deliveryMarkets()[0].country
              }
            >
              {deliveryMarkets().map((m) => (
                <option key={m.code} value={m.country}>
                  {m.flag} {m.country}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="c-city">City or town</label>
            <input
              className="in"
              id="c-city"
              name="city"
              autoComplete="address-level2"
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="c-addr">Delivery address or pickup point</label>
          <textarea
            className="in"
            id="c-addr"
            name="address"
            autoComplete="street-address"
            style={{ minHeight: 88 }}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="c-note">Anything we should know</label>
          <textarea className="in" id="c-note" name="notes" style={{ minHeight: 72 }} />
        </div>

        <h2 className="d3" style={{ marginTop: 'var(--space-8)' }}>
          How you would like to pay
        </h2>
        <div style={{ display: 'grid', gap: 10, marginTop: 'var(--space-4)' }}>
          {PAYMENTS.map(([value, title, note], i) => (
            <label
              key={value}
              style={{
                display: 'grid',
                gridTemplateColumns: '22px 1fr',
                gap: 12,
                alignItems: 'start',
                border: '1px solid var(--rule)',
                padding: 'var(--space-4)',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="payment"
                value={value}
                defaultChecked={i === 0}
                style={{ accentColor: 'var(--color-accent)', marginTop: 3 }}
              />
              <span>
                <strong
                  style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 400 }}
                >
                  {title}
                </strong>
                <span className="small muted" style={{ display: 'block' }}>
                  {note}
                </span>
              </span>
            </label>
          ))}
        </div>

        <div className="hp">
          <label htmlFor="bot-order">Leave this empty</label>
          <input id="bot-order" name="botcheck" tabIndex={-1} aria-hidden="true" />
        </div>

        <button
          className="b gold"
          type="submit"
          disabled={sending}
          style={{ width: '100%', marginTop: 'var(--space-6)' }}
        >
          <span>{sending ? 'Placing the order…' : 'Place the order'}</span>
        </button>

        <div style={{ marginTop: 'var(--space-4)' }} aria-live="polite">
          {error && (
            <p className="note" style={{ margin: 0 }}>
              {error}
            </p>
          )}
        </div>
      </form>

      <aside
        style={{
          border: '1px solid var(--rule)',
          padding: 'var(--space-6)',
          position: 'sticky',
          top: 104
        }}
      >
        <h2 className="d3">Your order</h2>

        <div style={{ display: 'grid', gap: 'var(--space-3)', margin: 'var(--space-4) 0' }}>
          {lines.map((l) => (
            <div
              key={`${l.id}:${l.ml}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                fontSize: 14
              }}
            >
              <span>
                {l.name}{' '}
                <span className="muted num">
                  {l.ml}ml ×{l.q}
                </span>
              </span>
              <span className="num">{money(l.line)}</span>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: 'var(--rule)', margin: 'var(--space-4) 0' }} />

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            className="in"
            id="co-code"
            placeholder="Discount code"
            aria-label="Discount code"
            style={{ textTransform: 'uppercase' }}
            value={coupon ? coupon.code : codeInput}
            readOnly={Boolean(coupon)}
            onChange={(e) => setCodeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyCode();
              }
            }}
          />
          <button className="b sm" type="button" style={{ flexShrink: 0 }} onClick={applyCode}>
            <span>{coupon ? 'Remove' : 'Apply'}</span>
          </button>
        </div>
        <div className="small muted" style={{ marginTop: 6 }} aria-live="polite">
          {codeMessage}
        </div>

        {discount > 0 && coupon && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 14,
              marginTop: 'var(--space-3)',
              color: 'var(--color-accent-700)'
            }}
          >
            <span>{coupon.code}</span>
            <span className="num">− {money(discount)}</span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 14,
            marginTop: 'var(--space-3)'
          }}
        >
          <span className="muted">Delivery</span>
          <span className="num">{ship ? money(ship) : 'Complimentary'}</span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginTop: 'var(--space-4)'
          }}
        >
          <span className="d3">Total</span>
          <span className="d3 num">{money(total)}</span>
        </div>

        <p className="small muted" style={{ marginTop: 'var(--space-4)' }}>
          {market.delivery ?? deliveryMarkets()[0].delivery}
        </p>

        <Link className="lnk" href={routes.cart}>
          Edit the bag
        </Link>
      </aside>
    </div>
  );
}

/* ── payment ──────────────────────────────────────────────────────────
   The order is filed and acknowledged; taking the money is the one step
   still done by hand. Each gateway wants a secret key, which must never
   sit in front-end JavaScript, so each belongs in a route handler beside
   app/api/orders/route.ts:

     · M-Pesa (Daraja) — POST the stored order to a handler that requests
       an STK push to order.customer.phone, then poll for the callback.
     · Stripe — create a Checkout Session server-side and return its url
       for this component to navigate to.
     · PayPal — create an order and redirect to the approve link.

   Whichever you add, keep /api/orders as the thing that prices and files
   the order first: a payment that succeeds against an unrecorded order is
   the one failure with no paper trail. */
