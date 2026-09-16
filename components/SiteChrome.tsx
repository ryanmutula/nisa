'use client';

/* Everything that wraps a page: the header, the footer, the four
   overlays, the advisor, the bottom bar, the toast and the cursor.
   The admin lives outside this — it is a different room. */

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { routes } from '@/lib/routes';

import Advisor from './Advisor';
import BottomBar from './BottomBar';
import Cursor from './Cursor';
import Footer from './Footer';
import Header from './Header';
import BagDrawer from './overlays/BagDrawer';
import Compare from './overlays/Compare';
import QuickView from './overlays/QuickView';
import SavedDrawer from './overlays/SavedDrawer';
import SearchSheet from './overlays/SearchSheet';
import Reveal from './Reveal';
import Toast from './Toast';
import Transitions from './Transitions';

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  /* The order desk is its own shell: no shop chrome, no advisor, no
     custom cursor to fight a long working session. */
  if (pathname.startsWith(routes.admin)) {
    return (
      <>
        <Transitions />
        {children}
      </>
    );
  }

  return (
    <>
      <Transitions />
      <Reveal />
      <Cursor />
      <a className="skip-to" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <BagDrawer />
      <SavedDrawer />
      <SearchSheet />
      <QuickView />
      <Compare />
      <Advisor />
      <BottomBar />
      <Toast />
    </>
  );
}
