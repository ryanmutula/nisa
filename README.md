# Nisa Perfumes — website

A complete storefront for Nisa Perfumes: Arabic attars, niche houses and
international designer fragrance, distributed across Kenya, Uganda, Tanzania,
Rwanda and Zambia.

**Plain HTML, CSS and JavaScript. No PHP, no framework, no build step, no
`npm install`.** Every page is a file you can open in VS Code and edit.

---

## 1. Open it

1. Unzip the folder.
2. Open the folder in VS Code (`File → Open Folder`).
3. Install the **Live Server** extension (Ritwick Dey), right-click
   `index.html` → **Open with Live Server**.

Live Server matters for video preloading only, because browsers restrict some
media on the `file://` protocol. Everything else works if you just double-click
`index.html`.

To put it online, upload the whole folder to any host: cPanel `public_html`,
Netlify, Vercel, GitHub Pages, Cloudflare Pages. There is nothing to configure
on the server.

---

## 2. What is where

```
index.html        Home — opening film, hero, brand wall, the film band,
                  families, bestsellers, attar library, sourcing, trade
shop.html         Catalogue: family strip, house directory, filters, sort
product.html      Product detail (product.html?id=pdm-layton)
about.html        Our house — sourcing chain, authenticity, markets
wholesale.html    B2B — why us, three trade tiers, stockist enquiry
contact.html      Contact details, form, FAQ
cart.html         Full bag
checkout.html     Checkout, order reference, WhatsApp confirmation
legal.html        Terms, delivery, returns, privacy, cookies
404.html          Not found

assets/css/
  classical.css   The design system: every colour, font, space and radius
  nisa.css        The site's own layout and motion, built on those tokens
assets/js/
  config.js       ← YOUR SETTINGS: phone, email, form key, markets, rates
  catalog.js      ← THE CATALOGUE: 87 products, 11 houses, 9 families
  site.js         Header, footer, opening film, cursor, scroll, bag, search
  home.js · shop.js · product.js · cart.js · checkout.js
assets/img/brand      Logo lockups, butterfly, favicon
assets/img/products   4 files per product
video/logo.mp4        ← DROP YOUR OPENING FILM HERE (see video/README.txt)
assets/video          nisa-feature.mp4 (the looping band, mid-page)
assets/fonts          Cormorant Garamond + Manrope, self-hosted
```

---

## 3. Settings — `assets/js/config.js`

Everything you are likely to change is in that one file: phone, email, hours,
Instagram, the free-delivery threshold, and the five markets with their
currency symbols and KES conversion rates.

**Currency.** Prices are stored once, in Kenyan shillings, in `catalog.js`. The
header switcher converts on the fly using each market's `rate`. To update a
rate, change that number — nothing else. To add a sixth market, add one row;
the switcher, the filters, the checkout country list and the delivery tables
all pick it up.

---

## 4. Forms and orders

Contact, wholesale, newsletter and checkout all post to one place.

1. Create a free account at <https://web3forms.com> (or Formspree).
2. Paste the access key into `formKey` in `config.js`.

**Until you do, nothing breaks.** Every form falls back to a prefilled
WhatsApp message to `+254 757 107862`, and checkout still issues an order
reference and hands the customer a WhatsApp confirmation. That is a legitimate
way to trade here — many customers prefer it.

### Real payment gateways

`assets/js/checkout.js` prices every line from the catalogue, never from what
the browser sends, then calls `pay(order)`. Replace the body of `pay()` to plug
in:

- **M-Pesa (Daraja)** — post the order to a small endpoint that requests an
  STK push to the customer's number, then poll for the callback.
- **Stripe** — create a Checkout Session server-side and set
  `location.href = session.url`.
- **PayPal** — create an order and redirect to the approve link.

Each needs a secret key, which must never sit in front-end JavaScript. A
serverless function (Netlify, Vercel, Cloudflare Workers) or one PHP file on
your host is enough. Comments inside `pay()` mark exactly where each goes.

---

## 5a. The catalogue editor (admin.html)

Open `admin.html` in the browser and you can edit the whole catalogue in a form:
names, houses, families, sizes, prices, note pyramids, descriptions, tags, the
markets each bottle is stocked for, and its image paths. You can duplicate a
product, delete one, or start a new one.

