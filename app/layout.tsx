import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Lora } from 'next/font/google';

import SiteChrome from '@/components/SiteChrome';
import { StoreProvider } from '@/components/store';

import '@/styles/classical.css';
import '@/styles/nisa.css';
import '@/styles/refine.css';

/* The two typefaces the design system names, self-hosted by next/font so
   there is no third-party request and no flash of fallback text. */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant'
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-lora'
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nisaparfums.com'),
  title: {
    default: 'Nisa Perfumes — niche and luxury fragrance in East Africa',
    template: '%s — Nisa Perfumes'
  },
  description:
    'Nisa Perfumes sources niche and luxury fragrance at origin — Parfums de Marly, Nishane, Roja, Ormonde Jayne, Xerjoff and more — and distributes across Kenya, Uganda, Tanzania, Rwanda and Zambia.',
  icons: { icon: '/assets/img/brand/favicon-32.png' },
  openGraph: {
    type: 'website',
    siteName: 'Nisa Perfumes',
    images: ['/assets/img/brand/logo-lockup-parchment.png']
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  /* The notch and the home bar are handled in the stylesheet, so the page
     is allowed to reach the edges of the screen. */
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f2f2' },
    { media: '(prefers-color-scheme: dark)', color: '#1e1b18' }
  ]
};

/* Theme and transition-safety, before first paint, so there is no flash.
   This is the same two lines the old pages carried in their <head>. */
const BOOT = `(function(){try{var t=localStorage.getItem('nisa:theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');document.documentElement.classList.add('no-anim');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${cormorant.variable} ${lora.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        <StoreProvider>
          <SiteChrome>{children}</SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
