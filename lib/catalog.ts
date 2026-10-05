/* The catalogue, and the handful of lookups every page needs.
   catalog.json is the single source of truth — 150 products, 10 houses and
   9 families. To add a product, copy an object and drop three images into
   public/assets/img/products named after its id (see README). */

import raw from './catalog.json';
import type { Brand, Catalog, Family, Product } from './types';

export const catalog = raw as unknown as Catalog;

export const products: Product[] = catalog.products;
export const brands: Brand[] = catalog.brands;
export const families: Family[] = catalog.families;

const byIdMap = new Map(products.map((p) => [p.id, p]));
const brandMap = new Map(brands.map((b) => [b.slug, b]));
const familyMap = new Map(families.map((f) => [f.slug, f]));

export function byId(id: string | null | undefined): Product | undefined {
  return id ? byIdMap.get(id) : undefined;
}

export function brandOf(slug: string): Brand | undefined {
  return brandMap.get(slug);
}

export function famLabel(slug: string): string {
  return familyMap.get(slug)?.label ?? slug;
}

export function tagged(tag: string): Product[] {
  return products.filter((p) => (p.tags ?? []).includes(tag));
}

export function countInFamily(slug: string): number {
  return products.filter((p) => p.family === slug).length;
}

/** Every note on a bottle, flattened — used by search and the advisor. */
export function allNotes(p: Product): string[] {
  return [...p.notes.top, ...p.notes.heart, ...p.notes.base];
}

/** The searchable text for one product. */
export function haystack(p: Product): string {
  return `${p.name} ${p.brand} ${p.familyLabel} ${allNotes(p).join(' ')}`.toLowerCase();
}

/** Prefix a catalogue image path so it resolves from /public. */
export function asset(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}
