import { Award, Leaf, ShieldCheck, Sprout } from 'lucide-react';
import Link from '@/components/Link';
import { BUSINESS } from '@/lib/business';

const HERO_IMAGE =
  'https://images.pexels.com/photos/34375933/pexels-photo-34375933.jpeg?auto=compress&cs=tinysrgb&w=1600';

const VALUES = [
  { icon: Sprout, title: 'Honest sourcing', text: 'We buy from growers we know, and we pay them fairly for the quality they produce.' },
  { icon: Leaf, title: 'Freshness first', text: 'Small batches, milled to order and sealed quickly so aroma stays where it belongs.' },
  { icon: ShieldCheck, title: 'Clean and checked', text: 'Every lot is cleaned, sorted and tested before it reaches a pack or a pallet.' },
  { icon: Award, title: 'Built for trade', text: 'Clear bulk pricing and reliable supply for restaurants, grocers and kitchens.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8 lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-saffron-700">Our story</p>
          <h1 className="mt-4 font-display text-5xl text-espresso-900 sm:text-6xl">Good spice starts at the source.</h1>
          <p className="mt-6 text-lg text-espresso-700">
            {BUSINESS.name} began with a simple belief: the spices in your kitchen should taste the way they smell
            the moment you open the jar. We work directly with growers, grind in small batches and pack with care,
            so every order arrives vivid and aromatic.
          </p>
          <p className="mt-4 text-espresso-700">
            Today we serve home cooks, restaurants and independent grocers. Whatever your kitchen needs, we are
            happy to help you find the right pack size or bulk quantity.
          </p>
        </div>
        <div className="overflow-hidden rounded-[2rem] shadow-xl shadow-espresso-900/10">
          <img src={HERO_IMAGE} alt="A display of colourful spices in bowls" className="aspect-[4/5] w-full object-cover" />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-saffron-700">What we stand for</p>
          <h2 className="mt-3 font-display text-4xl text-espresso-900">Our promises to you</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl bg-espresso-50 p-7 ring-1 ring-espresso-200/70">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-saffron-500 text-espresso-900">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-xl text-espresso-900">{title}</h3>
                <p className="mt-3 text-sm text-espresso-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-espresso-900 p-10 text-white md:flex-row md:items-center lg:p-14">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl sm:text-4xl">Ready to cook with better spices?</h2>
            <p className="mt-4 text-espresso-100">Explore the collection or tell us what your business needs.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop" className="rounded-full bg-saffron-500 px-7 py-3.5 text-sm font-semibold text-espresso-900 transition hover:bg-saffron-300">
              Shop spices
            </Link>
            <Link to="/contact" className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
