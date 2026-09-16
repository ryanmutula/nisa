'use client';

/* One order, opened: what was bought, who bought it, where it goes, and
   the row of buttons that moves it along. */

import { useRef } from 'react';

import { CloseIcon } from '@/components/icons';
import { useSheet } from '@/components/Sheet';
import { config } from '@/lib/config';
import { formatKes } from '@/lib/money';
import { whatsAppUrl } from '@/lib/routes';
import { ORDER_STATUSES, type Order, type OrderStatus } from '@/lib/types';

import StatusPill from './StatusPill';

const PAYMENT_LABEL: Record<string, string> = {
  mpesa: 'M-Pesa',
  card: 'Card',
  paypal: 'PayPal',
  cod: 'Cash on delivery'
};

function when(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function OrderDetail({
  order,
  busy,
  onClose,
  onStatus,
  onNote,
  onDelete
}: {
  order: Order | null;
  busy: boolean;
  onClose: () => void;
  onStatus: (status: OrderStatus) => void;
  onNote: (note: string) => void;
  onDelete: () => void;
}) {
  /* Slide in on open, slide out on close — which means holding on to the
     order for the length of the exit rather than emptying the panel the
     moment it is dismissed. */
  const { mounted, on } = useSheet(Boolean(order), 520);
  const last = useRef(order);
  if (order) last.current = order;
  const shown = order ?? last.current;

  if (!mounted || !shown) return null;

  const c = shown.customer;
  const summary =
    `Order ${shown.ref}\n` +
    shown.lines.map((l) => `· ${l.name} ${l.ml}ml ×${l.q}`).join('\n') +
    `\nTotal ${formatKes(shown.total)}`;

  return (
    <aside
      className={`adm-detail${on ? ' on' : ''}`}
      role="dialog"
      aria-modal="false"
      aria-label={`Order ${shown.ref}`}
    >
      <div className="adm-detail-head">
        <button className="ib x" type="button" aria-label="Close this order" onClick={onClose}>
          <CloseIcon />
        </button>
        <p className="kicker" style={{ margin: 0 }}>
          {shown.ref}
        </p>
        <h2 className="d3" style={{ margin: '4px 0 6px' }}>
          {c.first_name} {c.last_name}
        </h2>
        <p className="small muted" style={{ margin: 0 }}>
          Placed {when(shown.placedAt)}
          {shown.updatedAt !== shown.placedAt && ` · updated ${when(shown.updatedAt)}`}
        </p>
        <div style={{ marginTop: 'var(--space-3)' }}>
          <StatusPill status={shown.status} />
        </div>
      </div>

      <div className="adm-detail-body">
        <div className="adm-block">
          <h3>Where it is up to</h3>
          <div className="adm-steps">
            {ORDER_STATUSES.map((s) => (
              <button
                key={s}
                className="adm-chip"
                type="button"
                aria-pressed={shown.status === s}
                disabled={busy}
                onClick={() => onStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="adm-block">
          <h3>What was bought</h3>
          {shown.lines.map((l) => (
            <div className="adm-line" key={`${l.id}:${l.ml}`}>
              <span>
                {l.name} <span className="muted num">{l.ml}ml ×{l.q}</span>
              </span>
              <span className="money">{formatKes(l.line)}</span>
            </div>
          ))}

          <div className="adm-line">
            <span className="muted">Subtotal</span>
            <span className="money">{formatKes(shown.subtotal)}</span>
          </div>
          {shown.discount > 0 && (
            <div className="adm-line" style={{ color: 'var(--color-accent-700)' }}>
              <span>Discount {shown.code}</span>
              <span className="money">− {formatKes(shown.discount)}</span>
            </div>
          )}
          <div className="adm-line">
            <span className="muted">Delivery</span>
            <span className="money">
              {shown.delivery ? formatKes(shown.delivery) : 'Complimentary'}
            </span>
          </div>
          <div className="adm-total">
            <span className="d3">Total</span>
            <span className="d3 money">{formatKes(shown.total)}</span>
          </div>
          {shown.displayCurrency !== 'KES' && (
            <p className="small muted" style={{ margin: 'var(--space-2) 0 0' }}>
              The customer was reading prices in {shown.displayCurrency}. Every figure here is the
              shilling price, which is the contract price.
            </p>
          )}
        </div>

        <div className="adm-block">
          <h3>Who and where</h3>
          <div className="adm-kv">
            <div>
              <span className="k">Phone</span>
              <span className="v">
                <a href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}>{c.phone}</a>
              </span>
            </div>
            <div>
              <span className="k">Email</span>
              <span className="v">
                <a href={`mailto:${c.email}?subject=Nisa order ${shown.ref}`}>{c.email}</a>
              </span>
            </div>
            <div>
              <span className="k">Address</span>
              <span className="v">{c.address}</span>
            </div>
            <div>
              <span className="k">City</span>
              <span className="v">{c.city}</span>
            </div>
            <div>
              <span className="k">Country</span>
              <span className="v">{c.country}</span>
            </div>
            <div>
              <span className="k">Paying by</span>
              <span className="v">{PAYMENT_LABEL[c.payment] ?? c.payment}</span>
            </div>
            {c.notes && (
              <div>
                <span className="k">They said</span>
                <span className="v">{c.notes}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
            <a
              className="b sm"
              href={whatsAppUrl(c.phone.replace(/[^\d]/g, '') || config.phoneRaw, summary)}
              target="_blank"
              rel="noopener"
            >
              <span>WhatsApp them</span>
            </a>
            <a className="b sm" href={`mailto:${c.email}?subject=Nisa order ${shown.ref}`}>
              <span>Email them</span>
            </a>
          </div>
        </div>

        <div className="adm-block">
          <h3>Notes</h3>
          {shown.notes.length ? (
            <div className="adm-log">
              {shown.notes.map((n, i) => (
                <div key={`${n.at}-${i}`}>
                  <time dateTime={n.at}>{when(n.at)}</time>
                  {n.body}
                </div>
              ))}
            </div>
          ) : (
            <p className="muted small" style={{ margin: 0 }}>
              Nothing noted yet.
            </p>
          )}

          <form
            style={{ marginTop: 'var(--space-4)' }}
            onSubmit={(e) => {
              e.preventDefault();
              const field = e.currentTarget.elements.namedItem('note') as HTMLTextAreaElement;
              const body = field.value.trim();
              if (!body) return;
              onNote(body);
              field.value = '';
            }}
          >
            <div className="field">
              <label htmlFor="adm-note">Add a note</label>
              <textarea
                className="in"
                id="adm-note"
                name="note"
                style={{ minHeight: 72 }}
                placeholder="M-Pesa received, picking tomorrow…"
              />
            </div>
            <button className="b sm" type="submit" disabled={busy}>
              <span>Save the note</span>
            </button>
          </form>
        </div>

        <div className="adm-block">
          <h3>Danger</h3>
          <button
            className="b sm"
            type="button"
            disabled={busy}
            onClick={() => {
              if (confirm(`Delete order ${shown.ref}? This cannot be undone.`)) onDelete();
            }}
          >
            <span>Delete this order</span>
          </button>
          <p className="muted small" style={{ margin: '8px 0 0' }}>
            Cancelling is usually what you want — it keeps the record. Deleting removes it for good.
          </p>
        </div>
      </div>
    </aside>
  );
}
