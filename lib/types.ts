/* Shapes for the catalogue, the configuration and the order book.
   The catalogue keeps the same field names it had in catalog.js, so a
   product object lifted out of the old file drops straight in here. */

export type Gender = 'men' | 'women' | 'unisex';

export interface Size {
  ml: number;
  /** Always in KES. Every other currency is converted at read time. */
  price: number;
}

export interface Notes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  brand: string;
  brandSlug: string;
  name: string;
  gender: Gender;
  family: string;
  familyLabel: string;
  concentration: string;
  sizes: Size[];
  notes: Notes;
  description: string;
  tags?: string[];
  image: string;
  thumb: string;
  cutout?: string;
  rating?: number;
  reviews?: number;
  availability?: string[];
}

export interface Brand {
  slug: string;
  name: string;
  origin: string;
  founded: number;
  tagline?: string;
  blurb?: string;
  count?: number;
  hero?: string;
}

export interface Family {
  slug: string;
  label: string;
}

export interface Catalog {
  currency: string;
  brands: Brand[];
  families: Family[];
  products: Product[];
}

export interface Market {
  code: string;
  country: string;
  currency: string;
  symbol: string;
  /** Multiply a KES price by this to get the market's own currency. */
  rate: number;
  flag: string;
  delivery?: string;
  /** Shown in the switcher, but not a place we deliver to. */
  currencyOnly?: boolean;
}

export interface Coupon {
  pct: number;
  label: string;
  /** Limits the discount to one family, by family slug. */
  family?: string;
  freeDelivery?: boolean;
}

/* ── the bag ─────────────────────────────────────────────────────── */

export interface BagLine {
  /** `${id}:${ml}` — one line per product/size pair. */
  key: string;
  id: string;
  ml: number;
  price: number;
  q: number;
  name: string;
  brand: string;
  thumb: string;
}

/* ── orders ──────────────────────────────────────────────────────── */

export type PaymentMethod = 'mpesa' | 'card' | 'paypal' | 'cod';

export const ORDER_STATUSES = [
  'new',
  'confirmed',
  'paid',
  'packed',
  'dispatched',
  'delivered',
  'cancelled'
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderLine {
  id: string;
  name: string;
  ml: number;
  q: number;
  /** Unit price in KES. */
  price: number;
  /** price × q, in KES. */
  line: number;
}

export interface OrderCustomer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  notes?: string;
  payment: PaymentMethod;
}

export interface OrderNote {
  at: string;
  body: string;
}

export interface Order {
  ref: string;
  placedAt: string;
  updatedAt: string;
  status: OrderStatus;
  lines: OrderLine[];
  /** Every money field is in KES, the currency prices are stored in. */
  subtotal: number;
  discount: number;
  code: string;
  delivery: number;
  total: number;
  /** The currency the customer was reading prices in when they ordered. */
  displayCurrency: string;
  customer: OrderCustomer;
  notes: OrderNote[];
}
