'use client';

/* ═══════════════════════════════════════════════════════════════════
   NISA — client state.

   Everything the old site.js kept on `window` lives here instead: the
   chosen market, light or dark, the bag, the saved list, what you have
   looked at, the comparison tray, the toast, and the four overlays.

   All of it is per-browser, in localStorage, exactly as before — so a
   returning visitor finds their bag where they left it. Nothing is sent
   anywhere until an order is placed.

   One rule about hydration: the first client render must match what the
   server sent, so every stored value starts at its default and is read
   from localStorage in an effect. That is why `ready` exists — a price
   is only market-converted once the market is known.
   ═══════════════════════════════════════════════════════════════════ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react';

import { byId } from '@/lib/catalog';
import { config } from '@/lib/config';
import { MARKET_KEY, format, marketByCode } from '@/lib/money';
import type { BagLine, Market, Product } from '@/lib/types';

const BAG_KEY = 'nisa:bag';
const SAVED_KEY = 'nisa:saved';
const SEEN_KEY = 'nisa:seen';
const THEME_KEY = 'nisa:theme';

export type Theme = 'light' | 'dark';
export type Overlay = 'bag' | 'saved' | 'search' | 'compare' | null;

interface StoreValue {
  /** False until localStorage has been read. Prices wait for it. */
  ready: boolean;

  market: Market;
  setMarket: (code: string) => void;
  /** Format a KES amount in the visitor's currency. */
  money: (kes: number) => string;

  theme: Theme;
  toggleTheme: () => void;

  bag: BagLine[];
  bagCount: number;
  bagTotal: number;
  addToBag: (id: string, ml: number | null, q?: number, from?: HTMLElement | null) => void;
  setQty: (key: string, q: number) => void;
  clearBag: () => void;

  saved: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;

  seen: Product[];
  noteSeen: (id: string) => void;

  compare: string[];
  toggleCompare: (id: string) => void;

  overlay: Overlay;
  openOverlay: (o: Overlay) => void;
  closeOverlay: () => void;

  quickView: string | null;
  openQuickView: (id: string) => void;
  closeQuickView: () => void;

  advisorOpen: boolean;
  setAdvisorOpen: (open: boolean) => void;

  toast: string;
  say: (message: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Private browsing, or a full quota. The page still works; the bag
       simply will not survive a reload. */
  }
}

