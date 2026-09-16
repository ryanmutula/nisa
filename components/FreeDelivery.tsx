'use client';

/* The hairline that fills as an order approaches free delivery. */

import { config } from '@/lib/config';

import { useStore } from './store';

export default function FreeDelivery({ total }: { total: number }) {
  const { money } = useStore();
  const need = config.freeDeliveryOver - total;
  const pct = Math.max(0, Math.min(1, total / config.freeDeliveryOver));

  return (
    <div className="prog">
      <div className="prog-rail">
        <span style={{ transform: `scaleX(${pct})` }} />
      </div>
      <p className="small muted" style={{ margin: 0 }}>
        {need <= 0 ? 'Delivery is on us.' : `${money(need)} more for free delivery.`}
      </p>
    </div>
  );
}
