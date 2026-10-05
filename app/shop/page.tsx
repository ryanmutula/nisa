import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import ShopBrowser from '@/components/shop/ShopBrowser';
import { products } from '@/lib/catalog';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Shop all fragrance',
  description:
    'A hundred and fifty fragrances from ten houses — Parfums de Marly, Nishane, Ormonde Jayne, Roja, Mancera, Montale, Initio, Xerjoff, Tiziana Terenzi and Atelier des Ors.'
};

export default function ShopPage() {
  return (
    <>
      <div className="wrap crumb muted">
        <Link href={routes.home}>Home</Link> · Shop
      </div>

      <section className="wrap" style={{ paddingBottom: 'var(--space-8)' }}>
        <div data-r style={{ maxWidth: '34ch' }}>
          <p className="kicker">The shelf</p>
          <h1 className="d2">Ten houses, one room.</h1>
          <p className="muted" style={{ marginTop: 'var(--space-3)' }}>
            Pick a house, a family, or just scroll. Every price shown includes duty and is stocked
            in Nairobi unless flagged otherwise.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="wrap empty">
            <p className="muted">Loading the shelf — {products.length} fragrances.</p>
          </div>
        }
      >
        <ShopBrowser />
      </Suspense>
    </>
  );
}
