/* PATCH /api/admin/orders/:ref — move an order along, or add a note.
   DELETE /api/admin/orders/:ref — remove one outright. */

import { NextResponse } from 'next/server';

import { isAdmin } from '@/lib/server/auth';
import { deleteOrder, updateOrder } from '@/lib/server/orders';
import { ORDER_STATUSES, type OrderStatus } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ ref: string }> };

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 });
  }

  const { ref } = await params;
  let body: { status?: unknown; note?: unknown } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Expected a JSON body.' }, { status: 400 });
  }

  const status =
    typeof body.status === 'string' && (ORDER_STATUSES as readonly string[]).includes(body.status)
      ? (body.status as OrderStatus)
      : undefined;
  const note = typeof body.note === 'string' ? body.note.slice(0, 1000) : undefined;

  if (!status && !note?.trim()) {
    return NextResponse.json(
      { ok: false, error: 'Send a status, a note, or both.' },
      { status: 400 }
    );
  }

  const order = await updateOrder(ref, { status, note });
  if (!order) return NextResponse.json({ ok: false, error: 'No such order.' }, { status: 404 });
  return NextResponse.json({ ok: true, order });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 });
  }
  const { ref } = await params;
  const gone = await deleteOrder(ref);
  if (!gone) return NextResponse.json({ ok: false, error: 'No such order.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
