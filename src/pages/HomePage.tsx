import { ArrowRight, Flame, Package, Sprout, Truck } from 'lucide-react';
import CatalogGrid from '@/components/CatalogGrid';
import Link from '@/components/Link';
import { useCatalog } from '@/hooks/useCatalog';
import { CATEGORIES, type ProductCategory } from '@/lib/catalog';

const HERO_IMAGE =
  'https://images.pexels.com/photos/6808985/pexels-photo-6808985.jpeg?auto=compress&cs=tinysrgb&w=1920';

const TRUST_POINTS = [
  { icon: Sprout, title: 'Sourced at origin', text: 'Direct relationships with growers in their home regions.' },
  { icon: Flame, title: 'Stone-ground fresh', text: 'Milled in small batches to keep aroma and colour intact.' },
  { icon: Package, title: 'Sealed for freshness', text: 'Airtight packs that protect every spice from light and air.' },
  { icon: Truck, title: 'Dispatched promptly', text: 'Orders leave our kitchen quickly, with tracking on every parcel.' },
];

const CATEGORY_DETAILS: Record<ProductCategory, string> = {
  'Whole Spices': 'Peppercorns, cinnamon and cardamom, kept whole for lasting aroma.',
  'Ground Spices': 'Stone-ground powders for everyday cooking and bold colour.',
  Seeds: 'Fenugreek and nigella seeds for tempering, breads and pickles.',
  Blends: 'House blends, dry-roasted and ground in our own kitchen.',
};

export default function HomePage() {
  const { state, retry } = useCatalog();

  return (
    <>
      <section className="relative isolate overflow-hidden bg-espresso-900 text-white">
        <img src={HERO_IMAGE} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-espresso-900 via-espresso-900/80 to-espresso-900/10" />
        <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-5 py-24 lg:px-8">
          <div className="animate-fade-up max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-saffron-200">
              Stone-ground in small batches
            </p>
            <h1 className="mt-6 font-display text-5xl font-medium sm:text-6xl lg:text-7xl">
              Spices with a story worth tasting.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-espresso-100">
              Vivid, aromatic and carefully sourced. Choose a pack for your kitchen, or supply your restaurant or shop
              with bulk quantities.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-saffron-500 px-7 py-3.5 text-sm font-semibold text-espresso-900 transition hover:bg-saffron-300"
              >
                Shop the collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact?topic=wholesale"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                Wholesale enquiries
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-espresso-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-saffron-50 text-saffron-700 ring-1 ring-saffron-200">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-semibold text-espresso-900">{title}</h3>
              <p className="text-sm text-espresso-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-saffron-700">Featured</p>
            <h2 className="mt-3 font-display text-4xl text-espresso-900">Favourites this season</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-espresso-900 hover:text-saffron-700">
            View all spices <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12">
          <CatalogGrid
            state={state}
            onRetry={retry}
            emptyMessage="Our featured spices will appear here soon."
            filter={(product) => product.isFeatured}
          />
        </div>
      </section>

      <section className="bg-espresso-100/70 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-saffron-700">Browse by category</p>
          <h2 className="mt-3 font-display text-4xl text-espresso-900">Find your next favourite</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/shop?category=${encodeURIComponent(category)}`}
                className="group flex min-h-[220px] flex-col justify-between rounded-3xl bg-white p-7 ring-1 ring-espresso-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-espresso-900/10"
              >
                <h3 className="font-display text-2xl text-espresso-900">{category}</h3>
                <p className="text-sm text-espresso-600">{CATEGORY_DETAILS[category]}</p>
                <span className="mt-6 flex items-center gap-2 text-sm font-semibold text-saffron-700">
                  Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] bg-espresso-900 p-10 text-white md:flex-row md:items-center lg:p-14">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl sm:text-4xl">Cooking for a restaurant or shop?</h2>
            <p className="mt-4 text-espresso-100">
              Ask about bulk quantities, wholesale pricing and minimum order sizes. We will send a tailored quotation.
            </p>
          </div>
          <Link
            to="/contact?topic=wholesale"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-saffron-500 px-7 py-3.5 text-sm font-semibold text-espresso-900 transition hover:bg-saffron-300"
          >
            Request a quotation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
