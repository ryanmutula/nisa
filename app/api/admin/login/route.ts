/* POST /api/admin/login — exchange the admin password for a session. */

import { NextResponse } from 'next/server';

import {
  SESSION_COOKIE,
  adminConfigured,
  clearFailures,
  issueToken,
  loginBlocked,
  noteFailure,
  sessionCookieOptions,
  verifyPassword
} from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function callerKey(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0].trim() : '') || request.headers.get('x-real-ip') || 'local';
}

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'No admin password is set on the server. Add ADMIN_PASSWORD to your environment and restart.'
      },
      { status: 503 }
    );
  }

  const key = callerKey(request);
  if (loginBlocked(key)) {
    return NextResponse.json(
      { ok: false, error: 'Too many attempts. Try again in fifteen minutes.' },
      { status: 429 }
    );
  }

  let password = '';
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === 'string' ? body.password : '';
  } catch {
    password = '';
  }

  if (!verifyPassword(password)) {
    noteFailure(key);
    return NextResponse.json({ ok: false, error: 'That password is not right.' }, { status: 401 });
  }

  clearFailures(key);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, issueToken(), sessionCookieOptions());
  return response;
}
