/* GET /api/admin/session — is this browser signed in? */

import { NextResponse } from 'next/server';

import { adminConfigured, isAdmin } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ signedIn: await isAdmin(), configured: adminConfigured() });
}
