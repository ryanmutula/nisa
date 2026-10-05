# Nisa Perfumes — storefront and order desk

A complete storefront for Nisa Perfumes: Arabic attars, niche houses and
international designer fragrance, distributed across Kenya, Uganda, Tanzania,
Rwanda and Zambia — plus a password-protected order desk where every order the
shop takes is read, tracked and worked.

**Next.js 15 (App Router), React 19, TypeScript.** The design is the same design:
`styles/classical.css` and `styles/nisa.css` came across unchanged except for
how the fonts are loaded and one selector, so every colour, typeface, space and
motion is the original.

---

## 1. Run it

```bash
npm install
cp .env.example .env.local     # then put a password in ADMIN_PASSWORD
npm run dev                    # http://localhost:3000
```

For production:

```bash
npm run build
npm start
```

Other scripts: `npm run lint`, `npm run typecheck`.

---

## 2. What is where

```
app/
  layout.tsx            The shell: fonts, theme-before-paint, metadata
  page.tsx              Home — hero, brand wall, the film band, families,
                        bestsellers, the attar library, sourcing, trade
  shop/                 Catalogue: family strip, house directory, filters, sort
  product/[id]/         Product detail — one static page per bottle
  cart/ checkout/       Bag and checkout
  about/ wholesale/     Our house · B2B, the three trade tiers, stockist form
  contact/ legal/       Contact and the terms
  not-found.tsx         404
  admin/                THE ORDER DESK — sign in, then every order
  api/orders/           POST an order (prices it from the catalogue)
  api/admin/…           Sign in and out, read the book, move an order along

components/             Header, Footer, cards, the four overlays, the advisor,
                        the opening film, the cursor, the scroll choreography
components/admin/       The order desk: the gate, the book, one order opened

lib/
  config.ts             ← YOUR SETTINGS: phone, email, markets, rates, coupons
  catalog.json          ← THE CATALOGUE: 87 products, 11 houses, 9 families
  catalog.ts            …and the lookups every page uses
  money.ts              Markets and currency conversion
  pricing.ts            Order arithmetic, shared by the checkout and the API
  routes.ts             Every URL in one place
  types.ts              The shapes
  server/orders.ts      The order book (a JSON file; swap for a database)
  server/auth.ts        The admin password and session cookie

styles/
  classical.css         The design system: every colour, font, space, radius
  nisa.css              The site's own layout and motion, on those tokens
  refine.css            Device fitting only — safe areas, tap targets,
                        tablet and landscape breakpoints. No look changes.
  admin.css             The order desk

public/assets/img       Brand marks, editorial photography, 4 files per product
public/assets/video     nisa-feature.mp4 (the looping band, mid-page)
public/video/logo.mp4   ← DROP YOUR OPENING FILM HERE (see video/README.txt)

legacy/                 The original hand-written HTML and JS, kept for
                        reference. Nothing in the app reads it.
```

---

## 3. Settings — `lib/config.ts`

Everything you are likely to change is in that one file: phone, email, hours,
Instagram, the free-delivery threshold, the flat delivery charge, the discount
codes, and the five markets with their currency symbols and KES conversion
rates.

**Currency.** Prices are stored once, in Kenyan shillings, in `catalog.json`.
The header switcher converts on the fly using each market's `rate`. To update a
rate, change that number — nothing else. To add a sixth market, add one row; the
switcher, the filters, the checkout country list and the delivery tables all
pick it up.

Secrets do not live here. `config.ts` is imported by browser code, so the admin
password and the session secret are environment variables instead — see
`.env.example`.

---

## 4. Orders and the admin dashboard

### Getting in

The link is at the very bottom of every page, beside the copyright: **Admin**.
It goes to `/admin`, which asks for one password and then shows the desk.

Set that password before you deploy:

```
ADMIN_PASSWORD=something-long-and-not-guessable
ADMIN_SESSION_SECRET=$(openssl rand -base64 32)
```

Without `ADMIN_PASSWORD` the dashboard cannot be opened at all — it says so
rather than letting anyone in. Without `ADMIN_SESSION_SECRET` a production
build refuses to start, because a session cookie nobody signed is a session
cookie anybody can write. The cookie is HMAC-signed, `httpOnly`, `SameSite=Lax`
and expires after twelve hours. Five wrong passwords from one address and it
waits fifteen minutes.

### What the desk does

- **The numbers along the top** — orders taken, how many are still open, how
  much is booked (cancellations excluded) and the average order.
