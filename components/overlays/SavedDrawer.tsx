'use client';

/* The saved list — what the heart on a card puts aside. */

import Link from 'next/link';

import { asset, byId } from '@/lib/catalog';
import { productUrl, routes } from '@/lib/routes';
import type { Product } from '@/lib/types';

import { CloseButton, Drawer } from '../Sheet';
import { useStore } from '../store';

export default function SavedDrawer() {
  const { overlay, closeOverlay, saved, toggleSaved, addToBag, money } = useStore();
  const open = overlay === 'saved';
  const list = saved.map((id) => byId(id)).filter((p): p is Product => Boolean(p));

  return (
    <Drawer open={open} onClose={closeOverlay} label="Saved fragrances">
      <div className="drawer-head">
        <CloseButton onClose={closeOverlay} />
        <h2 className="d3" style={{ margin: 0 }}>
          Saved
        </h2>
        <p className="muted small" style={{ margin: '4px 0 0' }}>
          {list.length ? `${list.length} put aside` : 'Nothing saved yet'}
        </p>
      </div>

      <div className="bag-list">
        {list.length ? (
          list.map((p) => (
            <div className="bag-row" key={p.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(p.thumb)} alt={p.name} />
              <div>
                <div className="small muted">{p.brand}</div>
                <Link
                  href={productUrl(p.id)}
                  onClick={closeOverlay}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 20,
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block'
                  }}
                >
                  {p.name}
                </Link>
                <div className="small muted num">from {money(p.sizes[0].price)}</div>
              </div>
              <div style={{ display: 'grid', gap: 6, justifyItems: 'end' }}>
                <button
                  className="b sm"
                  type="button"
                  onClick={(e) => addToBag(p.id, null, 1, e.currentTarget)}
                >
                  <span>Add</span>
                </button>
                <button
                  className="lnk"
                  type="button"
                  style={{ background: 'none', border: 0, cursor: 'pointer' }}
                  onClick={() => toggleSaved(p.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="muted" style={{ padding: '28px 0' }}>
            Tap the heart on any fragrance and it will wait for you here.
          </p>
        )}
      </div>

      <div className="drawer-foot">
        <Link className="b" href={routes.shop} onClick={closeOverlay}>
          <span>Browse the shop</span>
        </Link>
      </div>
    </Drawer>
  );
}
