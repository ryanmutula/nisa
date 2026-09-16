/* POST /api/orders — place an order.

   The body carries the basket as ids, sizes and quantities plus the
   customer's details. Nothing about money is read from it: priceOrder()
   values every line from the catalogue again, so the total stored is the
   total the catalogue says, whatever the browser claimed. */

import { NextResponse } from 'next/server';

import { deliveryMarkets, marketByCode } from '@/lib/money';
import { priceOrder, type BasketItem } from '@/lib/pricing';
import { newRef, saveOrder } from '@/lib/server/orders';
import type { Order, OrderCustomer, PaymentMethod } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAYMENTS: PaymentMethod[] = ['mpesa', 'card', 'paypal', 'cod'];

function str(v: unknown, max = 400): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest('Expected a JSON body.');
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const rawItems = Array.isArray(payload.items) ? payload.items : [];
  const items: BasketItem[] = rawItems
    .map((raw) => {
      const item = (raw ?? {}) as Record<string, unknown>;
      return { id: str(item.id, 80), ml: Number(item.ml), q: Number(item.q) };
    })
    .filter((i) => i.id && Number.isFinite(i.ml) && Number.isFinite(i.q));

  if (!items.length) return badRequest('The bag is empty.');

  const rawCustomer = (payload.customer ?? {}) as Record<string, unknown>;
  const payment = str(rawCustomer.payment, 20) as PaymentMethod;
  const customer: OrderCustomer = {
    first_name: str(rawCustomer.first_name, 80),
    last_name: str(rawCustomer.last_name, 80),
    email: str(rawCustomer.email, 160),
    phone: str(rawCustomer.phone, 40),
    country: str(rawCustomer.country, 80),
    city: str(rawCustomer.city, 80),
    address: str(rawCustomer.address, 600),
    notes: str(rawCustomer.notes, 800),
    payment: PAYMENTS.includes(payment) ? payment : 'mpesa'
  };

  const required: (keyof OrderCustomer)[] = [
    'first_name',
    'last_name',
    'email',
    'phone',
    'city',
    'address'
  ];
  const missing = required.filter((k) => !customer[k]);
  if (missing.length) return badRequest(`Missing: ${missing.join(', ')}.`);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.email)) {
    return badRequest('That email address does not look right.');
  }
  if (!deliveryMarkets().some((m) => m.country === customer.country)) {
    customer.country = deliveryMarkets()[0].country;
  }

  const priced = priceOrder(items, str(payload.code, 40));
  if (!priced.lines.length) return badRequest('Nothing in the bag is still in the catalogue.');

  const now = new Date().toISOString();
  const order: Order = {
    ref: newRef(),
    placedAt: now,
    updatedAt: now,
    status: 'new',
    ...priced,
    displayCurrency: marketByCode(str(payload.market, 4)).currency,
    customer,
    notes: []
  };

  try {
    const stored = await saveOrder(order);
    return NextResponse.json({ ok: true, order: stored }, { status: 201 });
  } catch (err) {
    console.error('[orders] could not store the order', err);
    /* The order book is unreachable. Hand the reference back anyway so the
       customer can still confirm on WhatsApp — losing the sale over a disk
       problem is the worse failure. */
    return NextResponse.json(
      { ok: false, stored: false, order, error: 'The order could not be filed.' },
      { status: 503 }
    );
  }
}
