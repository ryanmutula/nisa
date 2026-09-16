'use client';

/* The comparison tray along the bottom, and the table it opens.
   Three bottles is the cap: past that a table stops being readable. */

import { useState } from 'react';

import { asset, byId } from '@/lib/catalog';
import type { Product } from '@/lib/types';

import { CloseIcon } from '../icons';
import { CloseButton, Dialog } from '../Sheet';
import { useStore } from '../store';

export default function Compare() {
  const { compare, toggleCompare, money, addToBag } = useStore();
  const [open, setOpen] = useState(false);
  const list = compare.map((id) => byId(id)).filter((p): p is Product => Boolean(p));

  const rows: [string, (p: Product) => string][] = [
    ['House', (p) => p.brand],
    ['Family', (p) => p.familyLabel],
    ['Concentration', (p) => p.concentration],
    ['Wear', (p) => p.gender],
    ['Top', (p) => p.notes.top.join(', ')],
    ['Heart', (p) => p.notes.heart.join(', ')],
    ['Base', (p) => p.notes.base.join(', ')],
    ['Sizes', (p) => p.sizes.map((s) => `${s.ml}ml`).join(' · ')]
  ];

  return (
    <>
      <div
        className={`cmptray${list.length ? ' on' : ''}`}
        id="cmp-tray"
        role="region"
        aria-label="Comparison tray"
      >
        {list.map((p) => (
          <button
            className="cmp-chip"
            type="button"
            key={p.id}
            aria-label={`Remove ${p.name} from the comparison`}
            onClick={() => toggleCompare(p.id)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(p.thumb)} alt="" />
            <span>{p.name}</span>
            <CloseIcon />
          </button>
        ))}
        <button
          className="b fill sm"
          id="cmp-go"
          type="button"
          disabled={list.length < 2}
          onClick={() => setOpen(true)}
        >
          <span>Compare {list.length}</span>
        </button>
      </div>

      <Dialog
        open={open && list.length > 1}
        onClose={() => setOpen(false)}
        label="Compare fragrances"
      >
        <CloseButton onClose={() => setOpen(false)} />
        <div style={{ padding: 'clamp(22px,3vw,40px)' }}>
          <h2 className="d3">Side by side</h2>
          <div className="tbl-scroll" style={{ marginTop: 'var(--space-4)' }}>
            <table className="tbl" style={{ minWidth: 520 }}>
              <thead>
                <tr>
                  <th />
                  {list.map((p) => (
                    <th key={p.id} style={{ minWidth: 170 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset(p.thumb)}
                        alt=""
                        style={{
                          width: 74,
                          height: 88,
                          objectFit: 'contain',
                          marginBottom: 8
                        }}
                      />
                      <span
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-heading)',
                          fontSize: 19,
                          textTransform: 'none',
                          letterSpacing: 0
                        }}
                      >
                        {p.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, read]) => (
                  <tr key={label}>
                    <td className="muted" style={{ whiteSpace: 'nowrap' }}>
                      {label}
                    </td>
                    {list.map((p) => (
                      <td key={p.id}>{read(p)}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="muted" style={{ whiteSpace: 'nowrap' }}>
                    From
                  </td>
                  {list.map((p) => (
                    <td key={p.id} className="num">
                      {money(p.sizes[0].price)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td />
                  {list.map((p) => (
                    <td key={p.id}>
                      <button
                        className="b sm"
                        type="button"
                        onClick={(e) => addToBag(p.id, null, 1, e.currentTarget)}
                      >
                        <span>Add to bag</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Dialog>
    </>
  );
}
