/* Money. Prices are held once, in Kenyan shillings; every other currency
   is derived from a market's rate at the moment it is displayed. */

import { config } from './config';
import type { Market } from './types';

export const MARKET_KEY = 'nisa:market:v2';

export function deliveryMarkets(): Market[] {
  return config.markets.filter((m) => !m.currencyOnly);
}

export function marketByCode(code: string | null | undefined): Market {
  return (
    config.markets.find((m) => m.code === code) ??
    config.markets.find((m) => m.code === config.defaultMarket) ??
    config.markets[0]
  );
}

/** Format a KES amount in the given market's currency. */
export function format(kes: number, market: Market): string {
  const v = kes * market.rate;
  // USD/EUR need decimals; shillings do not.
  const cents = market.rate < 0.05;
  const d = cents ? Math.round(v * 100) / 100 : Math.round(v);
  return (
    market.symbol +
    ' ' +
    d.toLocaleString('en-US', cents ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {})
  );
}

/** KES with no market involved — what the admin dashboard reports in. */
export function formatKes(kes: number): string {
  return 'KSh ' + Math.round(kes).toLocaleString('en-US');
}
