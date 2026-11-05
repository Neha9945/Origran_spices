import CatalogGrid from '@/components/CatalogGrid';
import Link from '@/components/Link';
import { useCatalog } from '@/hooks/useCatalog';
import { CATEGORIES } from '@/lib/catalog';
import { useLocation } from '@/lib/router';

export default function ShopPage() {
  const { search } = useLocation();
  const { state, retry } = useCatalog();

  const requested = new URLSearchParams(search).get('category');
  const activeCategory = CATEGORIES.find((category) => category === requested) ?? null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-saffron-700">The collection</p>
        <h1 className="mt-3 font-display text-5xl text-espresso-900">Shop spices</h1>
        <p className="mt-5 text-lg text-espresso-600">
          Every spice is stone-ground or sealed whole, then packed in pack sizes that suit home kitchens.
        </p>
      </header>

      <nav aria-label="Filter by category" className="mt-10 flex flex-wrap gap-3">
        <CategoryChip to="/shop" label="All" active={activeCategory === null} />
        {CATEGORIES.map((category) => (
          <CategoryChip
            key={category}
            to={`/shop?category=${encodeURIComponent(category)}`}
            label={category}
            active={activeCategory === category}
          />
        ))}
      </nav>

      <div className="mt-12">
        <CatalogGrid
          state={state}
          onRetry={retry}
          emptyMessage="No spices in this category yet."
          filter={(product) => activeCategory === null || product.category === activeCategory}
        />
      </div>
    </div>
  );
}

function CategoryChip({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
        active
          ? 'bg-espresso-900 text-white shadow-md shadow-espresso-900/20'
          : 'bg-white text-espresso-800 ring-1 ring-espresso-300 hover:ring-espresso-600'
      }`}
    >
      {label}
    </Link>
  );
}
