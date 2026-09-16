/* ═══════════════════════════════════════════════════════════════════
   Admin authentication.

   One password, held in the environment, and a signed session cookie.
   There is no user table because there is one administrator; if that
   changes, replace verifyPassword() with a lookup and put the account
   id in the token's payload, which already carries one.

   The cookie is HMAC-signed, httpOnly and SameSite=Lax. It is not
   encrypted — it holds nothing but an issue time and an expiry, so
   there is nothing in it to hide. What it cannot be is forged without
   ADMIN_SESSION_SECRET.
   ═══════════════════════════════════════════════════════════════════ */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'nisa_admin';

/** Twelve hours: long enough for a working day, short enough to matter. */
const SESSION_MS = 12 * 60 * 60 * 1000;

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'ADMIN_SESSION_SECRET is missing or too short. Set it to at least 16 random characters.'
    );
  }
  /* Development only: a fixed fallback so `npm run dev` works out of the
     box. Sessions signed with it do not survive into production, because
     production refuses to start without a real secret. */
  return 'nisa-development-secret-not-for-production';
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Is a password configured at all? A blank one locks the dashboard shut. */
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

export function issueToken(now = Date.now()): string {
  const payload = `${now}.${now + SESSION_MS}`;
  return `${payload}.${sign(payload)}`;
}

export function tokenValid(token: string | undefined, now = Date.now()): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [issued, expires, mac] = parts;
  if (!safeEqual(mac, sign(`${issued}.${expires}`))) return false;
  const exp = Number(expires);
  return Number.isFinite(exp) && exp > now;
}

/** True when the caller holds a valid admin session. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return tokenValid(store.get(SESSION_COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MS / 1000
  };
}

/* ── login throttling ────────────────────────────────────────────────
   Five wrong passwords from one address and it waits fifteen minutes.
   In-memory, so it resets on deploy and is per-instance — enough to make
   guessing a long password pointless, which is all it is for. */

const ATTEMPT_LIMIT = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { n: number; until: number }>();

export function loginBlocked(key: string, now = Date.now()): boolean {
  const hit = attempts.get(key);
  if (!hit) return false;
  if (hit.until < now) {
    attempts.delete(key);
    return false;
  }
  return hit.n >= ATTEMPT_LIMIT;
}

export function noteFailure(key: string, now = Date.now()): void {
  const hit = attempts.get(key);
  if (!hit || hit.until < now) {
    attempts.set(key, { n: 1, until: now + ATTEMPT_WINDOW_MS });
    return;
  }
  hit.n += 1;
}

export function clearFailures(key: string): void {
  attempts.delete(key);
}
