/* The five markets and how long each takes. */

import { deliveryMarkets } from '@/lib/money';

export default function MarketTable() {
  return (
    <div className="tbl-scroll">
      <table className="tbl">
        <thead>
          <tr>
            <th>Market</th>
            <th>Delivery</th>
          </tr>
        </thead>
        <tbody>
          {deliveryMarkets().map((m) => (
            <tr key={m.code}>
              <td>
                {m.flag} {m.country}
              </td>
              <td className="muted">{m.delivery}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
