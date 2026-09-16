/* GET /api/admin/orders — the whole order book, newest first.
   Behind the admin session; an unauthenticated caller gets a 401 and
   nothing else. */

import { NextResponse } from 'next/server';

import { isAdmin } from '@/lib/server/auth';
import { listOrders } from '@/lib/server/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 });
  }
  try {
    return NextResponse.json({ ok: true, orders: await listOrders() });
  } catch (err) {
    console.error('[admin] could not read the order book', err);
    return NextResponse.json(
      { ok: false, error: 'The order book could not be read.' },
      { status: 500 }
    );
  }
}
