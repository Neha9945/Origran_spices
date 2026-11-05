import { ArrowRight } from 'lucide-react';
import Link from '@/components/Link';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/lib/catalog';

export default function ProductCard({ product }: { product: Product }) {
  const fromPrice = Math.min(...product.variants.map((variant) => variant.retailPrice));
  const inStock = product.variants.some((variant) => variant.stock > 0);

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-espresso-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-espresso-900/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-espresso-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        {!inStock && (
          <span className="absolute left-4 top-4 rounded-full bg-espresso-900/90 px-3 py-1 text-xs font-medium text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-700">{product.category}</p>
        <h3 className="font-display text-2xl text-espresso-900">{product.name}</h3>
        <p className="text-sm text-espresso-600">{product.tagline}</p>
        <div className="mt-auto flex items-center justify-between border-t border-espresso-100 pt-4">
          <p className="text-sm text-espresso-600">
            From <span className="font-semibold text-espresso-900">{formatPrice(fromPrice)}</span>
          </p>
          <span className="flex items-center gap-1 text-sm font-semibold text-espresso-900 transition-all group-hover:gap-2">
            View <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
