/* ═══════════════════════════════════════════════════════════════════
   Pull the product catalogue off cierraperfumes.com (and feelnzuri.com
   as a second opinion), match it to the 150 perfumes chosen from the
   Maven sheet, and write the three image files the design expects for
   each one.

   Most Kenyan perfume storefronts run on Shopify, which publishes
   /products.json — title, body_html and every image in one request.
   If that is absent we fall back to sitemap.xml, then to each product
   page's og:image and JSON-LD.

   Run:  node scrape.mjs harvest      # fetch catalogues -> harvest.json
         node scrape.mjs match        # match to picks -> matches.json
         node scrape.mjs images       # download + convert -> public/
   ═══════════════════════════════════════════════════════════════════ */

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SITES = [
  { key: 'cierra', base: 'https://cierraperfumes.com' },
  { key: 'maven', base: 'https://feelnzuri.com' }
];

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

async function get(url, as = 'json') {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return as === 'json' ? res.json() : as === 'buffer' ? Buffer.from(await res.arrayBuffer()) : res.text();
}

/* ── 1. harvest ──────────────────────────────────────────────────── */

async function shopify(base) {
  const all = [];
  for (let page = 1; page <= 30; page++) {
    const data = await get(`${base}/products.json?limit=250&page=${page}`);
    const list = data.products ?? [];
    if (!list.length) break;
    for (const p of list) {
      all.push({
        title: p.title,
        handle: p.handle,
        url: `${base}/products/${p.handle}`,
        body: p.body_html ?? '',
        tags: p.tags ?? [],
        vendor: p.vendor ?? '',
        images: (p.images ?? []).map((i) => i.src),
        variants: (p.variants ?? []).map((v) => ({ title: v.title, price: v.price }))
      });
    }
    process.stderr.write(`  ${base} page ${page}: ${list.length} (total ${all.length})\n`);
    if (list.length < 250) break;
  }
  return all;
}

/** Fallback: walk sitemap.xml for /products/ URLs, then read each page. */
async function viaSitemap(base) {
  const seen = new Set();
  const queue = [`${base}/sitemap.xml`];
  const urls = [];
  while (queue.length && urls.length < 1200) {
    const sm = queue.shift();
    if (seen.has(sm)) continue;
    seen.add(sm);
    let xml;
    try { xml = await get(sm, 'text'); } catch { continue; }
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const u = m[1].trim();
      if (/sitemap.*\.xml/i.test(u)) queue.push(u);
      else if (u.includes('/product')) urls.push(u);
    }
  }
  process.stderr.write(`  ${base}: ${urls.length} product URLs from sitemap\n`);

  const out = [];
  for (const u of urls) {
    try {
      const html = await get(u, 'text');
      const title =
        html.match(/<meta property="og:title" content="([^"]+)"/i)?.[1] ??
        html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '';
      const imgs = [...html.matchAll(/<meta property="og:image(?::secure_url)?" content="([^"]+)"/gi)].map((m) => m[1]);
      let body = html.match(/<meta property="og:description" content="([^"]+)"/i)?.[1] ?? '';
      for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
        try {
          const ld = JSON.parse(m[1]);
          const node = Array.isArray(ld) ? ld.find((x) => x['@type'] === 'Product') : ld;
          if (node?.['@type'] === 'Product') {
            if (node.description) body = node.description;
            for (const im of [].concat(node.image ?? [])) imgs.push(im);
          }
        } catch { /* not our JSON-LD */ }
      }
      out.push({ title: decode(title), url: u, body: decode(body), images: [...new Set(imgs)], variants: [], tags: [] });
    } catch { /* skip a page that will not load */ }
  }
  return out;
}

function decode(s) {
  return String(s)
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d));
}

async function harvest() {
  const out = {};
  for (const { key, base } of SITES) {
    process.stderr.write(`\n${key} (${base})\n`);
    let items = [];
    try {
      items = await shopify(base);
    } catch (e) {
      process.stderr.write(`  products.json unavailable (${e.message}) - trying the sitemap\n`);
    }
    if (!items.length) {
      try { items = await viaSitemap(base); } catch (e) { process.stderr.write(`  sitemap failed too: ${e.message}\n`); }
    }
    process.stderr.write(`  -> ${items.length} products\n`);
    out[key] = items;
  }
  await writeFile(path.join(HERE, 'harvest.json'), JSON.stringify(out, null, 1));
  console.log(Object.entries(out).map(([k, v]) => `${k}: ${v.length}`).join(', '));
}

/* ── 2. match ────────────────────────────────────────────────────── */

const STOP = new Set(['edp','edt','edc','eau','de','parfum','extrait','spray','ml','the','for','and','pour','natural','intense','new','x']);

