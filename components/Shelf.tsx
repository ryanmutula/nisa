/* A grid of cards. The `.shelf` rule does the columns; this is only here
   so no page has to repeat the map. */

import type { Product } from '@/lib/types';

import ProductCard from './ProductCard';

export default function Shelf({
  products,
  id,
  style
}: {
  products: Product[];
  id?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="shelf" id={id} style={style}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
