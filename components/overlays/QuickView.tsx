'use client';

/* Quick view: the whole bottle without leaving the shelf. */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { asset, byId } from '@/lib/catalog';
import { productUrl } from '@/lib/routes';

import NotePyramid from '../NotePyramid';
import { CloseButton, Dialog } from '../Sheet';
import { useStore } from '../store';

export default function QuickView() {
  const { quickView, closeQuickView, money, addToBag } = useStore();
  const asked = byId(quickView);
  const [ml, setMl] = useState<number | null>(null);

  /* The dialog takes half a second to slide out. Holding on to the last
     bottle means it animates away with its contents, rather than emptying
     the moment it is dismissed. */
  const last = useRef(asked);
  if (asked) last.current = asked;
  const p = asked ?? last.current;

  /* A different bottle resets the chosen size to that bottle's smallest. */
  useEffect(() => {
    if (asked) setMl(asked.sizes[0].ml);
  }, [asked]);

  const size = p?.sizes.find((s) => s.ml === ml) ?? p?.sizes[0];

  return (
    <Dialog
      open={Boolean(asked)}
      onClose={closeQuickView}
      label={p ? `${p.brand} ${p.name}` : 'Fragrance'}
    >
      {p && size && (
        <>
          <CloseButton onClose={closeQuickView} />
          <div className="qv-in">
            <div className="stage">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(p.image)} alt={`${p.brand} ${p.name}`} />
            </div>
            <div className="meta">
              <div className="house">{p.brand}</div>
              <h2 className="d2" style={{ margin: '2px 0 6px' }}>
                {p.name}
              </h2>
              <p className="small it muted">
                {p.concentration} · {p.familyLabel}
              </p>
              <p style={{ maxWidth: '44ch' }}>{p.description}</p>

              <NotePyramid notes={p.notes} />

              <div className="pills">
                {p.sizes.map((s) => (
                  <button
                    key={s.ml}
                    type="button"
                    aria-pressed={s.ml === size.ml}
                    onClick={() => setMl(s.ml)}
                  >
                    {s.ml}ml
                  </button>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)',
                  margin: '18px 0 14px'
                }}
              >
                <span className="d3 num">{money(size.price)}</span>
                <Link className="lnk" href={productUrl(p.id)} onClick={closeQuickView}>
                  Full detail
                </Link>
              </div>

              <button
                className="b gold"
                type="button"
                style={{ width: '100%' }}
                onClick={(e) => addToBag(p.id, size.ml, 1, e.currentTarget)}
              >
                <span>Add to bag</span>
              </button>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
