import type { Metadata } from 'next';

import AdminConsole from '@/components/admin/AdminConsole';

export const metadata: Metadata = {
  title: 'The order desk',
  robots: { index: false, follow: false, nocache: true }
};

/* The order book is read per request, never cached. */
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return <AdminConsole />;
}
