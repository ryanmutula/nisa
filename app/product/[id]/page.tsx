/* A product page per bottle, generated at build time — all 150 of them.
   The old address, product.html?id=pdm-layton, is now /product/pdm-layton. */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ProductDetail from '@/components/product/ProductDetail';
import RecentlyViewed from '@/components/RecentlyViewed';
import Shelf from '@/components/Shelf';
import { asset, byId, products } from '@/lib/catalog';
import { routes, shopUrl } from '@/lib/routes';

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const p = byId(id);
  if (!p) return { title: 'Fragrance' };
  return {
    title: `${p.brand} ${p.name}`,
    description: `${p.concentration} · ${p.familyLabel}. ${p.description}`,
    openGraph: { images: [asset(p.image)] }
  };
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const p = byId(id);
  if (!p) notFound();

  const related = products
    .filter((x) => x.id !== p.id && (x.family === p.family || x.brandSlug === p.brandSlug))
    .slice(0, 8);

  return (
    <>
      <div className="wrap crumb muted">
        <Link href={routes.home}>Home</Link> · <Link href={routes.shop}>Shop</Link> ·{' '}
        <Link href={shopUrl({ brand: p.brandSlug })}>{p.brand}</Link> · {p.name}
      </div>

      <section className="wrap" style={{ paddingBottom: 'clamp(48px,7vw,96px)' }}>
        <ProductDetail product={p} />
      </section>

      {related.length > 0 && (
        <section className="band wrap">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
              flexWrap: 'wrap',
              gap: 'var(--space-4)'
            }}
            data-r
          >
            <div>
              <p className="kicker">Wear it next to</p>
              <h2 className="d2">From the same family</h2>
            </div>
            <Link className="lnk" href={routes.shop}>
              All fragrance
            </Link>
          </div>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <Shelf products={related} />
          </div>
        </section>
      )}

      <RecentlyViewed skipId={p.id} />
    </>
  );
}