- **The book** — a table on a desk, one card per order on a phone. Search
  matches a reference, a name, an email, a phone, a town or a bottle. The chips
  filter by status; the Placed and Total columns sort.
- **One order opened** — what was bought and for how much, who bought it, where
  it goes, how they are paying, and anything they told you. Buttons to WhatsApp
  or email them with the order already written out.
- **Tracking** — seven states: `new · confirmed · paid · packed · dispatched ·
  delivered · cancelled`. Every change is stamped, and you can leave a note on
  an order ("M-Pesa received, receipt SJ12KQ") which is kept with it.
- **Export CSV** — whatever is on screen, for whoever does the accounts.
- It re-reads the book every minute, and the moment you come back to the tab.

### How an order is priced

`app/api/orders/route.ts` takes ids, sizes and quantities — and nothing about
money. It looks every price up in the catalogue again and recomputes the
subtotal, the discount, the delivery and the total. A basket edited in a browser
console cannot change what is owed. Every figure stored is in Kenyan shillings,
the currency prices are held in; the currency the customer was *reading* is kept
alongside, so the desk can see it without the arithmetic depending on it.

### Where the orders are kept

One JSON file, `data/orders.json` by default, written atomically and with writes
serialised so two simultaneous orders cannot overwrite each other. It needs
nothing installed and survives a restart.

**Before you deploy, know this:** a read-only or ephemeral filesystem cannot
keep that file. On Vercel's serverless functions, or a container without a
mounted volume, the order book will appear to work and then vanish. Either:

- point `ORDERS_FILE` at a mounted volume, or
- reimplement `readAll()` and `writeAll()` in `lib/server/orders.ts` against a
  database. Every other function goes through those two, so no caller changes.

### Payment

The order is filed and acknowledged; taking the money is still done by hand.
Each gateway needs a secret key, which must never sit in front-end JavaScript,
so each belongs in a route handler beside `app/api/orders/route.ts`:

- **M-Pesa (Daraja)** — POST the stored order to a handler that requests an STK
  push to `order.customer.phone`, then poll for the callback.
- **Stripe** — create a Checkout Session server-side and return its `url`.
- **PayPal** — create an order and redirect to the approve link.

Whichever you add, keep `/api/orders` as the thing that prices and files the
order first: a payment that succeeds against an unrecorded order is the one
failure with no paper trail. The notes at the end of
`components/checkout/CheckoutBody.tsx` mark the spot.

---

## 5. The other forms

Contact, wholesale and newsletter post to one place. Create a free endpoint at
<https://web3forms.com> (or Formspree) and put the key in `NEXT_PUBLIC_FORM_KEY`.

**Until you do, nothing breaks.** Each of those three falls back to a prefilled
WhatsApp message to `+254 757 107862`. Orders never depended on it.

---

## 6. Editing the catalogue

`lib/catalog.json` is the single source of truth — one object holding `brands`,
`families` and `products`. It currently holds **150 perfumes from ten houses**,
built from `scripts/Maven_Price_Matrix.xlsx` by the pipeline in `scripts/`
(see `scripts/README.md`): every perfume Maven lists online, priced at
Cierra's figure plus KSh 100. What is still outstanding — artwork,
note pyramids, a handful of odd-looking prices — is listed in
`docs-catalogue-gaps.md`.

Editing a single product by hand in `lib/catalog.json` is fine; just know that
re-running `python3 scripts/build_catalog.py` regenerates the file from
`scripts/picks.json` and would overwrite it.

```jsonc
{
  "id": "pdm-layton",
  "brand": "Parfums de Marly", "brandSlug": "pdm", "name": "Layton",
  "gender": "men",                      // men | women | unisex
  "family": "amber", "familyLabel": "Amber & Spice",
  "concentration": "Eau de Parfum",
  "sizes": [{ "ml": 75, "price": 33300 }, { "ml": 125, "price": 42900 }], // KES
  "notes": { "top": [], "heart": [], "base": [] },
  "description": "…",
  "tags": ["bestseller"],               // bestseller new attar rare signature value
  "image": "assets/img/products/pdm-layton-sq.webp",
  "thumb": "assets/img/products/pdm-layton-sq-sm.webp",
  "cutout": "assets/img/products/pdm-layton-cut.webp",
  "availability": ["KE", "UG", "TZ", "RW", "ZM"]
}
```

