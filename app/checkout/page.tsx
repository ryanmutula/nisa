import type { Metadata } from 'next';
import Link from 'next/link';

import CheckoutBody from '@/components/checkout/CheckoutBody';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false }
};

export default function CheckoutPage() {
  return (
    <>
      <div className="wrap crumb muted">
        <Link href={routes.home}>Home</Link> · <Link href={routes.cart}>Bag</Link> · Checkout
      </div>
      <section className="wrap" style={{ paddingBottom: 'clamp(64px,9vw,120px)' }}>
        <h1 className="d2" data-r>
          Checkout
        </h1>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <CheckoutBody />
        </div>
      </section>
    </>
  );
}
