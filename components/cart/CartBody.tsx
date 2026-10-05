'use client';

/* The full bag: the lines, the summary, and what is often bought
   alongside whatever is already in it. */

import Link from 'next/link';

import FreeDelivery from '@/components/FreeDelivery';
import Shelf from '@/components/Shelf';
import { useStore } from '@/components/store';
import { asset, byId, products } from '@/lib/catalog';
import { config } from '@/lib/config';
import { productUrl, routes, shopUrl, whatsAppUrl } from '@/lib/routes';

export default function CartBody() {
  const { bag, bagTotal, setQty, money, ready } = useStore();

  if (!ready) {
    /* One frame, while localStorage is read. Saying nothing is better than
       flashing "your bag is empty" at someone whose bag is not. */
    return <div className="empty" aria-hidden="true" style={{ minHeight: 240 }} />;
  }

  if (!bag.length) {
    return (
      <div className="empty">
        <h2 className="d3">Nothing in the bag yet.</h2>
        <p className="muted">
          Start with what the region is wearing, or dig into the oud library.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            marginTop: 22,
            flexWrap: 'wrap'
          }}
        >
          <Link className="b gold" href={shopUrl({ tag: 'bestseller' })}>
            <span>Bestsellers</span>
          </Link>
          <Link className="b" href={shopUrl({ family: 'oud' })}>
            <span>Attars</span>
          </Link>
        </div>
      </div>
    );
  }

  const ship = bagTotal >= config.freeDeliveryOver ? 0 : config.deliveryFlat;

  /* Suggestions come from the families already in the bag. */
  const inBag = bag.map((l) => l.id);
  const fams = new Set(bag.map((l) => byId(l.id)?.family).filter(Boolean));
  const also = products.filter((p) => !inBag.includes(p.id) && fams.has(p.family)).slice(0, 4);

  const waText = `Hello Nisa, I would like to order:\n${bag
    .map((l) => `· ${l.brand} ${l.name} ${l.ml}ml ×${l.q}`)
    .join('\n')}`;

  return (
    <>
      <div className="split wide" style={{ alignItems: 'start' }}>
        <div>
          {bag.map((l) => (
            <div className="bag-row" key={l.key} style={{ gridTemplateColumns: '88px 1fr auto' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(l.thumb)} alt={l.name} style={{ width: 88, height: 104 }} />
              <div>
                <div className="small muted">{l.brand}</div>
                <Link
                  href={productUrl(l.id)}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 23,
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block'
                  }}
                >
                  {l.name}
                </Link>
                <div className="small muted num">
                  {l.ml}ml · {money(l.price)} each
                </div>
                <div className="qty" style={{ marginTop: 9 }}>
                  <button type="button" aria-label="One fewer" onClick={() => setQty(l.key, l.q - 1)}>
                    −
                  </button>
                  <span className="num">{l.q}</span>
                  <button type="button" aria-label="One more" onClick={() => setQty(l.key, l.q + 1)}>
                    +
                  </button>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="d3 num">{money(l.price * l.q)}</div>
                <button
                  className="lnk"
                  type="button"
                  style={{ background: 'none', border: 0, cursor: 'pointer', marginTop: 8 }}
                  onClick={() => setQty(l.key, 0)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside style={{ border: '1px solid var(--rule)', padding: 'var(--space-6)' }}>
          <h2 className="d3">Summary</h2>
          <div style={{ display: 'grid', gap: 10, margin: 'var(--space-4) 0', fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="muted">Subtotal</span>
              <span className="num">{money(bagTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="muted">Delivery</span>
              <span className="num">{ship ? money(ship) : 'Complimentary'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="muted">Samples</span>
              <span>2 vials, included</span>
            </div>
          </div>

          <div
            style={{
              height: 1,
              background: 'var(--rule)',
              border: 0,
              margin: 'var(--space-4) 0'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="d3">Total</span>
            <span className="d3 num">{money(bagTotal + ship)}</span>
          </div>

          <div style={{ marginTop: 'var(--space-4)' }}>
            <FreeDelivery total={bagTotal} />
          </div>

          <div style={{ display: 'grid', gap: 10, marginTop: 'var(--space-6)' }}>
            <Link className="b gold" href={routes.checkout}>
              <span>Checkout</span>
            </Link>
            <a
              className="b"
              href={whatsAppUrl(config.phoneRaw, waText)}
              target="_blank"
              rel="noopener"
            >
              <span>Order on WhatsApp</span>
            </a>
            <Link className="lnk" href={routes.shop} style={{ textAlign: 'center', marginTop: 6 }}>
              Keep looking
            </Link>
          </div>
        </aside>
      </div>

      {also.length > 0 && (
        <section className="band wrap" style={{ paddingInline: 0 }}>
          <p className="kicker">Often bought alongside</p>
          <Shelf products={also} />
        </section>
      )}
    </>
  );
}
