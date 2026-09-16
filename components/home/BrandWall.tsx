/* The marquee of houses. The list is doubled so the loop has no seam. */

import Link from 'next/link';

import { brands } from '@/lib/catalog';
import { shopUrl } from '@/lib/routes';

export default function BrandWall() {
  const twice = [...brands, ...brands];
  return (
    <div className="marq" aria-label="The houses we carry">
      <div className="marq-track" id="marq">
        {twice.map((b, i) => (
          <Link
            key={`${b.slug}-${i}`}
            href={shopUrl({ brand: b.slug })}
            /* The second pass is decoration: one set of links is enough
               for a screen reader and a crawler. */
            aria-hidden={i >= brands.length}
            tabIndex={i >= brands.length ? -1 : undefined}
          >
            {b.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
