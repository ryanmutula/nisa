/* The footer, and the admin door at the very bottom of it.

   Everything above the rule is the same four columns the old site had.
   Below it, beside the copyright, is the one new link: "Admin", which
   goes to the order desk. It sits here deliberately — it is the last
   thing on the page, out of a customer's way, and on every page. */

import Link from 'next/link';

import { config } from '@/lib/config';
import { routes, shopUrl, whatsAppUrl } from '@/lib/routes';

import { WhatsAppIcon } from './icons';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <>
      <footer className="site-foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/brand/nisa-mark-light.png"
                alt="Nisa Perfumes"
                width={200}
                height={54}
                style={{ height: 54, width: 'auto', marginBottom: 18 }}
              />
              <p className="muted" style={{ maxWidth: '34ch', fontSize: 14 }}>
                Niche and luxury fragrance, sourced at origin and distributed across Kenya,
                Uganda, Tanzania, Rwanda and Zambia.
              </p>
            </div>

            <div>
              <h4>Shop</h4>
              <ul>
                <li>
                  <Link href={routes.shop}>All fragrance</Link>
                </li>
                <li>
                  <Link href={shopUrl({ family: 'oud' })}>Oud &amp; incense</Link>
                </li>
                <li>
                  <Link href={shopUrl({ family: 'gourmand' })}>Gourmand</Link>
                </li>
                <li>
                  <Link href={shopUrl({ tag: 'new' })}>New arrivals</Link>
                </li>
                <li>
                  <Link href={shopUrl({ tag: 'bestseller' })}>Bestsellers</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4>House</h4>
              <ul>
                <li>
                  <Link href={routes.about}>Our house</Link>
                </li>
                <li>
                  <Link href={routes.wholesale}>Wholesale &amp; distribution</Link>
                </li>
                <li>
                  <Link href={`${routes.wholesale}#stockist`}>Become a stockist</Link>
                </li>
                <li>
                  <Link href={routes.contact}>Contact</Link>
                </li>
                <li>
                  <Link href={routes.legal}>Terms &amp; privacy</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4>Reach us</h4>
              <ul>
                <li>
                  <a href={`tel:${config.phoneRaw}`}>{config.phone}</a>
                </li>
                <li>
                  <a href={`mailto:${config.email}`}>{config.email}</a>
                </li>
                <li>
                  <a href={whatsAppUrl(config.phoneRaw)} target="_blank" rel="noopener">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href={config.instagram} target="_blank" rel="noopener">
                    Instagram
                  </a>
                </li>
                <li className="muted" style={{ fontSize: 13 }}>
                  {config.hours}
                </li>
              </ul>
            </div>
          </div>

          <div className="foot-b">
            <span className="muted">
              © {YEAR} Nisa Perfumes. All fragrance sourced from authorised channels.
            </span>
            <div className="pay">
              <span>M-PESA</span>
              <span>VISA</span>
              <span>MASTERCARD</span>
              <span>PAYPAL</span>
              <span>CASH ON DELIVERY</span>
            </div>
            <Link className="foot-admin" href={routes.admin} rel="nofollow">
              Admin
            </Link>
          </div>
        </div>
      </footer>

      <a
        className="wa"
        href={whatsAppUrl(config.phoneRaw)}
        target="_blank"
        rel="noopener"
        aria-label="Message us on WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </>
  );
}
