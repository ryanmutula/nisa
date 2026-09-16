'use client';

/* What sits along the bottom of the page.

   On a desk: a slim bar that arrives once the hero is past, because the
   shop is the priority. On a phone: one always-visible bar carrying Shop,
   the advisor and WhatsApp, instead of three floating buttons fighting
   each other for the same corner.

   Both are suppressed on the bag and the checkout, where the page already
   has one clear next step, and in the admin.
*/

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { config } from '@/lib/config';
import { routes, whatsAppUrl } from '@/lib/routes';

import { useIsPhone, useScrollY } from './hooks';
import { BagIcon, SparkIcon, WhatsAppIcon } from './icons';
import { useStore } from './store';

const QUIET = [routes.cart, routes.checkout, routes.admin];

export default function BottomBar() {
  const pathname = usePathname();
  const isPhone = useIsPhone();
  const y = useScrollY();
  const { setAdvisorOpen, compare } = useStore();

  const quiet = QUIET.some((r) => pathname.startsWith(r));
  const showShopBar = !quiet && !isPhone && y > (typeof window === 'undefined' ? 0 : innerHeight * 0.7);
  const showMobileBar = !quiet && isPhone;

  /* The floating furniture reads these to get out of each other's way. */
  useEffect(() => {
    document.body.classList.toggle('shopbar-on', showShopBar);
    document.body.classList.toggle('mobar-on', showMobileBar);
    document.body.classList.toggle('cmp-on', compare.length > 0);
    return () => {
      document.body.classList.remove('shopbar-on', 'mobar-on', 'cmp-on');
    };
  }, [showShopBar, showMobileBar, compare.length]);

  if (quiet) return null;

  if (isPhone) {
    return (
      <nav className="mobar" aria-label="Quick actions">
        <Link href={routes.shop}>
          <BagIcon />
          <span>Shop</span>
        </Link>
        <button type="button" onClick={() => setAdvisorOpen(true)}>
          <SparkIcon />
          <span>Find my scent</span>
        </button>
        <a href={whatsAppUrl(config.phoneRaw)} target="_blank" rel="noopener">
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </a>
      </nav>
    );
  }

  return (
    <div className={`shopbar${showShopBar ? ' on' : ''}`}>
      <ShopBarCopy />
      <Link className="b fill sm" href={routes.shop} tabIndex={showShopBar ? 0 : -1}>
        <span>Shop the shelf</span>
      </Link>
    </div>
  );
}

function ShopBarCopy() {
  const { money } = useStore();
  return (
    <p className="muted">
      Eleven houses, stocked in Nairobi. Free delivery over{' '}
      <span className="num">{money(config.freeDeliveryOver)}</span>.
    </p>
  );
}
