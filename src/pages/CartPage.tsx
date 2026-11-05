import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import CatalogStatusMessage from '@/components/CatalogStatusMessage';
import Link from '@/components/Link';
import QuantityStepper from '@/components/QuantityStepper';
import { useCart } from '@/context/cart-context';
import { useCatalog } from '@/hooks/useCatalog';
import type { CartLine } from '@/lib/cart';
import type { Product, ProductVariant } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';

interface ResolvedLine {
  line: CartLine;
  match: { product: Product; variant: ProductVariant } | null;
}

function resolveLines(lines: CartLine[], products: Product[]): ResolvedLine[] {
  const variantIndex = new Map<string, { product: Product; variant: ProductVariant }>();
  for (const product of products) {
    for (const variant of product.variants) {
      variantIndex.set(variant.id, { product, variant });
    }
  }
  return lines.map((line) => ({ line, match: variantIndex.get(line.variantId) ?? null }));
}

export default function CartPage() {
  const { lines } = useCart();
  const { state, retry } = useCatalog();

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-5 py-28 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-espresso-100 text-espresso-700">
          <ShoppingBag className="h-7 w-7" />
        </span>
        <h1 className="font-display text-4xl text-espresso-900">Your cart is empty</h1>
        <p className="text-espresso-600">Explore the collection and add your favourite spices to get started.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-espresso-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-espresso-700"
        >
          Shop spices <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (state.status !== 'ready') {
    return (
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <CatalogStatusMessage status={state.status} onRetry={retry} />
      </div>
    );
  }

  return <CartContents resolved={resolveLines(lines, state.products)} />;
}

function CartContents({ resolved }: { resolved: ResolvedLine[] }) {
  const { dispatch } = useCart();

  const { itemCount, subtotal } = resolved.reduce(
    (totals, { line, match }) => {
      if (!match || match.variant.stock === 0) return totals;
      const quantity = Math.min(line.quantity, match.variant.stock);
      return {
        itemCount: totals.itemCount + quantity,
        subtotal: totals.subtotal + match.variant.retailPrice * quantity,
      };
    },
    { itemCount: 0, subtotal: 0 }
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-20">
      <h1 className="font-display text-4xl text-espresso-900 sm:text-5xl">Your cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
        <ul className="flex flex-col gap-4">
          {resolved.map(({ line, match }) => {
            if (!match) {
              return (
                <li key={line.variantId} className="flex flex-col gap-4 rounded-3xl bg-white p-6 ring-1 ring-paprika-200 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-paprika-800">This spice is no longer available.</p>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'remove', variantId: line.variantId })}
                    className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-espresso-800 transition hover:text-paprika-700"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </li>
              );
            }

            const { product, variant } = match;
            const outOfStock = variant.stock === 0;
            const quantity = Math.min(line.quantity, variant.stock);
            const limited = !outOfStock && line.quantity > variant.stock;

            return (
              <li key={line.variantId} className="flex gap-5 rounded-3xl bg-white p-5 ring-1 ring-espresso-200/70 sm:p-6">
                <Link to={`/shop/${product.slug}`} className="shrink-0 overflow-hidden rounded-2xl bg-espresso-100">
                  <img src={product.imageUrl} alt={product.name} className="h-24 w-24 object-cover sm:h-28 sm:w-28" />
                </Link>

                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <Link to={`/shop/${product.slug}`} className="font-display text-xl text-espresso-900 hover:text-saffron-700">
                      {product.name}
                    </Link>
                    <p className="text-sm text-espresso-600">
                      {variant.packLabel} · {formatPrice(variant.retailPrice)} each
                    </p>
                    {outOfStock && <p className="text-sm font-medium text-paprika-700">Out of stock. This item is not included in your total.</p>}
                    {limited && <p className="text-sm font-medium text-ochre-700">Only {variant.stock} available. Quantity adjusted.</p>}
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    {outOfStock ? null : (
                      <QuantityStepper
                        value={quantity}
                        max={variant.stock}
                        onChange={(next) => dispatch({ type: 'set', variantId: variant.id, quantity: next, maxQuantity: variant.stock })}
                      />
                    )}
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-espresso-900">{formatPrice(variant.retailPrice * quantity)}</p>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'remove', variantId: variant.id })}
                        aria-label={`Remove ${product.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-espresso-600 transition hover:bg-paprika-50 hover:text-paprika-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-3xl bg-espresso-900 p-8 text-white lg:sticky lg:top-28">
          <h2 className="font-display text-2xl">Order summary</h2>
          <dl className="mt-6 flex flex-col gap-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-espresso-200">Items</dt>
              <dd className="font-semibold">{itemCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-espresso-200">Subtotal</dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          <p className="mt-6 border-t border-espresso-700 pt-6 text-sm text-espresso-200">
            Delivery and payment are confirmed at checkout.
          </p>
          <button
            type="button"
            disabled
            className="mt-6 w-full rounded-full bg-saffron-500/40 px-6 py-3.5 text-sm font-semibold text-espresso-100"
          >
            Checkout opens soon
          </button>
          <Link to="/shop" className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-saffron-200 hover:text-white">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
