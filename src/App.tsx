import Link from '@/components/Link';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import CartProvider from '@/context/CartProvider';
import AboutPage from '@/pages/AboutPage';
import CartPage from '@/pages/CartPage';
import ContactPage from '@/pages/ContactPage';
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';
import ShopPage from '@/pages/ShopPage';
import { useLocation } from '@/lib/router';

function renderPage(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return <HomePage />;
  if (segments[0] === 'shop' && segments.length === 1) return <ShopPage />;
  if (segments[0] === 'shop' && segments.length === 2) return <ProductPage slug={segments[1]} />;
  if (segments[0] === 'cart' && segments.length === 1) return <CartPage />;
  if (segments[0] === 'about' && segments.length === 1) return <AboutPage />;
  if (segments[0] === 'contact' && segments.length === 1) return <ContactPage />;
  return <NotFoundPage />;
}

function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-5 py-28 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-saffron-700">Error 404</p>
      <h1 className="font-display text-4xl text-espresso-900">This page has gone missing</h1>
      <p className="text-espresso-600">The page you are looking for may have moved. Let us help you find something good.</p>
      <Link to="/" className="rounded-full bg-espresso-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-espresso-700">
        Back to home
      </Link>
    </div>
  );
}

function App() {
  const { pathname } = useLocation();

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{renderPage(pathname)}</main>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}

export default App;
