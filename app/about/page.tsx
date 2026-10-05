import type { Metadata } from 'next';
import Link from 'next/link';

import MarketTable from '@/components/MarketTable';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Our house',
  description:
    'How Nisa Perfumes sources, stores and distributes fragrance across Kenya, Uganda, Tanzania, Rwanda and Zambia.'
};

const CHAIN = [
  {
    h: 'Bought at source',
    p: 'Direct from each house or its appointed distributor. No grey market, no parallel imports, no bottles of unknown age. Every carton arrives with paperwork that ties it to a batch.'
  },
  {
    h: 'Consolidated once',
    p: 'Everything lands at one Nairobi point and is checked against the packing list before it moves again. One handover instead of four is the single biggest thing you can do for a fragile product.'
  },
  {
    h: 'Kept out of the heat',
    p: 'Fragrance oxidises in a hot warehouse and light flattens the top notes. Ours is shaded, ventilated and stocked away from direct sun; fast-moving oud sits on the coolest wall.'
  },
  {
    h: 'Shipped to the region',
    p: 'Nairobi next day. Kampala, Kigali and Dar es Salaam within the week. Lusaka on a weekly consolidated run, which keeps the freight cost off the bottle price.'
  }
];

const POLICY: [string, string][] = [
  [
    'We buy from',
    'Houses, their appointed regional distributors, and authorised duty-free channels.'
  ],
  [
    'We do not buy',
    'Unsourced stock, tester-only cartons sold as retail, or anything offered below landed cost.'
  ],
  ['Every order carries', 'Two 2ml samples chosen to sit next to what you bought.'],
  ['If a bottle is wrong', 'Tell us within seven days, sealed or not, and we replace it or refund it.']
];

