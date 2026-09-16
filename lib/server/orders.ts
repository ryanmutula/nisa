/* ═══════════════════════════════════════════════════════════════════
   The order book.

   Orders are kept in one JSON file under data/, which needs nothing
   installed and survives a restart. Every read and write goes through
   the functions below, so swapping the file for Postgres, Mongo or a
   KV store is a matter of reimplementing readAll()/writeAll() — no
   caller changes.

   One caveat worth knowing before you deploy: a read-only or ephemeral
   filesystem (Vercel's serverless functions, most container platforms
   without a mounted volume) cannot keep this file. Point ORDERS_FILE at
   a mounted volume, or replace the two functions with a database.
   ═══════════════════════════════════════════════════════════════════ */

import { randomBytes } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Order, OrderStatus } from '../types';

const FILE =
  process.env.ORDERS_FILE ?? path.join(process.cwd(), 'data', 'orders.json');

/* Writes are serialised through this promise chain. Two orders placed in
   the same tick would otherwise read the same array and one would lose. */
let queue: Promise<unknown> = Promise.resolve();

function serialise<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(job, job);
  queue = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}

async function writeAll(orders: Order[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  /* Write beside the target and rename, so a crash mid-write cannot
     truncate the order book. */
  const tmp = `${FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(orders, null, 1), 'utf8');
  await fs.rename(tmp, FILE);
}

/** NISA-20260916-4F2A — the customer's reference, and our primary key. */
export function newRef(now = new Date()): string {
  const stamp =
    String(now.getFullYear()) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const tail = randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
  return `NISA-${stamp}-${tail}`;
}

export async function listOrders(): Promise<Order[]> {
  const all = await readAll();
  return all.sort((a, b) => b.placedAt.localeCompare(a.placedAt));
}

export async function getOrder(ref: string): Promise<Order | undefined> {
  const all = await readAll();
  return all.find((o) => o.ref === ref);
}

export async function saveOrder(order: Order): Promise<Order> {
  return serialise(async () => {
    const all = await readAll();
    /* A reference collision is vanishingly unlikely, but cheap to rule out. */
    let ref = order.ref;
    while (all.some((o) => o.ref === ref)) ref = newRef();
    const stored = { ...order, ref };
    all.push(stored);
    await writeAll(all);
    return stored;
  });
}

export interface OrderPatch {
  status?: OrderStatus;
  note?: string;
}

export async function updateOrder(ref: string, patch: OrderPatch): Promise<Order | undefined> {
  return serialise(async () => {
    const all = await readAll();
    const i = all.findIndex((o) => o.ref === ref);
    if (i < 0) return undefined;
    const order = all[i];
    const next: Order = {
      ...order,
      status: patch.status ?? order.status,
      notes: patch.note?.trim()
        ? [...order.notes, { at: new Date().toISOString(), body: patch.note.trim() }]
        : order.notes,
      updatedAt: new Date().toISOString()
    };
    all[i] = next;
    await writeAll(all);
    return next;
  });
}

export async function deleteOrder(ref: string): Promise<boolean> {
  return serialise(async () => {
    const all = await readAll();
    const next = all.filter((o) => o.ref !== ref);
    if (next.length === all.length) return false;
    await writeAll(next);
    return true;
  });
}
