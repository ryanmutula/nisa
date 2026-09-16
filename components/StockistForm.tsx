'use client';

/* The trade enquiry. The country list is the delivery markets plus
   "Elsewhere", because a distributor may be asking from outside them. */

import { deliveryMarkets } from '@/lib/money';

import EnquiryForm from './EnquiryForm';

const TYPES = [
  'Perfume boutique',
  'Beauty or salon',
  'Pharmacy or supermarket',
  'Duty-free or hotel',
  'Online reseller',
  'Distributor',
  'Other'
];

const TIERS = [
  'Opening order — 12 units',
  'Stockist — 36 units a quarter',
  'Distributor — territory',
  'Not sure yet'
];

export default function StockistForm() {
  return (
    <EnquiryForm kind="wholesale" submitLabel="Send the enquiry" data-r>
      <div className="grid cols-2" style={{ gap: 'var(--space-4)' }}>
        <div className="field">
          <label htmlFor="w-biz">Business name</label>
          <input className="in" id="w-biz" name="business" autoComplete="organization" required />
        </div>
        <div className="field">
          <label htmlFor="w-name">Your name</label>
          <input className="in" id="w-name" name="name" autoComplete="name" required />
        </div>
      </div>

      <div className="grid cols-2" style={{ gap: 'var(--space-4)' }}>
        <div className="field">
          <label htmlFor="w-mail">Email</label>
          <input
            className="in"
            id="w-mail"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="w-tel">Phone or WhatsApp</label>
          <input
            className="in"
            id="w-tel"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
          />
        </div>
      </div>

      <div className="grid cols-2" style={{ gap: 'var(--space-4)' }}>
        <div className="field">
          <label htmlFor="w-country">Country</label>
          <select className="in" id="w-country" name="country" autoComplete="country-name">
            {deliveryMarkets().map((m) => (
              <option key={m.code}>{m.country}</option>
            ))}
            <option>Elsewhere</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="w-type">Type of business</label>
          <select className="in" id="w-type" name="business_type">
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="w-tier">Tier you are interested in</label>
        <select className="in" id="w-tier" name="tier">
          {TIERS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="w-msg">What you would like to stock</label>
        <textarea
          className="in"
          id="w-msg"
          name="message"
          placeholder="Houses, families, sizes, roughly what volume."
        />
      </div>
    </EnquiryForm>
  );
}
