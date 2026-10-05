/* The home page. Server-rendered top to bottom; the pieces that move —
   the hero swatch, the two push-ins, the film band, the slideshow and
   the shelf — are the client components imported below. */

import Link from 'next/link';

import BrandWall from '@/components/home/BrandWall';
import CampaignPair from '@/components/home/CampaignPair';
import DollyBand from '@/components/home/DollyBand';
import FilmBand from '@/components/home/FilmBand';
import HeroStage from '@/components/home/HeroStage';
import HouseAtWork from '@/components/home/HouseAtWork';
import Newsletter from '@/components/home/Newsletter';
import Intro from '@/components/Intro';
import MarketTable from '@/components/MarketTable';
import RecentlyViewed from '@/components/RecentlyViewed';
import Shelf from '@/components/Shelf';
import { asset, countInFamily, families, products, tagged } from '@/lib/catalog';
import { routes, shopUrl } from '@/lib/routes';

const STEPS = [
  {
    h: 'Bought at source',
    p: 'Direct from each house or its appointed distributor. No grey market, no parallel imports, no bottles of unknown age.'
  },
  {
    h: 'Consolidated once',
    p: 'Everything lands at one Nairobi point and is checked against the packing list before it moves again.'
  },
  {
    h: 'Kept out of the heat',
    p: 'Fragrance dies in a hot warehouse. Ours is shaded, ventilated and stocked away from direct light.'
  },
  {
    h: 'Shipped to the region',
    p: 'Nairobi next day. Kampala, Kigali and Dar within the week. Lusaka on a weekly consolidated run.'
  }
];

const TRUST = [
  ['Authorised stock only', 'Batch-traceable, bought from the house.'],
  ['Samples with every order', 'Two 2ml vials, chosen to match what you bought.'],
  ['M-Pesa & card', 'Pay the way you already pay.'],
  ['A person on the phone', 'Mon–Fri 8am–6pm, Sat–Sun 9am–4pm.']
];

