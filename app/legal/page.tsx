import type { Metadata } from 'next';
import Link from 'next/link';

import { config } from '@/lib/config';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Terms, privacy & delivery',
  robots: { index: false, follow: false }
};

export default function LegalPage() {
  return (
    <>
      <div className="wrap crumb muted">
        <Link href={routes.home}>Home</Link> · Legal
      </div>

      <section
        className="wrap narrow"
        style={{ paddingBlock: 'clamp(24px,4vw,56px) clamp(64px,9vw,120px)' }}
      >
        <p className="kicker">Legal</p>
        <h1 className="d2">Terms, privacy and delivery</h1>

        <p className="note" style={{ marginTop: 'var(--space-6)' }}>
          These pages are a working draft written to describe how a distributor of this kind
          normally trades. Have them checked against Kenyan law and your own practice before
          publishing.
        </p>

        <h2 className="d3" style={{ marginTop: 'var(--space-8)' }}>
          Terms of sale
        </h2>
        <p>
          Prices are held in Kenyan shillings and converted to other currencies at the rate shown in
          the header switcher. The shilling price is the contract price. Prices include import duty
          and exclude delivery unless stated. We may correct an obviously mispriced item before
          dispatch, and will contact you before doing so.
        </p>
        <p>
          An order is accepted when we confirm it, not when it is placed. Where stock has moved
          between your order and our confirmation, we will offer the nearest equivalent or refund in
          full.
        </p>

        <h2 className="d3" style={{ marginTop: 'var(--space-8)' }}>
          Delivery
        </h2>
        <p>
          Nairobi next working day. Countrywide Kenya two to three days. Kampala and Kigali three to
          four days, Dar es Salaam three to five, Lusaka five to seven on a weekly consolidated run.
          Delivery is complimentary above the threshold shown in your bag. Cross-border orders may
          attract local duty, which is the recipient&rsquo;s responsibility.
        </p>

        <h2 className="d3" style={{ marginTop: 'var(--space-8)' }}>
          Returns
        </h2>
        <p>
          Tell us within seven days of delivery if something is wrong — damaged, not what you
          ordered, or not what it claims to be, sealed or not — and we will replace it or refund it
          including delivery. Beyond that, unopened and unused items in original packaging may be
          returned within fourteen days at your cost.
        </p>

        <h2 className="d3" style={{ marginTop: 'var(--space-8)' }}>
          Authenticity
        </h2>
        <p>
          Every fragrance we sell is bought from the house, its appointed regional distributor, or an
          authorised duty-free channel, and arrives with paperwork tying it to a batch. We do not buy
          unsourced stock, testers sold as retail, or anything offered below landed cost.
        </p>

        <h2 className="d3" style={{ marginTop: 'var(--space-8)' }}>
          Privacy
        </h2>
        <p>
          We collect only what an order or an enquiry needs: your name, contact details, delivery
          address and what you asked us. We use it to fulfil the order and to answer you. We do not
          sell or rent your details to anyone. Newsletter subscribers can leave in one click, and we
          delete the record when they do.
        </p>
        <p>
          When you place an order it is stored on our own server so we can pick, pack and track it:
          the lines you bought, the total, and the contact and delivery details you gave us. Only
          our staff can see it, behind a password.
        </p>
        <p>
          Payment card details are never handled by this site. Card payments are taken on the
          payment provider&rsquo;s own secure page; M-Pesa is completed on your handset.
        </p>

        <h2 className="d3" style={{ marginTop: 'var(--space-8)' }}>
          Cookies and local storage
        </h2>
        <p>
          This site stores a handful of things in your browser, on your device only: the contents of
          your bag, the country and currency you chose, light or dark, what you have looked at, your
          saved list, and — if you have placed one — your last order reference. Nothing is shared
          with a third party, and clearing your browser data removes all of it.
        </p>
        <p>
          There is one cookie, and only our own staff ever get it: the sign-in that keeps the order
          desk open for a working day. It carries no personal detail and expires after twelve hours.
        </p>

        <h2 className="d3" style={{ marginTop: 'var(--space-8)' }}>
          Getting in touch
        </h2>
        <p>
          Nisa Perfumes, Nairobi, Kenya. <a href={`tel:${config.phoneRaw}`}>{config.phone}</a> ·{' '}
          <a href={`mailto:${config.email}`}>{config.email}</a> · {config.hours}.
        </p>
      </section>
    </>
  );
}
