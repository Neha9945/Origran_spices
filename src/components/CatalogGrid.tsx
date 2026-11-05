import CatalogStatusMessage from '@/components/CatalogStatusMessage';
import ProductCard from '@/components/ProductCard';
import type { CatalogState } from '@/hooks/useCatalog';
import type { Product } from '@/lib/catalog';

interface CatalogGridProps {
  state: CatalogState;
  onRetry: () => void;
  emptyMessage: string;
  filter?: (product: Product) => boolean;
}

export default function CatalogGrid({ state, onRetry, emptyMessage, filter = () => true }: CatalogGridProps) {
  if (state.status !== 'ready') {
    return <CatalogStatusMessage status={state.status} onRetry={onRetry} />;
  }

  const products = state.products.filter(filter);
  if (products.length === 0) {
    return <p className="py-24 text-center text-espresso-600">{emptyMessage}</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
