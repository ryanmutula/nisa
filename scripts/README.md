# The catalogue pipeline

How `lib/catalog.json` was built from `Maven_Price_Matrix.xlsx`, and how to
re-run any stage. Everything here is a build-time tool — the app itself only
reads `lib/catalog.json`.

## The rule the shelf was selected by

- **Pick** a perfume only where the sheet has a number in the *Maven Website*
  column, i.e. Maven actually lists it online.
- **Price** it at the *Cierra Website* number **plus KSh 100**.

Of 1,268 rows, 369 carry a Maven Website price, and 241 of those also carry a
Cierra price — the only ones that satisfy both halves of the rule. Stripping
gift sets, vial sets, a candle, a body cream, two deodorants and a duplicated
row leaves 182 distinct perfumes; 150 were chosen from those, spread across all
ten houses and all nine families.

Two houses the old site carried, Ajmal and Goldfield & Banks, are absent from
the Maven sheet entirely. Amouage and Afnan are in it with Cierra prices but no
Maven Website price, so the rule excludes them.

## Stages

| Step | Command | Writes |
|---|---|---|
| 1. Read the sheet | `python3 structure2.py` | `distinct2.json`, `needs_price.json` |
| 2. Choose the 150 | `python3 picks.py` | `picks.json` |
| 3. Harvest the storefronts | `node scrape.mjs harvest` | `harvest.json` |
| 4. Match to the picks | `node scrape.mjs match` | `matches.json` |
| 5. Download + convert art | `node scrape.mjs images` | `public/assets/img/products/*.webp` |
| 6. Assemble the catalogue | `python3 build_catalog.py` | `lib/catalog.json`, `data_quality.json` |

Steps 1, 2 and 6 need nothing but Python. Steps 3–5 need network access to
`cierraperfumes.com` and `feelnzuri.com`, and `sharp` for the image conversion
(already a dependency of Next.js).

`structure2.py` expects the sheet unzipped alongside it:

```
mkdir -p xl && cd xl && unzip -o ../Maven_Price_Matrix.xlsx
```

## Where the data comes from

- `authored_a.py` — note pyramids and descriptions written by hand for 49 of
  the 150. The last field of each row is `False` where the notes are a
  reasonable reconstruction rather than something verified.
- `houses.py` — the ten houses, their origins and their copy.
- `picks.py` — which 150, and each one's family and gender. `GF` carries a
  third flag that is `False` where the family is a judgement call.
- `build_catalog.py` — merges all of it. A perfume with no authored notes gets
  a family-level placeholder pyramid, and a perfume with no artwork on disk
  points at `_placeholder-sq.webp` instead of a broken path. Both resolve
  themselves as real data arrives: re-run step 6.

What is still outstanding is listed in `../docs-catalogue-gaps.md`. That file was
generated from `data_quality.json` and then extended by hand, so edit it directly
rather than expecting a script to reproduce it.
