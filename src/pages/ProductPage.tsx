import { useState, useEffect } from 'react';
import { AlertCircle, ArrowLeft, Check, ShoppingBag } from 'lucide-react';
import CatalogStatusMessage from '@/components/CatalogStatusMessage';
import Link from '@/components/Link';
import QuantityStepper from '@/components/QuantityStepper';
import { useCart } from '@/context/cart-context';
import { useCatalog } from '@/hooks/useCatalog';
import { LOW_STOCK_THRESHOLD, type Product } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const { state, retry } = useCatalog();

  if (state.status !== 'ready') {
    return (
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <CatalogStatusMessage status={state.status} onRetry={retry} />
      </div>
    );
  }

  const product = state.products.find((item) => item.slug === slug);
  if (!product) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-5 py-28 text-center">
        <AlertCircle className="h-10 w-10 text-espresso-500" />
        <h1 className="font-display text-4xl text-espresso-900">We could not find that spice</h1>
        <p className="text-espresso-600">It may have been removed or the link may be out of date.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-espresso-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-espresso-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
      </div>
    );
  }

  return <ProductDetail key={product.id} product={product} />;
}

function ProductDetail({ product }: { product: Product }) {
  const { dispatch } = useCart();
  const defaultVariant = product.variants.find((variant) => variant.stock > 0) ?? product.variants[0];
  const [selectedId, setSelectedId] = useState(defaultVariant.id);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const variant = product.variants.find((item) => item.id === selectedId) ?? defaultVariant;
  const outOfStock = variant.stock === 0;
  const selectedQuantity = Math.min(quantity, variant.stock);

  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), 2400);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  function handleAddToCart() {
    dispatch({ type: 'add', variantId: variant.id, quantity: selectedQuantity, maxQuantity: variant.stock });
    setJustAdded(true);
  }

  const stockText = outOfStock
    ? 'Currently out of stock'
    : variant.stock <= LOW_STOCK_THRESHOLD
      ? `Only ${variant.stock} left in stock`
      : 'In stock and ready to dispatch';

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-20">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-espresso-600 transition hover:text-espresso-900">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="overflow-hidden rounded-[2rem] bg-espresso-100 shadow-xl shadow-espresso-900/10">
          <img src={product.imageUrl} alt={product.name} className="aspect-square w-full object-cover" />
        </div>

        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-saffron-700">{product.category}</p>
          <h1 className="mt-3 font-display text-4xl text-espresso-900 sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-lg text-espresso-700">{product.tagline}</p>
          <p className="mt-6 text-espresso-700">{product.description}</p>
          {product.origin && (
            <p className="mt-6 text-sm text-espresso-600">
              Origin: <span className="font-semibold text-espresso-900">{product.origin}</span>
            </p>
          )}

          <div className="mt-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-espresso-700">Pack size</p>
            <div role="radiogroup" aria-label="Pack size" className="mt-3 flex flex-wrap gap-3">
              {product.variants.map((item) => {
                const active = item.id === variant.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      setSelectedId(item.id);
                      setQuantity(1);
                    }}
                    className={`rounded-2xl px-5 py-3 text-left transition ${
                      active
                        ? 'bg-espresso-900 text-white shadow-md shadow-espresso-900/20'
                        : 'bg-white text-espresso-900 ring-1 ring-espresso-300 hover:ring-espresso-600'
                    }`}
                  >
                    <span className="block font-semibold">{item.packLabel}</span>
                    <span className={`block text-sm ${active ? 'text-espresso-200' : 'text-espresso-600'}`}>
                      {formatPrice(item.retailPrice)}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className={`mt-4 text-sm font-medium ${outOfStock ? 'text-paprika-700' : 'text-leaf-700'}`}>{stockText}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {!outOfStock && (
              <QuantityStepper value={selectedQuantity} max={variant.stock} onChange={setQuantity} />
            )}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-espresso-200 disabled:text-espresso-600 ${
                justAdded ? 'bg-leaf-700 text-white' : 'bg-saffron-500 text-espresso-900 hover:bg-saffron-300'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" /> Added to cart
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> Add to cart · {formatPrice(variant.retailPrice * selectedQuantity)}
                </>
              )}
            </button>
          </div>

          {justAdded && (
            <Link to="/cart" className="mt-4 w-fit text-sm font-semibold text-espresso-900 underline decoration-saffron-500 decoration-2 underline-offset-4">
              View your cart
            </Link>
          )}

          <aside className="mt-12 rounded-2xl bg-sage-50 p-6 ring-1 ring-sage-200">
            <h2 className="font-semibold text-sage-900">Ordering for a shop or restaurant?</h2>
            <p className="mt-2 text-sm text-espresso-700">
              Bulk quantities come with wholesale pricing and minimum order sizes. We will send you a tailored quotation.
            </p>
            <Link to="/contact?topic=wholesale" className="mt-4 inline-flex text-sm font-semibold text-sage-700 underline underline-offset-4 hover:text-sage-900">
              Request a wholesale quote
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