export default function AboutPage() {
  return (
    <>
      <div className="wrap crumb muted">
        <Link href={routes.home}>Home</Link> · Our house
      </div>

      <section
        className="wrap"
        style={{ paddingBlock: 'clamp(24px,4vw,56px) clamp(48px,7vw,96px)' }}
      >
        <div data-r style={{ maxWidth: '20ch' }}>
          <p className="kicker" data-s="1">
            Our house
          </p>
          <h1 className="d1" data-s="2">
            Bought at
            <br />
            source.
          </h1>
        </div>
        <p className="lead" data-r style={{ marginTop: 'var(--space-6)', maxWidth: '58ch' }}>
          Nisa Perfumes buys niche and luxury fragrance from
          the houses themselves and their appointed distributors, and moves it into five East and
          Southern African markets. We sell two ways from the same holding:{' '}
          <strong>direct to you</strong>, one bottle at a time, and{' '}
          <strong>wholesale to the trade</strong> — boutiques, salons, pharmacies, duty-free and
          online resellers. The whole business is arranged around one problem: a perfume that
          travels badly does not smell like the perfume that was signed off.
        </p>
      </section>

      <section className="wrap" style={{ paddingBottom: 'clamp(24px,4vw,48px)' }}>
        <div className="split wide" style={{ alignItems: 'end' }} data-r>
          <div className="plate-img" style={{ aspectRatio: '4/5' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/editorial/nishane-hacivat.webp"
              alt="A customer holding Nishane Hacivat X"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="d2">
              Kenyan-run,
              <br />
              regionally supplied.
            </h2>
            <p className="muted" style={{ maxWidth: '36ch', marginTop: 'var(--space-4)' }}>
              One holding in Nairobi, five markets served, and ten houses we answer for by name.
            </p>
          </div>
        </div>
      </section>

      <section className="band wrap">
        <div className="split wide" style={{ alignItems: 'end' }} data-r>
          <div>
            <p className="kicker">The chain</p>
            <h2 className="d2">Four steps, no detours.</h2>
            <p className="muted" style={{ maxWidth: '36ch', marginTop: 'var(--space-4)' }}>
              Fewer handovers is the single biggest thing you can do for a fragile product.
            </p>
          </div>
          <div className="fig por">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/editorial/stockroom.webp"
              alt="Stock being checked against a packing list in the Nairobi holding"
              loading="lazy"
            />
          </div>
        </div>
        <div className="steps" data-r style={{ marginTop: 'var(--space-8)' }}>
          {CHAIN.map((s, i) => (
            <div key={s.h} data-s={i + 1}>
              <h3>{s.h}</h3>
              <p className="muted small">{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="band dark">
        <div className="wrap split wide">
          <div data-r>
            <p className="kicker" data-s="1">
              What we will and will not do
            </p>
            <h2 className="d2" data-s="2">
              Authenticity is a supply chain, not a sticker.
            </h2>
            <p className="lead" data-s="3" style={{ color: 'rgba(239,236,230,.78)' }}>
              Anyone can print a certificate. What actually keeps a counterfeit out of your hands is
              refusing to buy from anyone who cannot say where a bottle came from — and being
              willing to lose a margin over it.
            </p>
          </div>
          <div data-r>
            <div className="tbl-scroll">
              <table className="tbl">
                <tbody>
                  {POLICY.map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ width: '38%' }}>
                        <strong>{k}</strong>
                      </td>
                      <td className="muted">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="band wrap">
        <div className="split" style={{ alignItems: 'start' }}>
          <div data-r>
            <p className="kicker">The five markets</p>
            <h2 className="d2">Where we deliver.</h2>
            <p className="muted" style={{ maxWidth: '38ch' }}>
              Prices are held in Kenyan shillings and converted at the header switcher, so what you
              see is what you pay in your own currency.
            </p>
          </div>
          <div data-r>
            <MarketTable />
          </div>
        </div>
      </section>

      <section className="band wrap" id="two-ways">
        <div data-r style={{ maxWidth: '44ch' }}>
          <p className="kicker">Two ways to buy</p>
          <h2 className="d2">Retail and trade, one holding.</h2>
        </div>
        <div className="split wide" style={{ marginTop: 'var(--space-8)', alignItems: 'start' }}>
          <div data-r style={{ border: '1px solid var(--rule)', padding: 'var(--space-6)' }}>
            <h3 className="d3">For you — B2C</h3>
            <p className="muted">
              Buy a single bottle at the price on the shelf. Two 2ml samples travel with every
              order, chosen to sit beside what you bought. Nairobi next day, the region within the
              week, M-Pesa or card, and a person on the phone if you would rather be talked through
              it.
            </p>
            <div style={{ marginTop: 'var(--space-4)' }}>
              <Link className="b fill" href={routes.shop}>
                <span>Shop the shelf</span>
              </Link>
            </div>
          </div>
          <div data-r style={{ border: '1px solid var(--rule)', padding: 'var(--space-6)' }}>
            <h3 className="d3">For your shop — B2B</h3>
            <p className="muted">
              Wholesale supply from twelve units, mixed across ten houses, quoted landed to your
              city with duty and inland freight included. A stock list that updates weekly, testers
              at cost, staff scent training at stockist level, and territory agreements for
              distributors.
            </p>
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link className="b" href={routes.wholesale}>
                <span>Wholesale terms</span>
              </Link>
              <Link className="b" href={`${routes.wholesale}#stockist`}>
                <span>Become a stockist</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="band wrap" style={{ textAlign: 'center' }}>
        <div data-r>
          <h2 className="d2" style={{ maxWidth: '24ch', margin: '0 auto' }}>
            Come and smell something.
          </h2>
          <p className="muted" style={{ marginTop: 'var(--space-4)' }}>
            Or ask us what to try. We will send you in a direction before we sell you a bottle.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              marginTop: 'var(--space-6)',
              flexWrap: 'wrap'
            }}
          >
            <Link className="b gold" href={routes.shop}>
              <span>Shop the shelf</span>
            </Link>
            <Link className="b" href={routes.contact}>
              <span>Ask us</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
