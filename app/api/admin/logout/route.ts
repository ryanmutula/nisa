/* POST /api/admin/logout — drop the session cookie. */

import { NextResponse } from 'next/server';

import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
