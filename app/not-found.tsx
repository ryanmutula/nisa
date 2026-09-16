import Link from 'next/link';

import { routes } from '@/lib/routes';

export const metadata = {
  title: 'Not found',
  robots: { index: false, follow: false }
};

export default function NotFound() {
  return (
    <section className="wrap" style={{ paddingBlock: 'clamp(80px,14vw,180px)', textAlign: 'center' }}>
      <p className="kicker" style={{ justifyContent: 'center' }}>
        404
      </p>
      <h1 className="d1">This shelf is empty.</h1>
      <p className="lead muted" style={{ margin: 'var(--space-4) auto 0', maxWidth: '42ch' }}>
        The page you were after has moved or never existed. The fragrance almost certainly still
        does.
      </p>
      <div
        style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          marginTop: 'var(--space-8)',
          flexWrap: 'wrap'
        }}
      >
        <Link className="b gold" href={routes.shop}>
          <span>Shop the shelf</span>
        </Link>
        <Link className="b" href={routes.home}>
          <span>Back home</span>
        </Link>
      </div>
    </section>
  );
}