/** The bottle flies to the bag button — the old flyToBag(), unchanged. */
function flyToBag(from: HTMLElement, src: string): void {
  const target = document.getElementById('btn-bag');
  if (!target || typeof from.animate !== 'function') return;

  const holder = from.closest('.card, .qv-in, .pdp, .bot-hit');
  const img = holder?.querySelector('img');
  const r = (img ?? from).getBoundingClientRect();
  const t = target.getBoundingClientRect();

  const fly = document.createElement('div');
  fly.className = 'fly';
  const shot = document.createElement('img');
  shot.src = (img as HTMLImageElement | null)?.src || src;
  shot.alt = '';
  fly.appendChild(shot);
  fly.style.left = `${r.left + r.width / 2 - 37}px`;
  fly.style.top = `${r.top + r.height / 2 - 37}px`;
  document.body.appendChild(fly);

  const anim = fly.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      {
        transform: `translate(${t.left + 19 - (r.left + r.width / 2)}px,${
          t.top + 19 - (r.top + r.height / 2)
        }px) scale(.18)`,
        opacity: 0.2
      }
    ],
    { duration: 720, easing: 'cubic-bezier(.5,0,.35,1)' }
  );
  anim.onfinish = () => {
    fly.remove();
    target.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }],
      { duration: 380 }
    );
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [marketCode, setMarketCode] = useState(config.defaultMarket);
  const [theme, setTheme] = useState<Theme>('light');
  const [bag, setBag] = useState<BagLine[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [quickView, setQuickView] = useState<string | null>(null);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── first paint is over: pick up where this browser left off ─── */
  useEffect(() => {
    setMarketCode(localStorage.getItem(MARKET_KEY) ?? config.defaultMarket);
    setTheme(
      (document.documentElement.getAttribute('data-theme') as Theme | null) ??
        (localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light')
    );
    setBag(readJson<BagLine[]>(BAG_KEY, []));
    setSaved(readJson<string[]>(SAVED_KEY, []));
    setSeenIds(readJson<string[]>(SEEN_KEY, []));
    setReady(true);
  }, []);

  /* Another tab changed the bag: follow it rather than fight it. */
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === BAG_KEY) setBag(readJson<BagLine[]>(BAG_KEY, []));
      if (e.key === SAVED_KEY) setSaved(readJson<string[]>(SAVED_KEY, []));
      if (e.key === MARKET_KEY && e.newValue) setMarketCode(e.newValue);
    }
    addEventListener('storage', onStorage);
    return () => removeEventListener('storage', onStorage);
  }, []);

  const market = useMemo(() => marketByCode(marketCode), [marketCode]);
  const money = useCallback((kes: number) => format(kes, market), [market]);

  const setMarket = useCallback((code: string) => {
    setMarketCode(code);
    try {
      localStorage.setItem(MARKET_KEY, code);
    } catch {
      /* nothing to do */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* nothing to do */
      }
      return next;
    });
  }, []);

  const say = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  }, []);

  /* ── bag ───────────────────────────────────────────────────────── */
  const persistBag = useCallback((next: BagLine[]) => {
    setBag(next);
    writeJson(BAG_KEY, next);
  }, []);

  const addToBag = useCallback(
    (id: string, ml: number | null, q = 1, from?: HTMLElement | null) => {
      const p = byId(id);
      if (!p) return;
      const size = p.sizes.find((s) => s.ml === ml) ?? p.sizes[0];
      const key = `${id}:${size.ml}`;
      const existing = bag.find((l) => l.key === key);
      const next = existing
        ? bag.map((l) => (l.key === key ? { ...l, q: l.q + q } : l))
        : [
            ...bag,
            {
              key,
              id,
              ml: size.ml,
              price: size.price,
              q,
              name: p.name,
              brand: p.brand,
              thumb: p.thumb || p.image
            }
          ];
      persistBag(next);
      if (from) flyToBag(from, p.thumb || p.image);
      say(`${p.brand} ${p.name} · ${size.ml}ml added`);
    },
    [bag, persistBag, say]
  );

  const setQty = useCallback(
    (key: string, q: number) => {
      persistBag(bag.map((l) => (l.key === key ? { ...l, q } : l)).filter((l) => l.q > 0));
    },
    [bag, persistBag]
  );

  const clearBag = useCallback(() => persistBag([]), [persistBag]);

  const bagCount = useMemo(() => bag.reduce((a, l) => a + l.q, 0), [bag]);
  const bagTotal = useMemo(() => bag.reduce((a, l) => a + l.price * l.q, 0), [bag]);

  /* ── saved ─────────────────────────────────────────────────────── */
  const isSaved = useCallback((id: string) => saved.includes(id), [saved]);

  const toggleSaved = useCallback(
    (id: string) => {
      const had = saved.includes(id);
      const next = had ? saved.filter((x) => x !== id) : [...saved, id];
      setSaved(next);
      writeJson(SAVED_KEY, next);
      say(had ? 'Removed from your saved list' : 'Saved. It will be here when you return.');
    },
    [saved, say]
  );

  /* ── recently viewed ───────────────────────────────────────────── */
  const noteSeen = useCallback((id: string) => {
    setSeenIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 10);
      writeJson(SEEN_KEY, next);
      return next;
    });
  }, []);

  const seen = useMemo(
    () => seenIds.map((id) => byId(id)).filter((p): p is Product => Boolean(p)),
    [seenIds]
  );

  /* ── compare ───────────────────────────────────────────────────── */
  const toggleCompare = useCallback(
    (id: string) => {
      setCompare((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= 3) {
          say('Three at a time is the most useful comparison.');
          return prev;
        }
        return [...prev, id];
      });
    },
    [say]
  );

  /* ── overlays ──────────────────────────────────────────────────── */
  const openOverlay = useCallback((o: Overlay) => setOverlay(o), []);
  const closeOverlay = useCallback(() => setOverlay(null), []);
  const openQuickView = useCallback((id: string) => setQuickView(id), []);
  const closeQuickView = useCallback(() => setQuickView(null), []);

  /* Escape closes whatever is open, and the page behind an open overlay
     does not scroll. */
  const anyOpen = overlay !== null || quickView !== null;
  useEffect(() => {
    if (!anyOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      setOverlay(null);
      setQuickView(null);
    }
    addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [anyOpen]);

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      market,
      setMarket,
      money,
      theme,
      toggleTheme,
      bag,
      bagCount,
      bagTotal,
      addToBag,
      setQty,
      clearBag,
      saved,
      isSaved,
      toggleSaved,
      seen,
      noteSeen,
      compare,
      toggleCompare,
      overlay,
      openOverlay,
      closeOverlay,
      quickView,
      openQuickView,
      closeQuickView,
      advisorOpen,
      setAdvisorOpen,
      toast,
      say
    }),
    [
      ready,
      market,
      setMarket,
      money,
      theme,
      toggleTheme,
      bag,
      bagCount,
      bagTotal,
      addToBag,
      setQty,
      clearBag,
      saved,
      isSaved,
      toggleSaved,
      seen,
      noteSeen,
      compare,
      toggleCompare,
      overlay,
      openOverlay,
      closeOverlay,
      quickView,
      openQuickView,
      closeQuickView,
      advisorOpen,
      toast,
      say
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>.');
  return ctx;
}

/** Just the formatter, for the many components that want nothing else. */
export function useMoney() {
  return useStore().money;
}

export const FREE_DELIVERY_OVER = config.freeDeliveryOver;
