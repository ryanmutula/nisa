'use client';

/* "Where you left off" — the row of bottles this browser has opened.
   It hides itself below two, because one bottle is not a history. */

import Link from 'next/link';

import { asset } from '@/lib/catalog';
import { productUrl } from '@/lib/routes';

import { useStore } from './store';

export default function RecentlyViewed({ skipId }: { skipId?: string }) {
  const { seen } = useStore();
  const list = seen.filter((p) => p.id !== skipId).slice(0, 8);
  if (list.length < 2) return null;

  return (
    <section className="band wrap">
      <p className="kicker">Where you left off</p>
      <div className="seen">
        {list.map((p) => (
          <Link key={p.id} href={productUrl(p.id)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(p.thumb)} alt="" loading="lazy" />
            <span className="muted">{p.brand}</span>
            <span>{p.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
