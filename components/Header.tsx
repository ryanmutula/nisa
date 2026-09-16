'use client';

/* The header: brand, navigation, and the row of actions on the right.

   On a phone the currency switcher, search, saved list and the theme
   toggle move inside the menu panel — where they can carry a label —
   and the bottom bar takes over Shop, the advisor and WhatsApp. That
   split is in the stylesheet; this component renders both halves and
   lets CSS decide which is showing. */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { config } from '@/lib/config';
import { navLinks, routes } from '@/lib/routes';

import { useScrollY } from './hooks';
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon
} from './icons';
import { useStore } from './store';

export default function Header() {
  const pathname = usePathname();
  const {
    market,
    setMarket,
    theme,
    toggleTheme,
    bagCount,
    saved,
    openOverlay
  } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const stuck = useScrollY() > 12;

  /* A new page means a closed menu. */
  useEffect(() => setMenuOpen(false), [pathname]);

  const dark = theme === 'dark';
  const mark = `/assets/img/brand/nisa-mark-${dark ? 'light' : 'dark'}.png`;

  const currencySelect = (id?: string) => (
    <select
      className="cur-sel mkt-sel"
      id={id}
      aria-label="Country and currency"
      value={market.code}
      onChange={(e) => setMarket(e.target.value)}
    >
      {config.markets.map((m) => (
        <option key={m.code} value={m.code}>
          {m.flag} {m.currency}
        </option>
      ))}
    </select>
  );

  function fromMenu(run: () => void) {
    setMenuOpen(false);
    run();
  }

  return (
    <header className={`site-head${stuck ? ' stuck' : ''}`}>
      <div className="head-in">
        <Link className="brand" href={routes.home} aria-label="Nisa Perfumes, home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="head-mark" src={mark} alt="Nisa Perfumes" width={160} height={42} />
        </Link>

        <nav className={`nav${menuOpen ? ' open' : ''}`} id="nav">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={
                l.href === routes.home
                  ? pathname === routes.home
                    ? 'page'
                    : undefined
                  : pathname.startsWith(l.href)
                    ? 'page'
                    : undefined
              }
            >
              {l.label}
            </Link>
          ))}

          {/* The phone menu's utility rows — hidden by CSS on a desk. */}
          <div className="nav-util">
            <label className="nav-util-row">
              <span>Currency</span>
              {currencySelect()}
            </label>
            <button
              className="nav-util-row"
              type="button"
              onClick={() => fromMenu(() => openOverlay('search'))}
            >
              <span>Search the catalogue</span>
              <SearchIcon />
            </button>
            <button
              className="nav-util-row"
              type="button"
              onClick={() => fromMenu(() => openOverlay('saved'))}
            >
              <span>Saved fragrances</span>
              <HeartIcon />
            </button>
            <button className="nav-util-row" type="button" onClick={() => fromMenu(toggleTheme)}>
              <span>Light or dark</span>
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </nav>

        <div className="head-act">
          <button
            className="ib"
            id="btn-theme"
            type="button"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title="Light or dark"
            onClick={toggleTheme}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>

          {currencySelect('mkt')}

          <button
            className="ib"
            id="btn-search"
            type="button"
            aria-label="Search the catalogue"
            onClick={() => openOverlay('search')}
          >
            <SearchIcon />
          </button>

          <button
            className="ib"
            id="btn-saved"
            type="button"
            aria-label="Your saved fragrances"
            onClick={() => openOverlay('saved')}
          >
            <HeartIcon />
            <span className={`badge num${saved.length ? ' on' : ''}`}>{saved.length}</span>
          </button>

          <button
            className="ib"
            id="btn-bag"
            type="button"
            aria-label={bagCount ? `Open your bag, ${bagCount} item${bagCount > 1 ? 's' : ''}` : 'Open your bag'}
            onClick={() => openOverlay('bag')}
          >
            <BagIcon />
            <span className={`badge num${bagCount ? ' on' : ''}`}>{bagCount}</span>
          </button>

          <button
            className="ib burger"
            id="btn-menu"
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <Link className="b fill sm shop-cta" href={routes.shop}>
            <span>Shop now</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