function tokens(s) {
  return new Set(
    String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ').split(' ')
      .filter((w) => w.length > 1 && !STOP.has(w) && !/^\d+$/.test(w))
  );
}

function score(a, b) {
  const inter = [...a].filter((w) => b.has(w)).length;
  if (!inter) return 0;
  return (2 * inter) / (a.size + b.size);           // Dice coefficient
}

async function match() {
  const harvestData = JSON.parse(await readFile(path.join(HERE, 'harvest.json'), 'utf8'));
  const picks = JSON.parse(await readFile(path.join(HERE, 'picks.json'), 'utf8'));

  const pool = [];
  for (const [site, items] of Object.entries(harvestData)) {
    for (const it of items) pool.push({ ...it, site, tok: tokens(`${it.vendor} ${it.title}`) });
  }

  const results = [];
  for (const p of picks) {
    const want = tokens(`${p.brand} ${p.name}`);
    const ranked = pool
      .map((c) => ({ c, s: score(want, c.tok) }))
      .sort((x, y) => y.s - x.s)
      .slice(0, 3);
    const best = ranked[0];
    results.push({
      id: p.id, brand: p.brand, name: p.name,
      matched: best && best.s >= 0.5 ? {
        site: best.c.site, title: best.c.title, url: best.c.url,
        score: +best.s.toFixed(2), images: best.c.images, body: best.c.body
      } : null,
      runnersUp: ranked.slice(1).map((r) => ({ title: r.c.title, score: +r.s.toFixed(2) }))
    });
  }
  const hit = results.filter((r) => r.matched).length;
  await writeFile(path.join(HERE, 'matches.json'), JSON.stringify(results, null, 1));
  console.log(`matched ${hit}/${results.length}; ${results.length - hit} unmatched`);
  for (const r of results.filter((x) => !x.matched)) console.log('  no match:', r.brand, r.name);
}

/* ── 3. images ───────────────────────────────────────────────────── */

const HERE = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(HERE, '..', 'public/assets/img/products');

/** The three files every product needs, to the sizes the stylesheet assumes. */
async function render(buf, id) {
  const base = sharp(buf).rotate();
  const meta = await base.metadata();
  if (!meta.width || meta.width < 300) throw new Error(`too small (${meta.width}px)`);

  // Trim the flat border most storefront packshots carry, then sit the
  // bottle on a square canvas with a little air, as the originals do.
  const trimmed = await sharp(buf).rotate()
    .trim({ threshold: 12 })
    .toBuffer({ resolveWithObject: true })
    .catch(() => null);
  const body = trimmed?.data ?? buf;

  const square = (size) =>
    sharp(body)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .extend({
        top: Math.round(size * 0.04), bottom: Math.round(size * 0.04),
        left: Math.round(size * 0.04), right: Math.round(size * 0.04),
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .resize(size, size)
      .webp({ quality: 90, effort: 5 });

  await square(1000).toFile(path.join(OUT, `${id}-sq.webp`));
  await square(480).toFile(path.join(OUT, `${id}-sq-sm.webp`));
  // the tight crop used by the editorial bands
  await sharp(body).resize(700, 900, { fit: 'cover', position: 'centre' })
    .webp({ quality: 88 }).toFile(path.join(OUT, `${id}-cut.webp`));
}

async function images() {
  const matches = JSON.parse(await readFile(path.join(HERE, 'matches.json'), 'utf8'));
  await mkdir(OUT, { recursive: true });
  const ok = [], bad = [];

  for (const m of matches) {
    if (!m.matched?.images?.length) { bad.push([m.id, 'no image in the match']); continue; }
    let done = false;
    for (const raw of m.matched.images.slice(0, 4)) {
      // ask Shopify for the full-size original rather than a thumbnail
      const url = raw.replace(/(_\d+x\d*|_\d*x\d+)(?=\.(jpg|jpeg|png|webp))/i, '');
      try {
        const buf = await get(url, 'buffer');
        await render(buf, m.id);
        ok.push([m.id, url]); done = true; break;
      } catch (e) {
        bad.push([m.id, `${e.message} <- ${url}`]);
      }
    }
    process.stderr.write(done ? '.' : 'x');
  }
  process.stderr.write('\n');
  await writeFile(path.join(HERE, 'images_report.json'), JSON.stringify({ ok, bad }, null, 1));
  console.log(`wrote images for ${ok.length} products; ${matches.length - ok.length} without`);
  for (const [id, why] of bad.slice(0, 20)) console.log('  ', id, why);
}

const cmd = process.argv[2];
if (cmd === 'harvest') await harvest();
else if (cmd === 'match') await match();
else if (cmd === 'images') await images();
else console.log('usage: node scrape.mjs harvest|match|images');
