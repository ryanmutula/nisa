import type { OrderStatus } from '@/lib/types';

export default function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span className="adm-pill" data-s={status}>
      {status}
    </span>
  );
}
