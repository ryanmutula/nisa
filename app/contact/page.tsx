import type { Metadata } from 'next';
import Link from 'next/link';

import ContactForm from '@/components/ContactForm';
import { config } from '@/lib/config';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Call, WhatsApp or email Nisa Perfumes. Mon–Fri 8am–6pm, Sat–Sun 9am–4pm.'
};

const FAQ: [string, string][] = [
  [
    'Is everything you sell authentic?',
    'Yes. We buy from the houses and their appointed distributors only, and every carton is traceable to a batch.'
  ],
  [
    'How fast is delivery?',
    'Nairobi next day. Kampala, Kigali and Dar within the week. Lusaka on a weekly consolidated run.'
  ],
  [
    'Can I pay with M-Pesa?',
    'Yes, and by card, PayPal, or cash on delivery in Nairobi, Mombasa and Kisumu.'
  ],
  [
    'Can I try before I buy?',
    'Every order carries two 2ml samples. Tell us what you are after and we will pick them to suit.'
  ],
  [
    'Something arrived wrong?',
    'Tell us within seven days, sealed or not, and we replace it or refund it.'
  ]
];

export default function ContactPage() {
  return (
    <>
      <div className="wrap crumb muted">
        <Link href={routes.home}>Home</Link> · Contact
      </div>

      <section
        className="wrap"
        style={{ paddingBlock: 'clamp(24px,4vw,56px) clamp(40px,6vw,80px)' }}
      >
        <div data-r style={{ maxWidth: '26ch' }}>
          <p className="kicker" data-s="1">
            Contact
          </p>
          <h1 className="d1" data-s="2">
            Ask us
            <br />
            anything.
          </h1>
        </div>
        <p className="lead" data-r style={{ marginTop: 'var(--space-6)', maxWidth: '54ch' }}>
          Not sure what to buy, chasing an order, or looking for something we do not list? WhatsApp
          is the fastest way to reach a person.
        </p>
      </section>

      <div className="wrap">
        <div className="trust" data-r>
          <div data-s="1">
            <strong>
              <a href={`tel:${config.phoneRaw}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {config.phone}
              </a>
            </strong>
            <span className="small muted">Call or WhatsApp</span>
          </div>
          <div data-s="2">
            <strong>
              <a
                href={`mailto:${config.email}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {config.email}
              </a>
            </strong>
            <span className="small muted">Email, answered same day</span>
          </div>
          <div data-s="3">
            <strong>Mon–Fri 8am–6pm</strong>
            <span className="small muted">Sat–Sun 9am–4pm (EAT)</span>
          </div>
          <div data-s="4">
            <strong>Nairobi, Kenya</strong>
            <span className="small muted">Collection by appointment</span>
          </div>
        </div>
      </div>

      <section className="band wrap">
        <div className="split" style={{ alignItems: 'start' }}>
          <ContactForm />

          <div data-r>
            <div className="fig land" style={{ marginBottom: 'var(--space-6)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/editorial/counter.webp"
                alt="A customer testing a blotter at the counter"
                loading="lazy"
              />
            </div>
            <h2 className="d3">Before you write</h2>
            <div className="pyr" style={{ marginTop: 'var(--space-4)' }}>
              {FAQ.map(([q, a]) => (
                <div key={q} style={{ gridTemplateColumns: '1fr' }}>
                  <span className="t">{q}</span>
                  <span className="muted small">{a}</span>
                </div>
              ))}
            </div>
            <div className="note" style={{ marginTop: 'var(--space-6)' }}>
              Looking for trade pricing? The <Link href={routes.wholesale}>wholesale page</Link> has
              the tiers and a form built for it.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
