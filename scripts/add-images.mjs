/* ═══════════════════════════════════════════════════════════════════
   Turn a dropped-in photo into the three files the shop expects.

   Put any image named after the product id into scripts/incoming/ —
   `oj-ormonde-woman.jpg`, `tiziana-kirke.png`, `roja-scandal.webp` —
   and run:

       npm run images:add
       npm run catalog

   Each one becomes:
       <id>-sq.webp      1000x1000, the product page and the hero
       <id>-sq-sm.webp    480x480,  the card on the shelf
       <id>-cut.webp      700x900,  the editorial bands

   The source can be any size or format; a flat border is trimmed off and
   the bottle is centred on a square with a little air, so photos from
   different sources end up sharing a scale. Transparent PNGs keep their
   transparency. The file is left in incoming/ afterwards, so re-running
   is harmless.

   `npm run images:missing` lists which products are still waiting.
   ═══════════════════════════════════════════════════════════════════ */

import { readdir, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const INCOMING = path.join(HERE, 'incoming');
const OUT = path.join(HERE, '..', 'public/assets/img/products');
const CATALOG = path.join(HERE, '..', 'lib/catalog.json');

const KNOWN = /\.(jpe?g|png|webp|avif|tiff?)$/i;

async function ids() {
  const cat = JSON.parse(await readFile(CATALOG, 'utf8'));
  return new Set(cat.products.map((p) => p.id));
}

/** The three files, to the sizes the stylesheet assumes. */
async function render(src, id) {
  const input = await readFile(src);
  const meta = await sharp(input).metadata();
  if (!meta.width || meta.width < 300) {
    throw new Error(`only ${meta.width ?? '?'}px wide — needs at least 300`);
  }

  // Trim the flat border a storefront packshot usually carries, so bottles
  // from different sources end up at a comparable scale.
  const body =
    (await sharp(input).rotate().trim({ threshold: 12 }).toBuffer().catch(() => null)) ?? input;

  const square = (size) =>
    sharp(body)
      .resize(Math.round(size * 0.92), Math.round(size * 0.92), {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .extend({
        top: Math.round(size * 0.04), bottom: Math.round(size * 0.04),
        left: Math.round(size * 0.04), right: Math.round(size * 0.04),
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .webp({ quality: 90, effort: 5 });

  await square(1000).toFile(path.join(OUT, `${id}-sq.webp`));
  await square(480).toFile(path.join(OUT, `${id}-sq-sm.webp`));
  await sharp(body)
    .resize(700, 900, { fit: 'cover', position: 'centre' })
    .webp({ quality: 88 })
    .toFile(path.join(OUT, `${id}-cut.webp`));
}

async function add() {
  await mkdir(INCOMING, { recursive: true });
  const known = await ids();
  const files = (await readdir(INCOMING)).filter((f) => KNOWN.test(f));

  if (!files.length) {
    console.log(`Nothing in ${path.relative(process.cwd(), INCOMING)}/.`);
    console.log('Drop images named after the product id — oj-ormonde-woman.jpg — and run this again.');
    return;
  }

  let done = 0;
  const unknown = [];
  for (const f of files) {
    const id = f.replace(KNOWN, '');
    if (!known.has(id)) { unknown.push(f); continue; }
    try {
      await render(path.join(INCOMING, f), id);
      console.log(`  ✓ ${id}`);
      done += 1;
    } catch (e) {
      console.log(`  ✗ ${id} — ${e.message}`);
    }
  }

  console.log(`\n${done} product${done === 1 ? '' : 's'} given artwork.`);
  if (unknown.length) {
    console.log(`\n${unknown.length} file${unknown.length === 1 ? '' : 's'} did not match a product id:`);
    for (const f of unknown) console.log(`  ${f}`);
    console.log('Run `npm run images:missing` to see the ids that are waiting.');
  }
  if (done) console.log('\nNow run `npm run catalog` so the catalogue points at them.');
}

async function missing() {
  const cat = JSON.parse(await readFile(CATALOG, 'utf8'));
  const want = cat.products.filter((p) => !existsSync(path.join(OUT, `${p.id}-sq.webp`)));
  const rows = [['id', 'house', 'perfume', 'drop in a file named'],
    ...want.map((p) => [p.id, p.brand, p.name, `${p.id}.jpg`])];
  await writeFile(path.join(HERE, 'images-missing.csv'),
    rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n') + '\r\n');

  console.log(`${want.length} of ${cat.products.length} products have no photograph yet.`);
  let house = '';
  for (const p of want) {
    if (p.brand !== house) { house = p.brand; console.log(`\n${house}`); }
    console.log(`  ${p.id}.jpg`.padEnd(46) + p.name);
  }
  console.log(`\nAlso written to scripts/images-missing.csv.`);
}

const cmd = process.argv[2] ?? 'add';
if (cmd === 'missing') await missing();
else await add();
