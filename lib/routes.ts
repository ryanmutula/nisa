/* One place that knows what the URLs are.

   The old site was a folder of .html files; this one has clean paths, and
   a product that used to live at product.html?id=pdm-layton now lives at
   /product/pdm-layton. Every link in the app goes through here so a future
   rename is one edit. */

export const routes = {
  home: '/',
  shop: '/shop',
  about: '/about',
  wholesale: '/wholesale',
  contact: '/contact',
  cart: '/cart',
  checkout: '/checkout',
  legal: '/legal',
  admin: '/admin'
} as const;

export function productUrl(id: string): string {
  return `/product/${encodeURIComponent(id)}`;
}

export interface ShopQuery {
  brand?: string | string[];
  family?: string | string[];
  gender?: string | string[];
  tag?: string | string[];
  market?: string;
  max?: number;
  sort?: string;
}

export function shopUrl(query: ShopQuery = {}): string {
  const qs = new URLSearchParams();
  (['brand', 'family', 'gender', 'tag'] as const).forEach((key) => {
    const value = query[key];
    if (!value) return;
    (Array.isArray(value) ? value : [value]).forEach((v) => qs.append(key, v));
  });
  if (query.market) qs.set('market', query.market);
  if (query.max) qs.set('max', String(query.max));
  if (query.sort && query.sort !== 'feat') qs.set('sort', query.sort);
  const s = qs.toString();
  return s ? `${routes.shop}?${s}` : routes.shop;
}

/** The main navigation, in order. */
export const navLinks: { href: string; label: string }[] = [
  { href: routes.home, label: 'Home' },
  { href: routes.shop, label: 'Shop' },
  { href: routes.about, label: 'Our house' },
  { href: routes.wholesale, label: 'Wholesale' },
  { href: routes.contact, label: 'Contact' }
];

export function whatsAppUrl(phoneRaw: string, text?: string): string {
  return `https://wa.me/${phoneRaw}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
