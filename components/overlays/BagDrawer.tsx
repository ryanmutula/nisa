'use client';

/* The bag, as a drawer. Same rows, same free-delivery rail, same two
   buttons at the foot. */

import Link from 'next/link';

import { asset } from '@/lib/catalog';
import { config } from '@/lib/config';
import { productUrl, routes } from '@/lib/routes';

import FreeDelivery from '../FreeDelivery';
import { CloseButton, Drawer } from '../Sheet';
import { useStore } from '../store';

export default function BagDrawer() {
  const { overlay, closeOverlay, bag, bagCount, bagTotal, setQty, money } = useStore();
  const open = overlay === 'bag';

  return (
    <Drawer open={open} onClose={closeOverlay} label="Your bag">
      <div className="drawer-head">
        <CloseButton onClose={closeOverlay} />
        <h2 className="d3" style={{ margin: 0 }}>
          Your bag
        </h2>
        <p className="muted small" style={{ margin: '4px 0 0' }}>
          {bag.length
            ? `${bagCount} item${bagCount > 1 ? 's' : ''}`
            : 'Nothing here yet'}
        </p>
      </div>

      <div className="bag-list">
        {bag.length ? (
          bag.map((l) => (
            <div className="bag-row" key={l.key}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(l.thumb)} alt={l.name} />
              <div>
                <div className="small muted">{l.brand}</div>
                <Link
                  href={productUrl(l.id)}
                  onClick={closeOverlay}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 19,
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block'
                  }}
                >
                  {l.name}
                </Link>
                <div className="small muted num">
                  {l.ml}ml · {money(l.price)}
                </div>
                <div className="qty" style={{ marginTop: 7 }}>
                  <button type="button" aria-label="One fewer" onClick={() => setQty(l.key, l.q - 1)}>
                    −
                  </button>
                  <span className="num">{l.q}</span>
                  <button type="button" aria-label="One more" onClick={() => setQty(l.key, l.q + 1)}>
                    +
                  </button>
                </div>
              </div>
              <div className="num">{money(l.price * l.q)}</div>
            </div>
          ))
        ) : (
          <p className="muted" style={{ padding: '28px 0' }}>
            Add a fragrance and it will appear here.
          </p>
        )}
      </div>

      <div className="drawer-foot">
        {bag.length ? (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-heading)',
                fontSize: 22
              }}
            >
              <span>Subtotal</span>
              <span className="num">{money(bagTotal)}</span>
            </div>
            <FreeDelivery total={bagTotal} />
            <Link className="b gold" href={routes.checkout} onClick={closeOverlay}>
              <span>Checkout</span>
            </Link>
            <Link className="b" href={routes.cart} onClick={closeOverlay}>
              <span>View full bag</span>
            </Link>
          </>
        ) : (
          <Link className="b" href={routes.shop} onClick={closeOverlay}>
            <span>Browse the shop</span>
          </Link>
        )}
        <p className="small muted" style={{ margin: 0 }}>
          Free delivery over {money(config.freeDeliveryOver)}.
        </p>
      </div>
    </Drawer>
  );
}
