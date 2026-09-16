/* Order arithmetic, shared by the checkout page and the order API.

   The rule that matters: an order is priced from the catalogue, never from
   what the browser sends. The client posts ids, sizes and quantities; the
   server looks up every price again and recomputes the total. A tampered
   basket therefore cannot change what is owed. */

import { byId } from './catalog';
import { config } from './config';
import type { Coupon, OrderLine } from './types';

export interface BasketItem {
  id: string;
  ml: number;
  q: number;
}

export interface PricedOrder {
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  code: string;
  delivery: number;
  total: number;
}

/** Turn ids/sizes/quantities into priced lines, dropping anything unknown. */
export function priceLines(items: BasketItem[]): OrderLine[] {
  return items
    .map((item) => {
      const p = byId(item.id);
      const size = p?.sizes.find((s) => s.ml === item.ml);
      if (!p || !size) return null;
      const q = Math.max(1, Math.min(99, Math.floor(item.q) || 1));
      return {
        id: p.id,
        name: `${p.brand} ${p.name}`,
        ml: size.ml,
        q,
        price: size.price,
        line: size.price * q
      } satisfies OrderLine;
    })
    .filter((l): l is OrderLine => l !== null);
}

export function lookupCoupon(code: string | null | undefined): (Coupon & { code: string }) | null {
  if (!code) return null;
  const key = code.trim().toUpperCase();
  const hit = config.coupons[key];
  return hit ? { ...hit, code: key } : null;
}

export function discountFor(
  lines: OrderLine[],
  subtotal: number,
  coupon: (Coupon & { code: string }) | null
): number {
  if (!coupon || coupon.freeDelivery) return 0;
  if (coupon.family) {
    const part = lines.reduce(
      (a, l) => a + (byId(l.id)?.family === coupon.family ? l.line : 0),
      0
    );
    return Math.round((part * coupon.pct) / 100);
  }
  return Math.round((subtotal * coupon.pct) / 100);
}

/** The whole sum: lines, discount, delivery and total, all in KES. */
export function priceOrder(items: BasketItem[], couponCode?: string | null): PricedOrder {
  const lines = priceLines(items);
  const coupon = lookupCoupon(couponCode);
  const subtotal = lines.reduce((a, l) => a + l.line, 0);
  const discount = discountFor(lines, subtotal, coupon);
  let delivery = subtotal - discount >= config.freeDeliveryOver ? 0 : config.deliveryFlat;
  if (!lines.length) delivery = 0;
  if (coupon?.freeDelivery) delivery = 0;
  return {
    lines,
    subtotal,
    discount,
    code: discount || coupon?.freeDelivery ? (coupon?.code ?? '') : '',
    delivery,
    total: subtotal - discount + delivery
  };
}