**To add a product:** copy an object, edit it, and drop three images into
`public/assets/img/products/` named after the `id` — `<id>-sq.webp` (1000×1000,
transparent), `<id>-sq-sm.webp` (480×480) and `<id>-cut.webp` (tight crop). The
product page for it is generated on the next build.

**To remove one:** delete its object. Nothing references it by name. An order
already placed for it keeps its own record of what was bought and at what price,
so deleting a product never rewrites history.

The old browser-based catalogue editor (`legacy/admin.html`) is not part of the
app. It worked by downloading a new `catalog.js` for you to copy into place,
which a JSON file in the repository makes unnecessary — and it had no password,
which is why it could never be uploaded. Edit `lib/catalog.json` directly.

---

## 7. The distinctive bits

**The opening film** (`components/Intro.tsx`) — drop your clip in at
`public/video/logo.mp4` and it plays automatically: full-screen and muted, with
a progress hairline and a Skip button, and when it ends the frame flies to the
exact position and size of the header logo while the page rises to meet it.

- **Where it goes:** `public/video/logo.mp4` (or `logo.webm`).
- **If the file is absent** the intro is skipped silently and the home page
  loads normally. The curtain only goes up once a film is decodable, so a
  missing or broken clip never blanks the page.
- **How often:** once per visit (a `sessionStorage` flag). One line in
  `Intro.tsx` switches it to once per visitor, or back to every load.
- **Replay any time:** add `?intro=1` to the address.
- Skippable with the button, a click, the Escape key or space. Under
  `prefers-reduced-motion` it still plays — only the flying handoff becomes a
  fade.

**The film band** (`components/home/FilmBand.tsx`) — `nisa-feature.mp4` loops
muted mid-page with visible pause and unmute controls. It pauses itself when
scrolled out of view, so it costs nothing while you read the rest of the page.

**The cursor** — a brass ring that trails the pointer and swells over anything
clickable. Off on touch devices and under reduced motion.

**Scroll choreography** — one watcher reveals sections, with staggered children
inside them (`data-r` on the group, `data-s="1…6"` on the children). It measures
positions rather than trusting an IntersectionObserver, watches for whatever
React renders next, and shows everything unconditionally after four seconds: a
reveal that does not fire must never be the reason copy is invisible.

**The scent advisor** — five questions instead of a filter panel. It scores the
catalogue in the browser and says why each bottle came back. Nothing leaves the
device.

---

## 8. Phones and desks

`styles/refine.css` is the only stylesheet added, and it changes how the design
fits rather than how it looks:

- The gutter now clears a notch, and the fixed furniture clears a home bar.
- `svh` units where `vh` used to be, so the hero does not jump when the mobile
  address bar retracts.
- Columns for the sizes the original skipped: tablets, and phones held sideways.
- Every tap target at least 44px, and inputs at 16px so iOS does not zoom in
  when one takes focus.
- Drawers contain their own scroll instead of handing it to the page.
- One real bug fixed: the two-column shelf on a narrow phone laid out wider
  than the screen, and `body { overflow-x: hidden }` was quietly clipping the
  right-hand card's add-to-bag button. `.shelf > .card { min-width: 0 }`.
- Under `prefers-reduced-motion`, the motion nobody chose to watch stops: the
  endless marquee, the slideshow's push, the card's chromatic flicker. The
  deliberate motion stays, as the client asked.

Checked at 320, 360, 390, 430, 768, 1024, 1440 and 1920 pixels, in both themes,
with no horizontal scroll anywhere.

---

## 9. Accessibility

Semantic HTML, a skip link, visible keyboard focus everywhere, modals that trap
Tab and give focus back, Escape closes any overlay, `aria-live` on the counts
and every form result, alt text on all product imagery, and no text under 4.5:1
against its ground. Images are lazy-loaded below the fold, the videos preload
metadata only, and the fonts are self-hosted by `next/font`.

---

## 10. Two things to check before you go live

1. **Prices.** Every price is converted from each house's published RRP. They
   are not your cost base. Review all 87 in `lib/catalog.json`.
2. **Claims.** The delivery timelines, trade tiers and sourcing promises are
   written to describe how a distributor of this kind normally runs. Check each
   against how the business actually works. Nothing on the site invents a
   founder, a team or a customer review — those sections were left out rather
   than filled with fiction, so add them when you have the real thing.

And one more, now that there is a dashboard: **set `ADMIN_PASSWORD` and
`ADMIN_SESSION_SECRET`, and decide where `data/orders.json` lives.**