export default function HomePage() {
  const featured = tagged('bestseller').slice(0, 8);
  // the bottle that stands on its own plate inside the oud band
  const oudHero = products.find((p) => p.family === 'oud') ?? products[0];

  return (
    <>
      <Intro />

      {/* hero */}
      <section className="wrap hero">
        <div className="hero-copy" data-r>
          <p className="kicker" data-s="1">
            Nairobi · Kampala · Dar es Salaam · Kigali · Lusaka
          </p>
          <h1 className="d1" data-s="2">
            Scent kept
            <br />
            <span className="it">whole.</span>
          </h1>
          <p className="lead muted" data-s="3">
            Ten houses, bought at source and carried the short way — so what reaches you smells
            the way the perfumer signed it off.
          </p>
          <div className="hero-cta" data-s="4">
            <Link className="b gold" href={routes.shop}>
              <span>Shop the shelf</span>
            </Link>
            <Link className="b" href={routes.wholesale}>
              <span>Stock Nisa</span>
            </Link>
          </div>
        </div>
        <HeroStage />
      </section>

      <BrandWall />
      <DollyBand />
      <FilmBand />
      <CampaignPair />

      {/* families */}
      <section className="band wrap">
        <div className="split wide" style={{ alignItems: 'end' }} data-r>
          <div>
            <p className="kicker">Shop by the way it smells</p>
            <h2 className="d2" style={{ maxWidth: '22ch' }}>
              Nine families. Start with the one you already reach for.
            </h2>
          </div>
          <div className="fig land">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/editorial/materials.webp"
              alt="Oud wood, dried rose, bergamot, amber resin, cinnamon and vetiver root laid out on linen"
              loading="lazy"
            />
          </div>
        </div>
        <div className="fams" data-r style={{ marginTop: 'var(--space-8)' }}>
          {families.map((f, i) => {
            const n = countInFamily(f.slug);
            return (
              <Link
                className="fam-tile"
                key={f.slug}
                href={shopUrl({ family: f.slug })}
                data-s={(i % 6) + 1}
              >
                <span className="d3">{f.label}</span>
                <span className="c">
                  {n} fragrance{n === 1 ? '' : 's'}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* featured shelf */}
      <section className="band wrap">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            gap: 'var(--space-6)',
            flexWrap: 'wrap'
          }}
          data-r
        >
          <div>
            <p className="kicker">Moving fastest</p>
            <h2 className="d2">What the region is wearing</h2>
          </div>
          <Link className="lnk" href={shopUrl({ tag: 'bestseller' })}>
            All bestsellers
          </Link>
        </div>
        <div data-r style={{ marginTop: 'var(--space-8)' }}>
          <Shelf products={featured} />
        </div>
      </section>

      {/* the oud library */}
      <section className="band dark">
        <div className="wrap split wide">
          <div data-r>
            <p className="kicker" data-s="1">
              The oud library
            </p>
            <h2 className="d2" data-s="2">
              Resin, not sugar.
              <br />
              Hours, not minutes.
            </h2>
            <p className="lead" data-s="3" style={{ color: 'rgba(239,236,230,.78)' }}>
              Oud is the oldest thing on this shelf and the hardest to fake. Montale and Mancera
              build theirs around Indian and Laotian agarwood; Initio and Nishane take it
              somewhere stranger. These are the bottles we keep coolest, and the ones that outlast
              everything else in the bag.
            </p>
            <div style={{ marginTop: 'var(--space-6)' }} data-s="4">
              <Link className="b light" href={shopUrl({ family: 'oud' })}>
                <span>Enter the library</span>
              </Link>
            </div>
          </div>
          <div data-r="scale">
            <div className="fig por" style={{ marginBottom: 'var(--space-3)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/editorial/attar-vial.webp"
                alt="A vial of amber oil held to the light"
                loading="lazy"
              />
            </div>
            <div
              className="attar-stage"
              style={{
                position: 'relative',
                aspectRatio: '1 / 1.12',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid rgba(239,236,230,.14)'
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(oudHero.image)}
                alt={`${oudHero.brand} ${oudHero.name} bottle`}
                loading="lazy"
                style={{ maxHeight: '78%', width: 'auto' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* how we source */}
      <section className="band wrap">
        <div data-r style={{ maxWidth: '44ch' }}>
          <p className="kicker">How a bottle reaches you</p>
          <h2 className="d2">Four steps, no detours.</h2>
        </div>
        <div className="steps" data-r style={{ marginTop: 'var(--space-8)' }}>
          {STEPS.map((s, i) => (
            <div key={s.h} data-s={i + 1}>
              <h3>{s.h}</h3>
              <p className="muted small">{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* the house at work */}
      <section className="band wrap">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            gap: 'var(--space-6)',
            flexWrap: 'wrap'
          }}
          data-r
        >
          <div>
            <p className="kicker">The house at work</p>
            <h2 className="d2">Three rooms, one chain.</h2>
          </div>
          <Link className="lnk" href={routes.about}>
            How we source
          </Link>
        </div>
        <HouseAtWork />
      </section>

      {/* trade */}
      <section className="band dark">
        <div className="wrap split">
          <div data-r>
            <p className="kicker" data-s="1">
              For the trade
            </p>
            <h2 className="d2" data-s="2">
              If you sell fragrance in East Africa, we can supply you.
            </h2>
            <p className="lead" data-s="3" style={{ color: 'rgba(239,236,230,.78)' }}>
              Boutiques, salons, pharmacies, duty-free and online resellers across five markets.
              Wholesale pricing from twelve units, a stock list that updates weekly, and one
              contact who answers.
            </p>
            <div
              style={{
                marginTop: 'var(--space-6)',
                display: 'flex',
                gap: 'var(--space-3)',
                flexWrap: 'wrap'
              }}
              data-s="4"
            >
              <Link className="b light" href={routes.wholesale}>
                <span>Wholesale terms</span>
              </Link>
              <Link className="b light" href={`${routes.wholesale}#stockist`}>
                <span>Become a stockist</span>
              </Link>
            </div>
          </div>
          <div data-r>
            <MarketTable />
          </div>
        </div>
      </section>

      {/* newsletter */}
      <section className="band wrap">
        <div className="split" style={{ alignItems: 'start' }}>
          <div data-r>
            <p className="kicker">Stay close</p>
            <h2 className="d2">New arrivals, before the shelf.</h2>
            <p className="muted" style={{ maxWidth: '40ch' }}>
              One note a month: what has landed, what is nearly gone, and the occasional bottle we
              only got six of.
            </p>
            <div className="fig land" style={{ marginTop: 'var(--space-6)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/editorial/gift.webp"
                alt="A ribboned parcel passed from one pair of hands to another"
                loading="lazy"
              />
            </div>
          </div>
          <Newsletter />
        </div>
      </section>

      <RecentlyViewed />

      {/* trust */}
      <div className="wrap">
        <div className="trust" data-r>
          {TRUST.map(([strong, small], i) => (
            <div key={strong} data-s={i + 1}>
              <strong>{strong}</strong>
              <span className="small muted">{small}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
