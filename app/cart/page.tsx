import type { Metadata } from 'next';
import Link from 'next/link';

import CartBody from '@/components/cart/CartBody';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Your bag',
  robots: { index: false, follow: false }
};

export default function CartPage() {
  return (
    <>
      <div className="wrap crumb muted">
        <Link href={routes.home}>Home</Link> · Bag
      </div>
      <section className="wrap" style={{ paddingBottom: 'clamp(64px,9vw,120px)' }}>
        <h1 className="d2" data-r>
          Your bag
        </h1>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <CartBody />
        </div>
      </section>
    </>
  );
}
