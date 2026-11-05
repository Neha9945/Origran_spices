import { useState } from 'react';
import { Leaf, Menu, ShoppingBag, X } from 'lucide-react';
import Link from '@/components/Link';
import { useCart } from '@/context/cart-context';
import { useLocation } from '@/lib/router';

const NAV_ITEMS = [
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function SiteHeader() {
  const { pathname } = useLocation();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(to: string) {
    return pathname === to || pathname.startsWith(`${to}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-espresso-200 bg-espresso-50/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-espresso-900 text-saffron-300 transition-transform duration-500 group-hover:-rotate-12">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold tracking-[0.18em] text-espresso-900">ORIGRAN</span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.35em] text-espresso-600">Spices</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isActive(item.to) ? 'page' : undefined}
              className={`relative py-2 text-sm font-medium transition-colors ${
                isActive(item.to) ? 'text-espresso-900' : 'text-espresso-600 hover:text-espresso-900'
              } after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-saffron-500 after:transition-transform after:duration-300 ${
                isActive(item.to) ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to="/cart"
            aria-label={`Shopping cart, ${itemCount} items`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-espresso-900 transition hover:bg-espresso-100"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-saffron-500 px-1 text-[11px] font-semibold text-espresso-900">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-espresso-900 transition hover:bg-espresso-100 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-espresso-200 bg-espresso-50 px-5 py-3 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-xl px-3 py-3 text-base font-medium ${
                isActive(item.to) ? 'bg-espresso-100 text-espresso-900' : 'text-espresso-700 hover:bg-espresso-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