**Nothing saves by itself.** Your changes live in that browser tab until you press
**Download catalog.js**, then you replace `assets/js/catalog.js` with the file you
get. "Open a file" loads a catalogue back in so you can pick up where you left off.

**There is no password on that page.** Do not upload `admin.html` to your live
server, or rename it to something only you know. Anyone who finds it can read your
cost structure — they cannot change your live site, since the save is a download.

The 3D silhouette fields (`outline`, `aspect`, `tint`, `shape`) are deliberately
left alone by the editor; see below for how they work.

## 5. Editing the catalogue

`assets/js/catalog.js` is the single source of truth — one `window.NISA_CATALOG`
object holding `brands`, `families` and `products`.

```js
{
  id: 'pdm-layton',
  brand: 'Parfums de Marly', brandSlug: 'pdm', name: 'Layton',
  gender: 'men',                       // men | women | unisex
  family: 'amber', familyLabel: 'Amber & Spice',
  concentration: 'Eau de Parfum',
  sizes: [{ ml: 75, price: 33300 }, { ml: 125, price: 42900 }],   // KES
  notes: { top: [...], heart: [...], base: [...] },
  description: '…',
  tags: ['bestseller'],                // bestseller new attar rare signature value
  image: 'assets/img/products/pdm-layton-sq.webp',
  thumb: 'assets/img/products/pdm-layton-sq-sm.webp',
  cutout: 'assets/img/products/pdm-layton-cut.webp',
  outline: [[0.42,0.99], …],            // silhouette for the 3D viewer
  aspect: 0.62, tint: '#3d4a63', shape: 'pdm',
  availability: ['KE','UG','TZ','RW','ZM']
}
```

**To add a product:** copy an existing object, edit it, and drop three images
into `assets/img/products/` named after the `id` — `<id>-sq.webp` (1000×1000,
transparent), `<id>-sq-sm.webp` (480×480) and `<id>-cut.webp` (tight crop).
The `outline`, `aspect`, `tint` and `shape` fields are left over from the 360°
viewer that has since been removed; nothing reads them, and they can stay or go.

**To remove one:** delete its object. Nothing references it by name.

---

## 6. The distinctive bits

**The opening film** (`site.js` → `intro()`) — drop your clip in at
`video/logo.mp4` and it plays automatically: full-screen and muted, with a
progress hairline and a Skip button, and when it ends the frame flies to the
exact position and size of the header logo while the page rises to meet it.

- **Where it goes:** `video/logo.mp4` (or `logo.webm`). `video/README.txt`
  repeats this next to the file.
- **If the file is absent** the intro is skipped silently and the home page
  loads normally. The curtain only goes up once a film is decodable, so a
  missing or broken clip never blanks the page.
- **How often:** once per visit (a `sessionStorage` flag). One line in
  `intro()` switches it to once per visitor, or back to every load.
- **Replay any time:** add `?intro=1` to the address.
- Skippable with the button or the Escape key. Under `prefers-reduced-motion`
  it still plays — only the flying handoff is replaced by a fade.

**The film band** (`home.js`) — `nisa-feature.mp4` loops muted mid-page with
visible pause and unmute controls. It pauses itself when scrolled out of view,
so it costs nothing while you read the rest of the page.

**The cursor** — a brass ring that trails the pointer and swells over anything
clickable. Off on touch devices and under reduced motion.

**Scroll choreography** — one observer reveals sections, with staggered
children inside them (`data-r` on the group, `data-s="1…6"` on the children).
`data-par` gives an element a light parallax. Nothing fades up everywhere:
the hero bottle drifts, the brand wall scrolls, the sections clip in.


---

## 7. Two things to check before you go live

1. **Prices.** Every price is converted from each house's published RRP. They
   are not your cost base. Review all 87 in `catalog.js`.
2. **Claims.** The delivery timelines, trade tiers and sourcing promises are
   written to describe how a distributor of this kind normally runs. Check each
   against how the business actually works. Nothing on the site invents a
   founder, a team or a customer review — those sections were left out rather
   than filled with fiction, so add them when you have the real thing.

---

## 8. Accessibility and performance

Semantic HTML, visible keyboard focus everywhere, `prefers-reduced-motion`
honoured for the film, the cursor, the parallax and every reveal, alt text on
all product imagery, and no text under 4.5:1 against its ground. Images are
lazy-loaded, the videos preload metadata only, and Three.js loads on demand.
