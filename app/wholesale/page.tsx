import type { Metadata } from 'next';
import Link from 'next/link';

import StockistForm from '@/components/StockistForm';
import { config } from '@/lib/config';
import { routes, whatsAppUrl } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Wholesale & distribution',
  description:
    'Wholesale fragrance supply for retailers, boutiques and resellers across Kenya, Uganda, Tanzania, Rwanda and Zambia. Trade pricing from twelve units.'
};

const WHY = [
  {
    h: 'One consolidation point',
    p: 'Your order is picked from one Nairobi holding, not assembled from three suppliers with three sets of paperwork and three chances to go missing.'
  },
  {
    h: 'Landed pricing, quoted once',
    p: 'Quotes include duty and inland freight to your city. No surprise line items when the invoice arrives.'
  },
  {
    h: 'Weekly stock list',
    p: 'A live list of what is on the floor, in what size, with what quantity — so you do not sell what we do not have.'
  },
  {
    h: 'One contact',
    p: 'The person who quotes you is the person who confirms the dispatch. Mon–Fri 8am–6pm, Sat–Sun 9am–4pm.'
  }
];

const TIERS = [
  [
    'Opening order',
    '12 units, mixed',
    'Up to 25%',
    'Payment on dispatch',
    'Tester set at cost, shelf card for each house'
  ],
  [
    'Stockist',
    '36 units per quarter',
    'Up to 35%',
    '50% deposit, balance on delivery',
    'Free testers, staff scent training, priority on limited stock'
  ],
  [
    'Distributor',
    'By territory agreement',
    'By negotiation',
    '30 days on approved account',
    'Territory protection, joint marketing budget, sell-through reporting'
  ]
];

export default function WholesalePage() {
  return (
    <>
      <div className="wrap crumb muted">
        <Link href={routes.home}>Home</Link> · Wholesale
      </div>

      <section
        className="wrap"
        style={{ paddingBlock: 'clamp(24px,4vw,56px) clamp(48px,7vw,96px)' }}
      >
        <div className="split wide" style={{ alignItems: 'end' }}>
          <div data-r>
            <p className="kicker" data-s="1">
              For the trade
            </p>
            <h1 className="d1" data-s="2">
              Stock Nisa.
            </h1>
            <p className="lead" data-s="3" style={{ marginTop: 'var(--space-4)' }}>
              Wholesale supply of eleven houses to boutiques, salons, pharmacies, duty-free and
              online resellers in five markets. Trade pricing starts at twelve units, mixed across
              the range.
            </p>
          </div>
          <div data-r>
            <div className="fig por">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/editorial/boutique.webp"
                alt="A stockist behind the counter of her perfume boutique"
                loading="lazy"
              />
            </div>
            <div className="note" style={{ marginTop: 'var(--space-4)' }}>
              Already trading with us? Send your top-up list straight to{' '}
              <a href={whatsAppUrl(config.phoneRaw)} target="_blank" rel="noopener">
                WhatsApp
              </a>{' '}
              and we will confirm stock the same day.
            </div>
          </div>
        </div>
      </section>

      <section className="band wrap">
        <div data-r style={{ maxWidth: '44ch' }}>
          <p className="kicker">Why us</p>
          <h2 className="d2">The hard part is not buying. It is landing.</h2>
        </div>
        <div className="steps" data-r style={{ marginTop: 'var(--space-8)' }}>
          {WHY.map((s, i) => (
            <div key={s.h} data-s={i + 1}>
              <h3>{s.h}</h3>
              <p className="muted small">{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="band dark">
        <div className="wrap">
          <div data-r style={{ maxWidth: '40ch' }}>
            <p className="kicker">Trade terms</p>
            <h2 className="d2">Three tiers.</h2>
          </div>
          <div className="tbl-scroll" style={{ marginTop: 'var(--space-8)' }} data-r>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Minimum</th>
                  <th>Margin off retail</th>
                  <th>Terms</th>
                  <th>Support</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map(([tier, min, margin, terms, support]) => (
                  <tr key={tier}>
                    <td>
                      <strong>{tier}</strong>
                    </td>
                    <td>{min}</td>
                    <td>{margin}</td>
                    <td>{terms}</td>
                    <td className="muted">{support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 'var(--space-4)', color: 'rgba(239,236,230,.6)' }} className="small">
            Figures are indicative and confirmed in writing on your quote. Territory agreements are
            market by market.
          </p>
        </div>
      </section>

      <section className="band wrap" id="stockist">
        <div className="split" style={{ alignItems: 'start' }}>
          <div data-r>
            <p className="kicker">Become a stockist</p>
            <h2 className="d2">Tell us what you sell.</h2>
            <p className="muted" style={{ maxWidth: '38ch' }}>
              Two working days for a quote, including landed cost to your city and what we can
              dispatch this week. If you would rather talk it through, call{' '}
              <a href={`tel:${config.phoneRaw}`}>{config.phone}</a>.
            </p>
            <div className="note" style={{ marginTop: 'var(--space-6)' }}>
              We also run a referral arrangement for agents and shop-in-shop partners. Mention it
              in the form and we will send the terms.
            </div>
          </div>
          <StockistForm />
        </div>
      </section>
    </>
  );
}
